import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getMessaging, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
}

// Check if Firebase is properly configured
const isConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
                     import.meta.env.VITE_FIREBASE_PROJECT_ID

if (!isConfigured) {
  console.warn('⚠️ Firebase is not configured. Please create a .env.local file with your Firebase credentials.')
  console.warn('See .env.example for the required environment variables.')
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

// Initialize Firestore
export const db = getFirestore(app)

// Enable offline persistence (only if properly configured)
if (isConfigured) {
  enableIndexedDbPersistence(db).catch((err: any) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.')
    } else if (err.code === 'unimplemented') {
      console.warn('The current browser does not support offline persistence')
    }
  })
}

// Initialize Firebase Cloud Messaging
let messaging: ReturnType<typeof getMessaging> | null = null
isSupported().then((supported) => {
  if (supported) {
    messaging = getMessaging(app)
  }
})

export { messaging }
