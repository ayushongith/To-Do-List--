export type Priority = 'low' | 'medium' | 'high'

export type ColorLabel = {
  name: string
  color: string
}

export interface Subtask {
  id: string
  taskId: string
  title: string
  completed: boolean
  orderIndex: number
  createdAt: Date
}

export interface Task {
  id: string
  listId: string
  userId: string
  title: string
  description?: string
  priority: Priority
  dueAt?: Date
  labels: ColorLabel[]
  completed: boolean
  archived: boolean
  orderIndex: number
  createdAt: Date
  updatedAt: Date
  subtasks?: Subtask[]
}

export interface TaskList {
  id: string
  userId: string
  title: string
  color: string
  orderIndex: number
  archived: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  theme: 'light' | 'dark' | 'system'
  notificationPreferences: {
    email: boolean
    push: boolean
    reminderMinutes: number
  }
  createdAt: Date
}

export interface Activity {
  id: string
  userId: string
  type: 'created' | 'completed' | 'updated' | 'deleted'
  taskId: string
  taskTitle: string
  at: Date
}

export interface DailyStats {
  date: string
  tasksCreated: number
  tasksCompleted: number
  completionRate: number
}

export interface FilterOptions {
  search: string
  priority?: Priority
  completed?: boolean
  dateRange?: {
    start: Date
    end: Date
  }
  labels?: string[]
}
