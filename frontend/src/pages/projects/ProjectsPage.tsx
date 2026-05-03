import { useEffect, useState } from 'react'
import { Plus, FolderKanban, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ProjectCard from '../../components/shared/ProjectCard'
import CreateProjectModal from '../../components/shared/CreateProjectModal'
import { getProjectsApi, deleteProjectApi } from '../../services/project.service'
import type { Project } from '../../types'

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [filtered, setFiltered] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')

  const fetchProjects = async () => {
    try {
      setIsLoading(true)
      const data = await getProjectsApi()
      setProjects(data.projects)
      setFiltered(data.projects)
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(projects)
    } else {
      setFiltered(
        projects.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        )
      )
    }
  }, [search, projects])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await deleteProjectApi(id)
      toast.success('Project deleted')
      fetchProjects()
    } catch {
      toast.error('Failed to delete project')
    }
  }

  return (
    <DashboardLayout title="Projects">
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-white text-2xl font-bold">All Projects</h2>
            <p className="text-slate-400 text-sm mt-1">
              {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-3 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 max-w-md">
          <Search className="text-slate-400 w-4 h-4 shrink-0" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none flex-1"
          />
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="bg-slate-800 p-4 rounded-2xl mb-4">
              <FolderKanban className="text-slate-500 w-10 h-10" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">
              {search ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {search
                ? 'Try a different search term'
                : 'Create your first project to get started'
              }
            </p>
            {!search && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-3 rounded-xl transition"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreated={fetchProjects}
        />
      )}
    </DashboardLayout>
  )
}

export default ProjectsPage