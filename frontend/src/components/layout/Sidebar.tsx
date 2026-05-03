import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
  LogOut,
  Zap,
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    label: 'Projects',
    icon: FolderKanban,
    path: '/projects'
  },
  {
    label: 'Tasks',
    icon: CheckSquare,
    path: '/tasks'
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics'
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/settings'
  }
]

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800
          z-30 flex flex-col transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Zap className="text-white w-5 h-5" />
            </div>
            <span className="text-white text-lg font-bold">FlowSprint</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition
                  ${isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name}
              </p>
              <p className="text-slate-400 text-xs truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-red-400 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar