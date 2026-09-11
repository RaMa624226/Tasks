import { useMemo } from 'react'
import { FilterBar } from './components/FilterBar'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { useLocalStorage } from './hooks/useLocalStorage'
import type { Filter, Priority, Task } from './types'

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

function createTask(title: string, priority: Priority, dueDate: string | null): Task {
  return {
    id: crypto.randomUUID(),
    title,
    completed: false,
    priority,
    dueDate,
    createdAt: Date.now(),
  }
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks-app:tasks', [])
  const [filter, setFilter] = useLocalStorage<Filter>('tasks-app:filter', 'all')

  function addTask(title: string, priority: Priority, dueDate: string | null) {
    setTasks((prev) => [...prev, createTask(title, priority, dueDate)])
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    )
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  function editTask(id: string, title: string) {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, title } : task)))
  }

  function clearCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed))
  }

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filter === 'active') return !task.completed
      if (filter === 'completed') return task.completed
      return true
    })
    return [...filtered].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      if (a.priority !== b.priority) return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      return a.createdAt - b.createdAt
    })
  }, [tasks, filter])

  const activeCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.length - activeCount

  return (
    <div className="min-h-svh bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Tasks
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {tasks.length === 0
              ? 'Your list is empty.'
              : `${completedCount} of ${tasks.length} done`}
          </p>
        </header>

        <TaskForm onAdd={addTask} />

        {tasks.length > 0 && (
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            activeCount={activeCount}
            completedCount={completedCount}
            onClearCompleted={clearCompleted}
          />
        )}

        <TaskList
          tasks={visibleTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />
      </div>
    </div>
  )
}
