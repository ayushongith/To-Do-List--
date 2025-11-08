import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'
import { UserProfile } from '@/types'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await loadUserProfile(user.uid)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setUserProfile({
          id: docSnap.id,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          theme: data.theme || 'system',
          notificationPreferences: data.notificationPreferences || {
            email: true,
            push: true,
            reminderMinutes: 30,
          },
          createdAt: data.createdAt?.toDate() || new Date(),
        })
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const createUserProfile = async (user: User) => {
    const userRef = doc(db, 'users', user.uid)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        theme: 'system',
        notificationPreferences: {
          email: true,
          push: true,
          reminderMinutes: 30,
        },
        createdAt: serverTimestamp(),
      })
    }
  }

  const signUp = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    await createUserProfile(result.user)
  }

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    await createUserProfile(result.user)
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
