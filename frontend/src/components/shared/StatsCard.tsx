import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  color: 'indigo' | 'green' | 'yellow' | 'red' | 'purple' | 'blue'
  subtitle?: string
}

const colorMap = {
  indigo: {
    bg: 'bg-indigo-500/10',
    icon: 'text-indigo-400',
    border: 'border-indigo-500/20'
  },
  green: {
    bg: 'bg-green-500/10',
    icon: 'text-green-400',
    border: 'border-green-500/20'
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    icon: 'text-yellow-400',
    border: 'border-yellow-500/20'
  },
  red: {
    bg: 'bg-red-500/10',
    icon: 'text-red-400',
    border: 'border-red-500/20'
  },
  purple: {
    bg: 'bg-purple-500/10',
    icon: 'text-purple-400',
    border: 'border-purple-500/20'
  },
  blue: {
    bg: 'bg-blue-500/10',
    icon: 'text-blue-400',
    border: 'border-blue-500/20'
  }
}

const StatsCard = ({ title, value, icon: Icon, color, subtitle }: StatsCardProps) => {
  const colors = colorMap[color]
  return (
    <div className={`bg-slate-900 border ${colors.border} rounded-2xl p-6 flex items-center gap-4`}>
      <div className={`${colors.bg} p-3 rounded-xl`}>
        <Icon className={`${colors.icon} w-6 h-6`} />
      </div>
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {subtitle && (
          <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export default StatsCard