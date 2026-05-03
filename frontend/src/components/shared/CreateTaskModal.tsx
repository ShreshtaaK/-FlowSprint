import { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { createTaskApi } from '../../services/task.service'
import { getProjectsApi } from '../../services/project.service'
import type { Project } from '../../types'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  dueDate: z.string().min(1, 'Due date is required'),
  assigneeId: z.string().min(1, 'Assignee is required'),
  projectId: z.string().min(1, 'Project is required')
})

type FormData = z.infer<typeof schema>

interface Props {
  onClose: () => void
  onCreated: () => void
}

const CreateTaskModal = ({ onClose, onCreated }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [members, setMembers] = useState<{ id: string; name: string }[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const selectedProjectId = useWatch({ control, name: 'projectId' })

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjectsApi()
      setProjects(data.projects)
    }
    fetchProjects()
  }, [])

  useEffect(() => {
  if (!selectedProjectId) return
  const project = projects.find(p => p.id === selectedProjectId)
  if (project) {
    const load = () => {
      setMembers(project.members.map(m => ({
        id: m.user.id,
        name: m.user.name
      })))
    }
    load()
  }
}, [selectedProjectId, projects])

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      await createTaskApi(data)
      toast.success('Task created successfully!')
      onCreated()
      onClose()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Failed to create task')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = "w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition"

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-white text-lg font-semibold">Create New Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Title</label>
            <input {...register('title')} placeholder="Task title" className={inputClass} />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Description</label>
            <textarea {...register('description')} placeholder="Task description" rows={3} className={`${inputClass} resize-none`} />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Project</label>
            <select {...register('projectId')} className={inputClass}>
              <option value="">Select project</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.projectId && <p className="text-red-400 text-sm mt-1">{errors.projectId.message}</p>}
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Assignee</label>
            <select {...register('assigneeId')} className={inputClass} disabled={!selectedProjectId}>
              <option value="">Select assignee</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            {errors.assigneeId && <p className="text-red-400 text-sm mt-1">{errors.assigneeId.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Priority</label>
              <select {...register('priority')} className={inputClass}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Due Date</label>
              <input {...register('dueDate')} type="date" className={inputClass} />
              {errors.dueDate && <p className="text-red-400 text-sm mt-1">{errors.dueDate.message}</p>}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl transition">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2">
              {isLoading ? <><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white" />Creating...</> : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateTaskModal