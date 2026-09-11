import type { Filter } from '../types'

interface FilterBarProps {
  filter: Filter
  onFilterChange: (filter: Filter) => void
  activeCount: number
  completedCount: number
  onClearCompleted: () => void
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

export function FilterBar({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
      <span className="text-slate-500 dark:text-slate-400">
        {activeCount} {activeCount === 1 ? 'task' : 'tasks'} left
      </span>

      <div className="flex gap-1 rounded-lg border border-slate-200 p-1 dark:border-slate-800">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition ${
              filter === key
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onClearCompleted}
        disabled={completedCount === 0}
        className="text-slate-500 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:text-rose-400"
      >
        Clear completed
      </button>
    </div>
  )
}
