import { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import { useTask } from '@/contexts/TaskContext'
import { format, startOfDay, subDays, isWithinInterval } from 'date-fns'
import { CheckCircle2, Clock, TrendingUp, Target } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const StatsPanel = () => {
  const { tasks } = useTask()

  const stats = useMemo(() => {
    const total = tasks.filter((t) => !t.archived).length
    const completed = tasks.filter((t) => t.completed && !t.archived).length
    const active = total - completed
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    // Priority breakdown
    const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed && !t.archived).length
    const mediumPriority = tasks.filter((t) => t.priority === 'medium' && !t.completed && !t.archived).length
    const lowPriority = tasks.filter((t) => t.priority === 'low' && !t.completed && !t.archived).length

    // Last 7 days activity
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i))
      const nextDay = startOfDay(subDays(new Date(), 5 - i))
      
      const completedOnDay = tasks.filter((t) =>
        t.completed &&
        t.updatedAt &&
        isWithinInterval(t.updatedAt, { start: date, end: nextDay })
      ).length

      return {
        date: format(date, 'EEE'),
        completed: completedOnDay,
      }
    })

    return {
      total,
      completed,
      active,
      completionRate,
      highPriority,
      mediumPriority,
      lowPriority,
      last7Days,
    }
  }, [tasks])

  const pieData = {
    labels: ['Completed', 'Active'],
    datasets: [
      {
        data: [stats.completed, stats.active],
        backgroundColor: ['#10b981', '#6366f1'],
        borderColor: ['#059669', '#4f46e5'],
        borderWidth: 2,
      },
    ],
  }

  const barData = {
    labels: stats.last7Days.map((d) => d.date),
    datasets: [
      {
        label: 'Tasks Completed',
        data: stats.last7Days.map((d) => d.completed),
        backgroundColor: '#6366f1',
        borderColor: '#4f46e5',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#fff',
        },
      },
    },
  }

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff',
          stepSize: 1,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Tasks</span>
            <Target className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Active</span>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold">{stats.active}</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Completion Rate</span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold">{stats.completionRate}%</p>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Active Tasks by Priority</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>High Priority</span>
            </div>
            <span className="font-semibold">{stats.highPriority}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Medium Priority</span>
            </div>
            <span className="font-semibold">{stats.mediumPriority}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Low Priority</span>
            </div>
            <span className="font-semibold">{stats.lowPriority}</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Task Distribution</h3>
          <div className="h-64">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Last 7 Days Activity</h3>
          <div className="h-64">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPanel
