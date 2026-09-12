import { useEffect, useRef, useState } from 'react'
import type { Task } from '../types'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, title: string) => void
}

const PRIORITY_STYLES: Record<Task['priority'], string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  high: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

function isOverdue(dueDate: string | null, completed: boolean) {
  if (!dueDate || completed) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

function formatDate(dueDate: string) {
  return new Date(`${dueDate}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(task.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  function commitEdit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== task.title) {
      onEdit(task.id, trimmed)
    } else {
      setDraft(task.title)
    }
    setIsEditing(false)
  }

  const overdue = isOverdue(task.dueDate, task.completed)

  return (
    <li className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        onClick={() => onToggle(task.id)}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
          task.completed
            ? 'border-indigo-600 bg-indigo-600 text-white'
            : 'border-slate-300 text-transparent hover:border-indigo-500 dark:border-slate-600'
        }`}
      >
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
          <path
            d="M2 6l2.5 2.5L10 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitEdit()
              if (e.key === 'Escape') {
                setDraft(task.title)
                setIsEditing(false)
              }
            }}
            className="w-full rounded border border-indigo-400 bg-transparent px-1 py-0.5 text-sm text-slate-900 focus:outline-none dark:text-slate-100"
          />
        ) : (
          <p
            onDoubleClick={() => setIsEditing(true)}
            className={`truncate text-sm ${
              task.completed
                ? 'text-slate-400 line-through dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_STYLES[task.priority]}`}
          >
            {task.priority}
          </span>
          {task.dueDate && (
            <span
              className={`text-xs ${overdue ? 'font-medium text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}
            >
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setIsEditing(true)}
        aria-label="Edit task"
        className="shrink-0 rounded p-1 text-slate-400 opacity-0 transition hover:text-indigo-600 group-hover:opacity-100 dark:hover:text-indigo-400"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M13.5 3.5a1.5 1.5 0 0 1 2.12 0l.88.88a1.5 1.5 0 0 1 0 2.12L7.5 15.5 4 16.5 5 13 13.5 3.5Z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="shrink-0 rounded p-1 text-slate-400 opacity-0 transition hover:text-rose-600 group-hover:opacity-100 dark:hover:text-rose-400"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8 2a1 1 0 0 0-1 1v1H4a1 1 0 1 0 0 2h.5l.7 10a2 2 0 0 0 2 1.9h5.6a2 2 0 0 0 2-1.9l.7-10H16a1 1 0 1 0 0-2h-3V3a1 1 0 0 0-1-1H8Zm1 2h2V3H9v1ZM7.9 6l.63 10h2.94L12.1 6H7.9Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </li>
  )
}
