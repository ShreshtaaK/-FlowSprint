import { Menu, Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface TopbarProps {
  onMenuClick: () => void
  title: string
}

const Topbar = ({ onMenuClick, title }: TopbarProps) => {
  const { user } = useAuth()

  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-white transition"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-semibold">{title}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2">
          <Search className="text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none w-40"
          />
        </div>

        {/* Notifications */}
        <button className="relative bg-slate-800 border border-slate-700 p-2 rounded-xl text-slate-400 hover:text-white transition">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="bg-indigo-600 rounded-full w-9 h-9 flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}

export default Topbar