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

import { GrowthBook } from "@growthbook/growthbook";
import { GrowthBookProvider } from "@growthbook/growthbook-react";
import { autoAttributesPlugin } from "@growthbook/growthbook/plugins";

const growthbook = new GrowthBook({
  apiHost: "https://cdn.growthbook.io",
  clientKey: "sdk-EOldaSwv0zY3cSQj",
  enableDevMode: true,
  trackingCallback: (experiment, result) => {
    // This is where you would send an event to your analytics provider
    console.log("Viewed Experiment", {
      experimentId: experiment.key,
      variationId: result.key
    });
  },
  plugins: [ autoAttributesPlugin() ],
});

function AppRoutes() {
  const { currentUser, loading } = useAuth()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuthTimeout = setTimeout(() => {
      setAuthChecked(true)
    }, 1000)

    return () => clearTimeout(checkAuthTimeout)
  }, [])

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

function App() {
  useEffect(() => {
    // Load features asynchronously when the app renders
    growthbook.init({ streaming: true });
    // Set attribute manually to simulate different users
    growthbook.setAttributes({
      id: "user1",
    });
    console.log("GrowthBook initialized.");
  }, []);

  return (
    <GrowthBookProvider growthbook={growthbook}>
      <Router>
        <AuthProvider>
          <div className="app">
            <AppRoutes />
          </div>
        </AuthProvider>
      </Router>
    </GrowthBookProvider>
  )
}

export default App
