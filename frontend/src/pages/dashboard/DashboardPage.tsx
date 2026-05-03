import { useEffect, useState } from 'react'
import {
  FolderKanban,
  CheckSquare,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import toast from 'react-hot-toast'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatsCard from '../../components/shared/StatsCard'
import { getDashboardStatsApi, getAnalyticsApi } from '../../services/dashboard.service'
import type { DashboardStats, Analytics, Task } from '../../types'

const PIE_COLORS = ['#6366f1', '#f59e0b', '#8b5cf6', '#10b981']

const PRIORITY_COLORS: Record<string, string> = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444'
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, analyticsRes] = await Promise.all([
          getDashboardStatsApi(),
          getAnalyticsApi()
        ])
        setStats(statsRes.stats)
        setRecentTasks(statsRes.recentTasks)
        setUpcomingDeadlines(statsRes.upcomingDeadlines)
        setAnalytics(analyticsRes)
      } catch {
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const getPriorityColor = (priority: string) => {
    const map: Record<string, string> = {
      LOW: 'text-green-400 bg-green-400/10',
      MEDIUM: 'text-yellow-400 bg-yellow-400/10',
      HIGH: 'text-orange-400 bg-orange-400/10',
      CRITICAL: 'text-red-400 bg-red-400/10'
    }
    return map[priority] || 'text-slate-400 bg-slate-400/10'
  }

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      TODO: 'text-slate-400 bg-slate-400/10',
      IN_PROGRESS: 'text-blue-400 bg-blue-400/10',
      REVIEW: 'text-purple-400 bg-purple-400/10',
      COMPLETED: 'text-green-400 bg-green-400/10'
    }
    return map[status] || 'text-slate-400 bg-slate-400/10'
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Projects"
            value={stats?.totalProjects ?? 0}
            icon={FolderKanban}
            color="indigo"
            subtitle="All active projects"
          />
          <StatsCard
            title="Total Tasks"
            value={stats?.totalTasks ?? 0}
            icon={CheckSquare}
            color="blue"
            subtitle={`${stats?.completionRate ?? 0}% completion rate`}
          />
          <StatsCard
            title="In Progress"
            value={stats?.inProgressTasks ?? 0}
            icon={Clock}
            color="yellow"
            subtitle="Currently active"
          />
          <StatsCard
            title="Overdue"
            value={stats?.overdueTasks ?? 0}
            icon={AlertTriangle}
            color="red"
            subtitle="Needs attention"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Weekly Productivity */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-indigo-400 w-5 h-5" />
              <h2 className="text-white font-semibold">Weekly Productivity</h2>
            </div>
            {analytics?.weeklyData && analytics.weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.weeklyData}>
                  <XAxis
                    dataKey="day"
                    stroke="#475569"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <YAxis
                    stroke="#475569"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Bar
                    dataKey="completed"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    name="Completed"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-500">
                No productivity data yet
              </div>
            )}
          </div>

          {/* Task Distribution Pie */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <CheckSquare className="text-indigo-400 w-5 h-5" />
              <h2 className="text-white font-semibold">Task Distribution</h2>
            </div>
            {analytics?.tasksByStatus && analytics.tasksByStatus.some(t => t.value > 0) ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analytics.tasksByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analytics.tasksByStatus.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9'
                    }}
                  />
                  <Legend
                    wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-slate-500">
                No tasks yet
              </div>
            )}
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-indigo-400 w-5 h-5" />
            <h2 className="text-white font-semibold">Tasks by Priority</h2>
          </div>
          {analytics?.tasksByPriority && analytics.tasksByPriority.some(t => t.value > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.tasksByPriority}>
                <XAxis
                  dataKey="name"
                  stroke="#475569"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  stroke="#475569"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Tasks">
                  {analytics.tasksByPriority.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PRIORITY_COLORS[entry.name] || '#6366f1'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-slate-500">
              No priority data yet
            </div>
          )}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Tasks */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <CheckSquare className="text-indigo-400 w-5 h-5" />
              <h2 className="text-white font-semibold">Recent Tasks</h2>
            </div>
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-slate-800 rounded-xl"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-white text-sm font-medium truncate">
                        {task.title}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        {task.project?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-slate-500">
                No tasks yet
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="text-indigo-400 w-5 h-5" />
              <h2 className="text-white font-semibold">Upcoming Deadlines</h2>
            </div>
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-slate-800 rounded-xl"
                  >
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-white text-sm font-medium truncate">
                        {task.title}
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        {task.project?.name}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-orange-400 text-xs font-medium">
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-slate-500">
                No upcoming deadlines
              </div>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default DashboardPage