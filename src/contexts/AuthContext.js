"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "../firebase"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function register(name, email, username, password) {
    try {
      const usernameDoc = await getDoc(doc(db, "usernames", username))
      if (usernameDoc.exists()) {
        throw new Error("El nombre de usuario ya está en uso")
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      await updateProfile(userCredential.user, {
        displayName: name,
      })

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        username,
        createdAt: new Date().toISOString(),
      })

      await setDoc(doc(db, "usernames", username), {
        uid: userCredential.user.uid,
      })

      return userCredential.user
    } catch (error) {
      throw error
    }
  }

  async function updateUserProfile(profileData) {
    try {
      if (!auth.currentUser) {
        throw new Error("No hay un usuario autenticado")
      }

      await updateProfile(auth.currentUser, profileData)
      
      const userRef = doc(db, "users", auth.currentUser.uid)
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      })
      
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          ...profileData
        })
      }

      return true
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      throw error
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          setCurrentUser({
            ...user,
            ...userDoc.data(),
          })
        } else {
          setCurrentUser(user)
        }
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile, 
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}