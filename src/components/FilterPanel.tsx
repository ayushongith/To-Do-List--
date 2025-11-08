import { useTask } from '@/contexts/TaskContext'
import { Priority } from '@/types'

const FilterPanel = () => {
  const { filters, setFilters } = useTask()

  const priorities: Priority[] = ['low', 'medium', 'high']

  return (
    <div className="glass rounded-2xl p-6 space-y-6 sticky top-24">
      <h3 className="text-lg font-semibold">Filters</h3>

      {/* Priority Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Priority</label>
        <div className="space-y-2">
          <button
            onClick={() => setFilters({ ...filters, priority: undefined })}
            className={`w-full px-3 py-2 rounded-lg text-left transition-all ${
              !filters.priority ? 'bg-indigo-500 text-white' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            All
          </button>
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => setFilters({ ...filters, priority: p })}
              className={`w-full px-3 py-2 rounded-lg text-left capitalize transition-all ${
                filters.priority === p
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Completion Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Status</label>
        <div className="space-y-2">
          <button
            onClick={() => setFilters({ ...filters, completed: undefined })}
            className={`w-full px-3 py-2 rounded-lg text-left transition-all ${
              filters.completed === undefined
                ? 'bg-indigo-500 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilters({ ...filters, completed: false })}
            className={`w-full px-3 py-2 rounded-lg text-left transition-all ${
              filters.completed === false
                ? 'bg-indigo-500 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilters({ ...filters, completed: true })}
            className={`w-full px-3 py-2 rounded-lg text-left transition-all ${
              filters.completed === true
                ? 'bg-indigo-500 text-white'
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() =>
          setFilters({
            search: '',
          })
        }
        className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all"
      >
        Clear All Filters
      </button>
    </div>
  )
}

export default FilterPanel
