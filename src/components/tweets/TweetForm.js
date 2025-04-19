import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { createTweet } from "../../services/tweetService";

function TweetForm({ onTweetCreated }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const getAvatarUrl = (username, name) => {
    const displayName = name || username || "usuario";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=128`;
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!content.trim()) {
      return setError("El tweet no puede estar vacío");
    }

    try {
      setError("");
      setLoading(true);
      await createTweet(currentUser.uid, content);
      setContent("");
      if (onTweetCreated) {
        onTweetCreated();
      }
    } catch (error) {
      setError("Error al crear el tweet: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tweet-form">
      <div className="avatar">
        <img 
          src={getAvatarUrl(currentUser.username, currentUser.name || currentUser.displayName)} 
          alt={currentUser.name || "Usuario"} 
        />
      </div>
      <div className="tweet-form-container">
        {error && <div className="error">{error}</div>}
        <textarea
          className="tweet-textarea"
          placeholder="¿Qué está pasando?"
          maxLength={280}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onInput={(e) => {
            e.target.style.height = "";
            e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
          }}
        ></textarea>
        <div className="tweet-form-actions">
          <div className="tweet-form-buttons">
            <div className="tweet-form-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"></path>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M21 15l-5-5L5 21"></path>
              </svg>
            </div>
            <div className="tweet-form-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
          </div>
          <div className="tweet-form-submit">
            <span className="char-count">{content.length}/280</span>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetForm;