import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { TaskProvider } from './contexts/TaskContext'
import { ToastProvider } from './contexts/ToastContext'
import AppRouter from './routes/AppRouter'

function App() {
  useEffect(() => {
    // Add console log to verify Firebase config is loaded
    console.log('Firebase Config:', {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      // Don't log sensitive info in production
    })
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed, silent fail
      })
    }
  }, [])

  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <TaskProvider>
            <AppRouter />
          </TaskProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
