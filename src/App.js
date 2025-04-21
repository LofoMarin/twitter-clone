"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import ResetPassword from "./components/auth/ResetPassword"
import Timeline from "./components/timeline/Timeline"
import Profile from "./components/profile/Profile"
import Navbar from "./components/layout/Navbar"
import { useEffect, useState } from "react"
import "./App.css"
import "./twitter-clone-theme.css"

// Create a separate component for routes that need authentication
function AppRoutes() {
  const { currentUser, loading } = useAuth()
  const [authChecked, setAuthChecked] = useState(false)

  // Wait for auth state to be determined
  useEffect(() => {
    const checkAuthTimeout = setTimeout(() => {
      setAuthChecked(true)
    }, 1000)

    return () => clearTimeout(checkAuthTimeout)
  }, [])

  // Show a loading state while checking authentication
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="layout-container">
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/" element={currentUser ? <Timeline /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </>
  )
}

// Main App component that doesn't use useAuth()
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
