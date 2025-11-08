import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { collection, doc, deleteDoc, updateDoc, Timestamp, query, where, onSnapshot, serverTimestamp, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Task, TaskList, Subtask, FilterOptions } from '@/types'
import { useAuth } from './AuthContext'
import { useToast } from './ToastContext'

interface TaskContextType {
  tasks: Task[]
  lists: TaskList[]
  loading: boolean
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  updateList: (listId: string, updates: Partial<TaskList>) => Promise<void>
  deleteList: (listId: string) => Promise<void>
  reorderLists: (lists: TaskList[]) => Promise<void>
  createTask: (listId: string, task: Partial<Task>) => Promise<void>
  updateTask: (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
  toggleTaskComplete: (taskId: string) => Promise<void>
  archiveTask: (taskId: string) => Promise<void>
  reorderTasks: (listId: string, tasks: Task[]) => Promise<void>
  addSubtask: (taskId: string, title: string) => Promise<void>
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => Promise<void>
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>
  toggleSubtaskComplete: (taskId: string, subtaskId: string) => Promise<void>
  getFilteredTasks: (listId?: string) => Task[]
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [lists, setLists] = useState<TaskList[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
  })
  
  // Get the toast function when needed inside methods
  const { showToast } = useToast()

  // Real-time listeners for lists
  useEffect(() => {
    if (!user) {
      setLists([])
      setLoading(false)
      return
    }

    // First, get the current lists to maintain order
    const currentLists = [...lists]
    
    const q = query(
      collection(db, 'lists'),
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listsData: TaskList[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        listsData.push({
          id: doc.id,
          userId: data.userId,
          title: data.title,
          color: data.color,
          orderIndex: data.orderIndex || 0, // Ensure orderIndex has a default value
          archived: data.archived || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        })
      })
      
      // Sort lists by orderIndex
      listsData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
      
      // Only update if there are actual changes to prevent unnecessary re-renders
      if (JSON.stringify(listsData) !== JSON.stringify(currentLists)) {
        setLists(listsData)
      }
    })

