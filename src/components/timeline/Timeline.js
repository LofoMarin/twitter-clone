"use client"

import { useState } from "react"
import TweetForm from "../tweets/TweetForm"
import TweetsList from "../tweets/TweetsList"
import { useAuth } from "../../contexts/AuthContext"
import "./Timeline.css"

function Timeline() {
  const { currentUser } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTweetCreated = () => {
    // Forzar actualización de la lista de tweets
    setRefreshKey((prevKey) => prevKey + 1)
  }

  return (
    <div className="timeline">
      <h2>Inicio</h2>
      <TweetForm onTweetCreated={handleTweetCreated} />
      <TweetsList onRefresh={refreshKey} />
    </div>
  )
}

export default Timeline
