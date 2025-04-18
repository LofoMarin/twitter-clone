"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { getUserTweets } from "../../services/tweetService"
import Tweet from "./Tweet"
import "./TweetsList.css"

function TweetsList({ userId, onRefresh }) {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { currentUser } = useAuth()

  // Si no se proporciona un userId, usar el del usuario actual
  const targetUserId = userId || currentUser.uid

  const loadTweets = async () => {
    try {
      setLoading(true)
      const fetchedTweets = await getUserTweets(targetUserId)
      setTweets(fetchedTweets)
      setError("")
    } catch (error) {
      setError("Error al cargar los tweets: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTweets()
  }, [targetUserId, onRefresh])

  const handleTweetDeleted = (tweetId) => {
    setTweets(tweets.filter((tweet) => tweet.id !== tweetId))
  }

  return (
    <div className="tweets-list">
      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Cargando tweets...</div>
      ) : tweets.length > 0 ? (
        tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} onTweetDeleted={handleTweetDeleted} onTweetUpdated={loadTweets} />
        ))
      ) : (
        <div className="no-tweets">No hay tweets para mostrar</div>
      )}
    </div>
  )
}

export default TweetsList
