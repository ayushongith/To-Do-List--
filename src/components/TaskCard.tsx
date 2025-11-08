import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import {
  GripVertical,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp,
  Trash2,
  Archive,
  Edit,
  Plus,
} from 'lucide-react'
import { format } from 'date-fns'
import { Task } from '@/types'
import { useTask } from '@/contexts/TaskContext'
import clsx from 'clsx'
import EditTaskDialog from './EditTaskDialog'

interface TaskCardProps {
  task: Task
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })
  const { toggleTaskComplete, deleteTask, archiveTask, addSubtask, toggleSubtaskComplete } =
    useTask()
  const [expanded, setExpanded] = useState(false)
  const [showSubtaskInput, setShowSubtaskInput] = useState(false)
  const [subtaskTitle, setSubtaskTitle] = useState('')
  const [showEditDialog, setShowEditDialog] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  }

  const handleAddSubtask = async () => {
    if (!subtaskTitle.trim()) return
    await addSubtask(task.id, subtaskTitle)
    setSubtaskTitle('')
    setShowSubtaskInput(false)
  }

  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0
  const totalSubtasks = task.subtasks?.length || 0

  return (
    <div ref={setNodeRef} style={style} className={clsx(isDragging && 'opacity-50')}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-4 hover:shadow-lg transition-all"
      >
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="mt-1 p-1 hover:bg-white/10 rounded cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-5 h-5 text-gray-400" />
          </button>

          {/* Checkbox */}
          <button
            onClick={() => toggleTaskComplete(task.id)}
            className={clsx(
              'mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
              task.completed
                ? 'bg-indigo-500 border-indigo-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
            )}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3
                  className={clsx(
                    'font-medium mb-1',
                    task.completed && 'line-through text-gray-400'
                  )}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {task.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Priority */}
                  <span
                    className={clsx(
                      'px-2 py-1 rounded-full text-white font-medium',
                      priorityColors[task.priority]
                    )}
                  >
                    {task.priority}
                  </span>

                  {/* Due Date */}
                  {task.dueAt && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-full">
                      <Calendar className="w-3 h-3" />
                      {format(task.dueAt, 'MMM d, yyyy')}
                    </span>
                  )}

                  {/* Labels */}
                  {task.labels.map((label, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1 px-2 py-1 rounded-full"
                      style={{ backgroundColor: label.color + '20', color: label.color }}
                    >
                      <Tag className="w-3 h-3" />
                      {label.name}
                    </span>
                  ))}

                  {/* Subtasks Progress */}
                  {totalSubtasks > 0 && (
                    <span className="px-2 py-1 bg-white/10 rounded-full">
                      {completedSubtasks}/{totalSubtasks} subtasks
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {totalSubtasks > 0 && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {expanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => setShowEditDialog(true)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Edit task"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => archiveTask(task.id)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  title="Archive task"
                >
                  <Archive className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtasks */}
            {expanded && (
              <div className="mt-4 space-y-2 pl-4 border-l-2 border-white/10">
                {task.subtasks?.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSubtaskComplete(task.id, subtask.id)}
                      className={clsx(
                        'w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
                        subtask.completed
                          ? 'bg-indigo-500 border-indigo-500'
                          : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
                      )}
                    >
                      {subtask.completed && (
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <span
                      className={clsx(
                        'text-sm',
                        subtask.completed && 'line-through text-gray-400'
                      )}
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}

                {/* Add Subtask */}
                {showSubtaskInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={subtaskTitle}
                      onChange={(e) => setSubtaskTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                      placeholder="Subtask title..."
                      className="flex-1 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      autoFocus
                    />
                    <button
                      onClick={handleAddSubtask}
                      className="px-2 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowSubtaskInput(false)
                        setSubtaskTitle('')
                      }}
                      className="px-2 py-1 text-sm hover:bg-white/10 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSubtaskInput(true)}
                    className="flex items-center gap-1 text-sm text-indigo-500 hover:text-indigo-600"
                  >
                    <Plus className="w-4 h-4" />
                    Add subtask
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Edit Task Dialog */}
      {showEditDialog && (
        <EditTaskDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          task={task}
        />
      )}
    </div>
  )
}


export default TaskCard
