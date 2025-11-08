import { useMemo } from 'react'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTask } from '@/contexts/TaskContext'
import TaskCard from './TaskCard'

interface TaskListProps {
  listId?: string | null
  archived?: boolean
}

const TaskList = ({ listId, archived = false }: TaskListProps) => {
  const { getFilteredTasks, reorderTasks } = useTask()

  const filteredTasks = useMemo(() => {
    const filtered = getFilteredTasks(listId || undefined)
    return filtered.filter((t) => t.archived === archived)
  }, [getFilteredTasks, listId, archived])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = filteredTasks.findIndex((t) => t.id === active.id)
    const newIndex = filteredTasks.findIndex((t) => t.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const reordered = [...filteredTasks]
    const [moved] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, moved)

    reorderTasks(reordered)
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {archived ? 'No archived tasks' : 'Create your first task to get started'}
        </p>
      </div>
    )
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={filteredTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default TaskList
