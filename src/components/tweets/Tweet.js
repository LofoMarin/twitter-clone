"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { deleteTweet, toggleLike, addComment, deleteComment } from "../../services/tweetService"
import "./Tweet.css"

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

  // Formatear la fecha
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
      <div className="tweet-header">
        <div className="tweet-user">@{tweet.username || "usuario"}</div>
        <div className="tweet-date">{formatDate(tweet.createdAt)}</div>
      </div>
      <div className="tweet-content">{tweet.content}</div>
      <div className="tweet-actions">
        <button className={`tweet-action ${hasLiked ? "liked" : ""}`} onClick={handleLike} disabled={loading}>
          {hasLiked ? "❤️" : "🤍"} {likesCount}
        </button>
        <button className="tweet-action" onClick={() => setShowComments(!showComments)}>
          💬 {commentsCount}
        </button>
        {isOwner && (
          <button className="tweet-action delete" onClick={handleDelete} disabled={loading}>
            🗑️ Eliminar
          </button>
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
            <button type="submit" disabled={loading || !newComment.trim()}>
              Comentar
            </button>
          </form>

          {tweet.comments && tweet.comments.length > 0 ? (
            <div className="comments-list">
              {tweet.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <span>@{comment.username || "usuario"}</span>
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
  )
}

export default Tweet
