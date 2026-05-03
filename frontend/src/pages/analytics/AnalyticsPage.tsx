import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  Legend, LineChart, Line
} from 'recharts'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getAnalyticsApi } from '../../services/dashboard.service'
import type { Analytics } from '../../types'

const PIE_COLORS = ['#6366f1', '#f59e0b', '#8b5cf6', '#10b981']
const tooltipStyle = {
  contentStyle: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#f1f5f9'
  }
}

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnalyticsApi()
        setAnalytics(data)
      } catch {
        toast.error('Failed to load analytics')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500" />
        </div>
      </DashboardLayout>
    )
  }

  const chartCard = (title: string, children: React.ReactNode) => (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-6">{title}</h2>
      {children}
    </div>
  )

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        <div>
          <h2 className="text-white text-2xl font-bold">Analytics Overview</h2>
          <p className="text-slate-400 text-sm mt-1">Track your team's performance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {chartCard('Task Distribution by Status',
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={analytics?.tasksByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {analytics?.tasksByStatus.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {chartCard('Tasks by Priority',
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics?.tasksByPriority}>
                <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {chartCard('Weekly Productivity',
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics?.weeklyData}>
              <XAxis dataKey="day" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        )}

        {chartCard('Tasks per Member',
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics?.tasksByMember}>
              <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {chartCard('Project Progress',
          <div className="space-y-4">
            {analytics?.projectProgress.map(project => (
              <div key={project.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">{project.name}</span>
                  <span className="text-slate-400 text-sm">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-slate-500 text-xs">{project.completed} completed</span>
                  <span className="text-slate-500 text-xs">{project.total} total</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default AnalyticsPage