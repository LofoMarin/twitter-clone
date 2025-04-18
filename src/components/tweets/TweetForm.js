"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { createTweet } from "../../services/tweetService"
import "./TweetForm.css"

function TweetForm({ onTweetCreated }) {
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { currentUser } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    if (!content.trim()) {
      return setError("El tweet no puede estar vacío")
    }

    try {
      setError("")
      setLoading(true)
      await createTweet(currentUser.uid, content)
      setContent("")
      if (onTweetCreated) {
        onTweetCreated()
      }
    } catch (error) {
      setError("Error al crear el tweet: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tweet-form-container">
      <h3>¿Qué está pasando?</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué estás pensando?"
          maxLength={280}
          rows={4}
        />
        <div className="tweet-form-footer">
          <span className="character-count">{content.length}/280</span>
          <button type="submit" disabled={loading || !content.trim()}>
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TweetForm
