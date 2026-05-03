import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout