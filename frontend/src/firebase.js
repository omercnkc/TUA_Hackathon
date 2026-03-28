import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyCKjlMwPnA0hi99FngY0xwxKcEdULbAwbE',
  authDomain: 'tua-project-5dc92.firebaseapp.com',
  projectId: 'tua-project-5dc92',
  storageBucket: 'tua-project-5dc92.firebasestorage.app',
  messagingSenderId: '218545014606',
  appId: '1:218545014606:web:a5c00b5b1344f40d3ac01f',
  measurementId: 'G-09THNTSHDG',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const analytics = getAnalytics(app)
