"use client"

import { useState, useEffect } from "react"
import TweetForm from "../tweets/TweetForm"
import TweetsList from "../tweets/TweetsList"
import { useAuth } from "../../contexts/AuthContext"
import { useFeatureIsOn } from "@growthbook/growthbook-react"

function Timeline() {
  const { currentUser } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)
  const [showWelcome, setShowWelcome] = useState(false)
  const [welcomeMessage, setWelcomeMessage] = useState("")

  const enabled = useFeatureIsOn("my-feature")

  useEffect(() => {
    const justRegistered = localStorage.getItem("registrationSuccess")
    const justLoggedIn = localStorage.getItem("loginSuccess")

    if (justRegistered) {
      setWelcomeMessage(
        `¡Bienvenido a Not Twitter, ${currentUser?.name || currentUser?.displayName || currentUser?.username}! Tu cuenta ha sido creada exitosamente.`,
      )
      setShowWelcome(true)
      localStorage.removeItem("registrationSuccess")
    } else if (justLoggedIn) {
      setWelcomeMessage(
        `¡Bienvenido de nuevo, ${currentUser?.name || currentUser?.displayName || currentUser?.username}!`,
      )
      setShowWelcome(true)
      localStorage.removeItem("loginSuccess")
    }

    if (showWelcome) {
      const timer = setTimeout(() => {
        setShowWelcome(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [currentUser, showWelcome])

  const handleTweetCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1)
  }

  return (
    <div className="main-container">
      <header className="timeline-header">Inicio</header>

      {showWelcome && welcomeMessage && (
        <div className="welcome-message">
          <p>{welcomeMessage}</p>
        </div>
      )}
      { !enabled && <button onClick={() => {throw new Error("This is your first error!");}}>Break the world</button> }
      <TweetForm onTweetCreated={handleTweetCreated} />
      <TweetsList showGlobalFeed={true} onRefresh={refreshKey} />
    </div>
  )
}

export default Timeline
