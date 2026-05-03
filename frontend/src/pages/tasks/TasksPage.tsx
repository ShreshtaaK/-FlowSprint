import { useEffect, useState } from 'react'
import { Plus, CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import CreateTaskModal from '../../components/shared/CreateTaskModal'
import { getTasksApi, updateTaskStatusApi, deleteTaskApi } from '../../services/task.service'
import type { Task, TaskStatus } from '../../types'

const statusOptions = ['ALL', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED']
const priorityOptions = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

const priorityColor: Record<string, string> = {
  LOW: 'text-green-400 bg-green-400/10',
  MEDIUM: 'text-yellow-400 bg-yellow-400/10',
  HIGH: 'text-orange-400 bg-orange-400/10',
  CRITICAL: 'text-red-400 bg-red-400/10'
}

const statusColor: Record<string, string> = {
  TODO: 'text-slate-400 bg-slate-400/10',
  IN_PROGRESS: 'text-blue-400 bg-blue-400/10',
  REVIEW: 'text-purple-400 bg-purple-400/10',
  COMPLETED: 'text-green-400 bg-green-400/10'
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const data = await getTasksApi({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        priority: priorityFilter !== 'ALL' ? priorityFilter : undefined
      })
      setTasks(data.tasks)
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [statusFilter, priorityFilter])

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTaskStatusApi(taskId, status)
      toast.success('Status updated')
      fetchTasks()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTaskApi(id)
      toast.success('Task deleted')
      fetchTasks()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  return (
    <DashboardLayout title="Tasks">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-white text-2xl font-bold">All Tasks</h2>
            <p className="text-slate-400 text-sm mt-1">{tasks.length} tasks found</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-3 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Status:</span>
            <div className="flex gap-1">
              {statusOptions.map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    statusFilter === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Priority:</span>
            <div className="flex gap-1">
              {priorityOptions.map(p => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    priorityFilter === p
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500" />
          </div>
        ) : tasks.length > 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Task</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Project</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Assignee</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Priority</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Status</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Due Date</th>
                    <th className="text-left text-slate-400 text-sm font-medium px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-slate-800/50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white text-sm font-medium">{task.title}</p>
                          <p className="text-slate-500 text-xs mt-1 line-clamp-1">{task.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-400 text-sm">{task.project?.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                            {task.assignee?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-slate-400 text-sm">{task.assignee?.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${priorityColor[task.priority]}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={task.status}
                          onChange={e => handleStatusChange(task.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-lg font-medium bg-transparent border-0 cursor-pointer focus:outline-none ${statusColor[task.status]}`}
                        >
                          {(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'] as TaskStatus[]).map(s => (
                            <option key={s} value={s} className="bg-slate-800 text-white">
                              {s.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm ${task.isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-slate-500 hover:text-red-400 transition text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="bg-slate-800 p-4 rounded-2xl mb-4">
              <CheckSquare className="text-slate-500 w-10 h-10" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No tasks found</h3>
            <p className="text-slate-400 text-sm mb-6">Create your first task to get started</p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-3 rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              Create Task
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreated={fetchTasks}
        />
      )}
    </DashboardLayout>
  )
}

export default TasksPage