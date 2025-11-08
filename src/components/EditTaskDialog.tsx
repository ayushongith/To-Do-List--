import { useState, useEffect } from 'react'
import { X, Calendar, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTask } from '@/contexts/TaskContext'
import { Task, Priority, ColorLabel } from '@/types'

const PRIORITY_OPTIONS: Priority[] = ['low', 'medium', 'high']

const LABEL_PRESETS: ColorLabel[] = [
  { name: 'Urgent', color: '#ef4444' },
  { name: 'Important', color: '#f97316' },
  { name: 'Work', color: '#3b82f6' },
  { name: 'Personal', color: '#8b5cf6' },
  { name: 'Shopping', color: '#10b981' },
  { name: 'Health', color: '#ec4899' },
]

interface EditTaskDialogProps {
  open: boolean
  onClose: () => void
  task: Task
}

const EditTaskDialog = ({ open, onClose, task }: EditTaskDialogProps) => {
  const { updateTask } = useTask()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [labels, setLabels] = useState<ColorLabel[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority || 'medium')
      setDueDate(task.dueAt ? new Date(task.dueAt).toISOString().split('T')[0] : '')
      setLabels(task.labels || [])
    }
  }, [task])

  const toggleLabel = (label: ColorLabel) => {
    if (labels.find((l) => l.name === label.name)) {
      setLabels(labels.filter((l) => l.name !== label.name))
    } else {
      setLabels([...labels, label])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      await updateTask(task.id, {
        title,
        description,
        priority,
        dueAt: dueDate ? new Date(dueDate) : undefined,
        labels,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!task) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Edit Task</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Task Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 text-gray-100 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add more details..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 text-gray-100 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <div className="flex gap-2">
                    {PRIORITY_OPTIONS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                          priority === p
                            ? p === 'high'
                              ? 'bg-red-500 text-white'
                              : p === 'medium'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-blue-500 text-white'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date (Optional)</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Labels */}
                <div>
                  <label className="block text-sm font-medium mb-2">Labels (Optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {LABEL_PRESETS.map((label) => (
                      <button
                        key={label.name}
                        type="button"
                        onClick={() => toggleLabel(label)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${
                          labels.find((l) => l.name === label.name)
                            ? 'ring-2 ring-white'
                            : 'hover:scale-105'
                        }`}
                        style={{
                          backgroundColor: label.color + '40',
                          color: label.color,
                        }}
                      >
                        <Tag className="w-4 h-4" />
                        {label.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-gray-100 rounded-xl font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !title.trim()}
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default EditTaskDialog
