import { useNavigate } from 'react-router-dom'
import { Calendar, Users, Trash2, ExternalLink } from 'lucide-react'
import type { Project } from '../../types'

interface Props {
  project: Project
  onDelete: (id: string) => void
}

const ProjectCard = ({ project, onDelete }: Props) => {
  const navigate = useNavigate()

  const progress = project.stats
    ? project.stats.total > 0
      ? Math.round((project.stats.completed / project.stats.total) * 100)
      : 0
    : 0

  const isOverdue = new Date(project.dueDate) < new Date()

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition group">

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-3">
          <h3 className="text-white font-semibold text-lg truncate">
            {project.name}
          </h3>
          <p className="text-slate-400 text-sm mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => navigate(`/projects/${project.id}`)}
            className="text-slate-400 hover:text-indigo-400 transition p-1"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="text-slate-400 hover:text-red-400 transition p-1"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400 text-xs">Progress</span>
          <span className="text-white text-xs font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: 'Total', value: project.stats?.total ?? 0, color: 'text-slate-300' },
          { label: 'Todo', value: project.stats?.todo ?? 0, color: 'text-slate-400' },
          { label: 'Active', value: project.stats?.inProgress ?? 0, color: 'text-blue-400' },
          { label: 'Done', value: project.stats?.completed ?? 0, color: 'text-green-400' }
        ].map(stat => (
          <div key={stat.label} className="bg-slate-800 rounded-xl p-2 text-center">
            <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-slate-500 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Users className="w-3 h-3" />
          <span>{project.members?.length ?? 0} members</span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${isOverdue ? 'text-red-400' : 'text-slate-400'}`}>
          <Calendar className="w-3 h-3" />
          <span>
            {isOverdue ? 'Overdue · ' : ''}
            {new Date(project.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard