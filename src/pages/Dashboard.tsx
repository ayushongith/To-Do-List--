import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Plus,
  Search,
  Archive,
  BarChart3,
  LogOut,
  Sun,
  Moon,
  Monitor,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useTask } from '@/contexts/TaskContext'
import TaskList from '@/components/TaskList'
import CreateTaskDialog from '@/components/CreateTaskDialog'
import StatsPanel from '@/components/StatsPanel'

type View = 'tasks' | 'archive' | 'stats'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const { filters, setFilters, lists } = useTask()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [view, setView] = useState<View>('tasks')
  const [showCreateTask, setShowCreateTask] = useState(false)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  
  // Set the first list as selected when lists are loaded
  useEffect(() => {
    const activeLists = lists.filter(list => !list.archived)
    if (activeLists.length > 0 && !selectedListId) {
      setSelectedListId(activeLists[0].id)
    }
  }, [lists, selectedListId])

  const handleSignOut = async () => {
    await signOut()
  }

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-5 h-5" />
    if (theme === 'dark') return <Moon className="w-5 h-5" />
    return <Monitor className="w-5 h-5" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 h-full w-72 glass border-r border-white/10 z-40 flex flex-col"
          >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h1 className="text-xl font-bold">TaskFlow</h1>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filters.search ? 'Search results' : 'Your tasks'}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                onClick={() => setView('tasks')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  view === 'tasks'
                    ? 'bg-indigo-500 text-white'
                    : 'hover:bg-white/10'
                }`}
              >
                <Menu className="w-5 h-5" />
                <span className="font-medium">My Tasks</span>
              </button>

              <button
                onClick={() => setView('stats')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  view === 'stats'
                    ? 'bg-indigo-500 text-white'
                    : 'hover:bg-white/10'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Statistics</span>
              </button>

              <button
                onClick={() => setView('archive')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  view === 'archive'
                    ? 'bg-indigo-500 text-white'
                    : 'hover:bg-white/10'
                }`}
              >
                <Archive className="w-5 h-5" />
                <span className="font-medium">Archive</span>
              </button>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <button
                onClick={cycleTheme}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all"
              >
                {getThemeIcon()}
                <span className="font-medium capitalize">{theme}</span>
              </button>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        {/* Header */}
        <header className="glass border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
              <h1 className="text-2xl font-bold">My Tasks</h1>
            </div>

            <div className="flex items-center gap-2">
              {view === 'tasks' && (
                <div className="w-full">
                  <button
                    onClick={() => setShowCreateTask(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span>New Task</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Search Bar */}
          {view === 'tasks' && (
            <div className="px-4 pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          )}
        </header>

        {/* Content Area */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            {view === 'tasks' && (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TaskList listId={selectedListId} />
              </motion.div>
            )}

            {view === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <StatsPanel />
              </motion.div>
            )}

            {view === 'archive' && (
              <motion.div
                key="archive"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <TaskList listId={selectedListId} archived />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Dialogs */}
      <CreateTaskDialog
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        listId={selectedListId}
      />
    </div>
  )
}

export default Dashboard