    return unsubscribe
  }, [user])

  // Real-time listeners for tasks
  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    // First, get the current tasks to maintain order
    const currentTasks = [...tasks]
    
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        tasksData.push({
          id: doc.id,
          listId: data.listId,
          userId: data.userId,
          title: data.title,
          description: data.description || '',
          priority: data.priority || 'medium',
          dueAt: data.dueAt ? (data.dueAt as Timestamp).toDate() : undefined,
          labels: data.labels || [],
          completed: data.completed || false,
          archived: data.archived || false,
          orderIndex: data.orderIndex || 0, // Ensure orderIndex has a default value
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          subtasks: data.subtasks || [],
        })
      })
      
      // Sort tasks by orderIndex
      tasksData.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
      
      // Only update if there are actual changes to prevent unnecessary re-renders
      if (JSON.stringify(tasksData) !== JSON.stringify(currentTasks)) {
        setTasks(tasksData)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  // List operations
  const updateList = async (listId: string, updates: Partial<TaskList>) => {
    try {
      await updateDoc(doc(db, 'lists', listId), {
        ...updates,
        updatedAt: serverTimestamp(),
      })
      showToast('success', 'List updated successfully')
    } catch (error) {
      showToast('error', 'Failed to update list')
      console.error(error)
    }
  }

  const deleteList = async (listId: string) => {
    try {
      // Delete all tasks in the list
      const listTasks = tasks.filter((t) => t.listId === listId)
      await Promise.all(listTasks.map((t) => deleteDoc(doc(db, 'tasks', t.id))))
      
      await deleteDoc(doc(db, 'lists', listId))
      showToast('success', 'List deleted successfully')
    } catch (error) {
      showToast('error', 'Failed to delete list')
      console.error(error)
    }
  }

  const reorderLists = async (reorderedLists: TaskList[]) => {
    try {
      await Promise.all(
        reorderedLists.map((list, index) =>
          updateDoc(doc(db, 'lists', list.id), { orderIndex: index })
        )
      )
    } catch (error) {
      showToast('error', 'Failed to reorder lists')
      console.error(error)
    }
  }

  // Task operations
  const createTask = async (listId: string, task: Partial<Task>) => {
    if (!user) return
    try {
      const listTasks = tasks.filter((t) => t.listId === listId && !t.archived)
      await addDoc(collection(db, 'tasks'), {
        userId: user.uid,
        listId,
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueAt: task.dueAt ? Timestamp.fromDate(task.dueAt) : null,
        labels: task.labels || [],
        completed: false,
        archived: false,
        orderIndex: listTasks.length,
        subtasks: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      showToast('success', 'Task created successfully')
    } catch (error) {
      showToast('error', 'Failed to create task')
      console.error(error)
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const updateData: any = { ...updates, updatedAt: serverTimestamp() }
      if (updates.dueAt) {
        updateData.dueAt = Timestamp.fromDate(updates.dueAt)
      }
      await updateDoc(doc(db, 'tasks', taskId), updateData)
      showToast('success', 'Task updated successfully')
    } catch (error) {
      showToast('error', 'Failed to update task')
      console.error(error)
    }
  }

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId))
      showToast('success', 'Task deleted successfully')
    } catch (error) {
      showToast('error', 'Failed to delete task')
      console.error(error)
    }
  }

  const toggleTaskComplete = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return
    
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        completed: !task.completed,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      showToast('error', 'Failed to update task')
      console.error(error)
    }
  }

  const archiveTask = async (taskId: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        archived: true,
        updatedAt: serverTimestamp(),
      })
      showToast('success', 'Task archived successfully')
    } catch (error) {
      showToast('error', 'Failed to archive task')
      console.error(error)
    }
  }

  const reorderTasks = async (listId: string, reorderedTasks: Task[]) => {
    try {
      await Promise.all(
        reorderedTasks.map((task, index) =>
          updateDoc(doc(db, 'tasks', task.id), { orderIndex: index })
        )
      )
    } catch (error) {
      showToast('error', 'Failed to reorder tasks')
      console.error(error)
    }
  }

  // Subtask operations
  const addSubtask = async (taskId: string, title: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      const newSubtask: Subtask = {
        id: Math.random().toString(36).substring(7),
        taskId,
        title,
        completed: false,
        orderIndex: task.subtasks?.length || 0,
        createdAt: new Date(),
      }

      await updateDoc(doc(db, 'tasks', taskId), {
        subtasks: [...(task.subtasks || []), newSubtask],
        updatedAt: serverTimestamp(),
      })
      showToast('success', 'Subtask added successfully')
    } catch (error) {
      showToast('error', 'Failed to add subtask')
      console.error(error)
    }
  }

  const updateSubtask = async (taskId: string, subtaskId: string, updates: Partial<Subtask>) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      const updatedSubtasks = task.subtasks?.map((st) =>
        st.id === subtaskId ? { ...st, ...updates } : st
      )

      await updateDoc(doc(db, 'tasks', taskId), {
        subtasks: updatedSubtasks,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      showToast('error', 'Failed to update subtask')
      console.error(error)
    }
  }

  const deleteSubtask = async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      const updatedSubtasks = task.subtasks?.filter((st) => st.id !== subtaskId)

      await updateDoc(doc(db, 'tasks', taskId), {
        subtasks: updatedSubtasks,
        updatedAt: serverTimestamp(),
      })
      showToast('success', 'Subtask deleted successfully')
    } catch (error) {
      showToast('error', 'Failed to delete subtask')
      console.error(error)
    }
  }

  const toggleSubtaskComplete = async (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      const updatedSubtasks = task.subtasks?.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )

      await updateDoc(doc(db, 'tasks', taskId), {
        subtasks: updatedSubtasks,
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      showToast('error', 'Failed to update subtask')
      console.error(error)
    }
  }

  // Filter tasks
  const getFilteredTasks = useCallback(
    (listId?: string) => {
      let filtered = tasks

      // Filter by list
      if (listId) {
        filtered = filtered.filter((t) => t.listId === listId)
      }

      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(searchLower) ||
            t.description?.toLowerCase().includes(searchLower)
        )
      }

      // Filter by priority
      if (filters.priority) {
        filtered = filtered.filter((t) => t.priority === filters.priority)
      }

      // Filter by completed
      if (filters.completed !== undefined) {
        filtered = filtered.filter((t) => t.completed === filters.completed)
      }

      // Filter by date range
      if (filters.dateRange) {
        filtered = filtered.filter((t) => {
          if (!t.dueAt) return false
          return (
            t.dueAt >= filters.dateRange!.start && t.dueAt <= filters.dateRange!.end
          )
        })
      }

      // Filter by labels
      if (filters.labels && filters.labels.length > 0) {
        filtered = filtered.filter((t) =>
          t.labels.some((label) => filters.labels!.includes(label.name))
        )
      }

      return filtered
    },
    [tasks, filters]
  )

  const value = {
    tasks,
    lists,
    loading,
    filters,
    setFilters,
    updateList,
    deleteList,
    reorderLists,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    archiveTask,
    reorderTasks,
    addSubtask,
    updateSubtask,
    deleteSubtask,
    toggleSubtaskComplete,
    getFilteredTasks,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
