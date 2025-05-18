"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { deleteTweet, toggleLike, addComment, deleteComment } from "../../services/tweetService"
import { getDoc, doc } from "firebase/firestore"
import { db } from "../../firebase"

function Tweet({ tweet, onTweetDeleted, onTweetUpdated }) {
  const { currentUser } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isOwner = tweet.userId === currentUser.uid
  const hasLiked = tweet.likes && tweet.likes.includes(currentUser.uid)
  const commentsCount = tweet.comments ? tweet.comments.length : 0
  const likesCount = tweet.likes ? tweet.likes.length : 0

  // Ensure we have user information even if it wasn't loaded with the tweet
  useEffect(() => {
    const loadUserData = async () => {
      if (!tweet.name || !tweet.username) {
        try {
          const userDoc = await getDoc(doc(db, "users", tweet.userId))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            // Update the tweet with user data
            tweet.name = userData.name
            tweet.username = userData.username
            // Force a re-render
            setError("")
          }
        } catch (error) {
          console.error("Error loading user data:", error)
        }
      }
    }

    loadUserData()
  }, [tweet])

  const getAvatarUrl = (username, name) => {
    const displayName = name || username || "usuario"
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=128`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este tweet?")) {
      return
    }

    try {
      setLoading(true)
      await deleteTweet(tweet.id, currentUser.uid)
      if (onTweetDeleted) {
        onTweetDeleted(tweet.id)
      }
    } catch (error) {
      setError("Error al eliminar el tweet: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    try {
      setLoading(true)
      await toggleLike(tweet.id, currentUser.uid)
      if (onTweetUpdated) {
        onTweetUpdated()
      }
    } catch (error) {
      setError("Error al dar like: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()

    if (!newComment.trim()) {
      return
    }

    try {
      setLoading(true)
      await addComment(tweet.id, currentUser.uid, newComment)
      setNewComment("")
      if (onTweetUpdated) {
        onTweetUpdated()
      }
    } catch (error) {
      setError("Error al comentar: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      setLoading(true)
      await deleteComment(tweet.id, commentId, currentUser.uid)
      if (onTweetUpdated) {
        onTweetUpdated()
      }
    } catch (error) {
      setError("Error al eliminar comentario: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tweet">
      {error && <div className="error">{error}</div>}
      <div className="avatar">
        <img src={getAvatarUrl(tweet.username, tweet.name) || "/placeholder.svg"} alt={tweet.name || "Avatar"} />
      </div>
      <div className="tweet-content">
        <div className="tweet-header">
          <span className="tweet-name">{tweet.name || "Usuario"}</span>
          <span className="tweet-username">@{tweet.username || "usuario"}</span>
          <span className="tweet-dot">·</span>
          <span className="tweet-time">{formatDate(tweet.createdAt)}</span>
        </div>
        <div className="tweet-body">{tweet.content}</div>
        <div className="tweet-actions">
          <div className="tweet-action comment" onClick={() => setShowComments(!showComments)}>
            <div className="icon">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
              </svg>
            </div>
            <span>{commentsCount}</span>
          </div>

          <div data-testid="like-button" className={`tweet-action like ${hasLiked ? "liked" : ""}`} onClick={handleLike}>
            <div className="icon">
              {hasLiked ? (
                <svg data-testid="liked-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                </svg>
              ) : (
                <svg data-testid="unliked-svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
                  <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
                </svg>
              )}
            </div>
            <span>{likesCount}</span>
          </div>
          {isOwner && (
            <div data-testid='delete-button' className="tweet-action delete" onClick={handleDelete}>
              <div className="icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M16 6V4.5C16 3.12 14.88 2 13.5 2h-3C9.11 2 8 3.12 8 4.5V6H3v2h1.06l.81 11.21C4.98 20.78 6.28 22 7.86 22h8.27c1.58 0 2.88-1.22 3-2.79L19.93 8H21V6h-5zm-6-1.5c0-.28.22-.5.5-.5h3c.27 0 .5.22.5.5V6h-4V4.5zm7.13 14.57c-.04.52-.47.93-1 .93H7.86c-.53 0-.96-.41-1-.93L6.07 8h11.85l-.79 11.07z"></path>
                  <path d="M9.5 17.25c-.41 0-.75-.34-.75-.75V10.5c0-.41.34-.75.75-.75s.75.34.75.75v6c0 .41-.34.75-.75.75zm5 0c-.41 0-.75-.34-.75-.75V10.5c0-.41.34-.75.75-.75s.75.34.75.75v6c0 .41-.34.75-.75.75z"></path>
                </svg>
              </div>
            </div>
          )}
        </div>

        {showComments && (
          <div className="tweet-comments">
            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                disabled={loading}
              />
              <button className="btn btn-primary" type="submit" disabled={loading || !newComment.trim()}>
                Comentar
              </button>
            </form>

            {tweet.comments && tweet.comments.length > 0 ? (
              <div className="comments-list">
                {tweet.comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <div className="comment-user">
                        <img
                          src={getAvatarUrl(comment.username) || "/placeholder.svg"}
                          alt="Avatar"
                          className="comment-avatar"
                        />
                        <span>@{comment.username || "usuario"}</span>
                      </div>
                      <span className="comment-date">{formatDate(comment.createdAt)}</span>
                      {comment.userId === currentUser.uid && (
                        <button
                          className="delete-comment"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-comments">No hay comentarios aún</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Tweet
