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
      // Verificar si el username ya existe
      const usernameDoc = await getDoc(doc(db, "usernames", username))
      if (usernameDoc.exists()) {
        throw new Error("El nombre de usuario ya está en uso")
      }

      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Actualizar el perfil con el nombre
      await updateProfile(userCredential.user, {
        displayName: name,
      })

      // Guardar información adicional en Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        username,
        createdAt: new Date().toISOString(),
      })

      // Reservar el username
      await setDoc(doc(db, "usernames", username), {
        uid: userCredential.user.uid,
      })

      return userCredential.user
    } catch (error) {
      throw error
    }
  }

  // Nueva función para actualizar el perfil del usuario
  async function updateUserProfile(profileData) {
    try {
      // Verificar si hay un usuario autenticado
      if (!auth.currentUser) {
        throw new Error("No hay un usuario autenticado")
      }

      // Actualizar en Firebase Auth
      await updateProfile(auth.currentUser, profileData)
      
      // Actualizar también en Firestore
      const userRef = doc(db, "users", auth.currentUser.uid)
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      })
      
      // Actualizar el estado del usuario actual
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
        // Si hay un usuario autenticado, obtener su información adicional de Firestore
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
    updateUserProfile, // Añadimos la nueva función al contexto
    loading,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}