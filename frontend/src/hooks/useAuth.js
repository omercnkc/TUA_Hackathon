import { useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null))
    return unsub
  }, [])

  const withTimeout = (promise, ms = 10000) =>
    Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => reject({ code: 'auth/timeout' }), ms)
      ),
    ])

  const login = async (email, password) => {
    setError(null)
    setLoading(true)
    try {
      const cred = await withTimeout(signInWithEmailAndPassword(auth, email, password))
      setDoc(doc(db, 'users', cred.user.uid), { lastLogin: serverTimestamp(), email: cred.user.email }, { merge: true }).catch(() => {})
      return cred.user
    } catch (e) {
      setError(firebaseError(e.code))
      return null
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password) => {
    setError(null)
    setLoading(true)
    try {
      const cred = await withTimeout(createUserWithEmailAndPassword(auth, email, password))
      setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      }).catch(() => {})
      return cred.user
    } catch (e) {
      setError(firebaseError(e.code))
      return null
    } finally {
      setLoading(false)
    }
  }

  const logout = () => signOut(auth)

  return { user, loading, error, login, register, logout, setError }
}

function firebaseError(code) {
  const map = {
    'auth/invalid-credential':      'E-posta veya şifre hatalı.',
    'auth/user-not-found':          'Bu e-posta ile kayıtlı kullanıcı bulunamadı.',
    'auth/wrong-password':          'Şifre hatalı.',
    'auth/email-already-in-use':    'Bu e-posta zaten kullanımda.',
    'auth/weak-password':           'Şifre en az 6 karakter olmalı.',
    'auth/invalid-email':           'Geçersiz e-posta adresi.',
    'auth/too-many-requests':       'Çok fazla deneme. Lütfen bekleyin.',
    'auth/network-request-failed':  'Bağlantı hatası. İnternet bağlantınızı kontrol edin.',
    'auth/timeout':                  'Sunucu yanıt vermedi. İnternet bağlantınızı kontrol edin.',
    'auth/operation-not-allowed':    'E-posta/şifre girişi Firebase konsolundan etkinleştirilmemiş.',
  }
  return map[code] ?? 'Bir hata oluştu. Lütfen tekrar deneyin.'
}
