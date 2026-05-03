import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getTasksApi, updateTaskStatusApi } from '../../services/task.service'
import type { Task, TaskStatus } from '../../types'

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'TODO', label: 'To Do', color: 'border-slate-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'border-blue-500' },
  { id: 'REVIEW', label: 'Review', color: 'border-purple-500' },
  { id: 'COMPLETED', label: 'Completed', color: 'border-green-500' }
]

const priorityColor: Record<string, string> = {
  LOW: 'text-green-400 bg-green-400/10',
  MEDIUM: 'text-yellow-400 bg-yellow-400/10',
  HIGH: 'text-orange-400 bg-orange-400/10',
  CRITICAL: 'text-red-400 bg-red-400/10'
}

const KanbanPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const data = await getTasksApi()
      setTasks(data.tasks)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter(t => t.status === status)

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId) return

    const newStatus = destination.droppableId as TaskStatus

    setTasks(prev =>
      prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t)
    )

    try {
      await updateTaskStatusApi(draggableId, newStatus)
      toast.success('Task moved successfully')
    } catch {
      toast.error('Failed to update task')
      fetchTasks()
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Kanban Board">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Kanban Board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 h-full">
          {columns.map(col => (
            <div key={col.id} className="flex flex-col">
              {/* Column Header */}
              <div className={`flex items-center justify-between mb-3 pb-3 border-b-2 ${col.color}`}>
                <h3 className="text-white font-semibold">{col.label}</h3>
                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-lg">
                  {getTasksByStatus(col.id).length}
                </span>
              </div>

              {/* Droppable Column */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 min-h-32 p-2 rounded-xl transition ${
                      snapshot.isDraggingOver ? 'bg-slate-800/50' : ''
                    }`}
                  >
                    {getTasksByStatus(col.id).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-slate-900 border border-slate-800 rounded-xl p-4 cursor-grab active:cursor-grabbing transition ${
                              snapshot.isDragging ? 'shadow-lg shadow-indigo-500/20 border-indigo-500/50' : ''
                            }`}
                          >
                            <p className="text-white text-sm font-medium mb-2">{task.title}</p>
                            <p className="text-slate-500 text-xs mb-3 line-clamp-2">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <span className={`text-xs px-2 py-1 rounded-lg font-medium ${priorityColor[task.priority]}`}>
                                {task.priority}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="bg-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">
                                  {task.assignee?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-slate-500 text-xs">
                                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                                    month: 'short', day: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </DashboardLayout>
  )
}

export default KanbanPage