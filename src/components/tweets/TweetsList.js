import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserTweets } from "../../services/tweetService";
import Tweet from "./Tweet";

function TweetsList({ userId, onRefresh }) {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const targetUserId = userId || currentUser.uid;

  const loadTweets = async () => {
    try {
      setLoading(true);
      const fetchedTweets = await getUserTweets(targetUserId);
      setTweets(fetchedTweets);
      setError("");
    } catch (error) {
      setError("Error al cargar los tweets: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTweets();
  }, [targetUserId, onRefresh]);

  const handleTweetDeleted = (tweetId) => {
    setTweets(tweets.filter((tweet) => tweet.id !== tweetId));
  };

  return (
    <div className="tweets-list">
      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando tweets...</p>
        </div>
      ) : tweets.length > 0 ? (
        tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} onTweetDeleted={handleTweetDeleted} onTweetUpdated={loadTweets} />
        ))
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <g>
                <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z" fill="#1d9bf0"></path>
              </g>
            </svg>
          </div>
          <p className="empty-state-text">No hay tweets para mostrar</p>
          <p className="empty-state-subtext">¡Sé el primero en publicar algo!</p>
        </div>
      )}
    </div>
  );
}

export default TweetsList;