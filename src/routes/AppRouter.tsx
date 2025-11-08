import { useAuth } from '@/contexts/AuthContext'
import LoginPage from '@/pages/LoginPage'
import Dashboard from '@/pages/Dashboard'

const AppRouter = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="glass rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  return user ? <Dashboard /> : <LoginPage />
}

export default AppRouter
