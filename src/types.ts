export type Priority = 'low' | 'medium' | 'high'

export type Filter = 'all' | 'active' | 'completed'

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: Priority
  dueDate: string | null
  createdAt: number
}
