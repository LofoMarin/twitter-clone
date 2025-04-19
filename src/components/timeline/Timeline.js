import { useState } from "react";
import TweetForm from "../tweets/TweetForm";
import TweetsList from "../tweets/TweetsList";
import { useAuth } from "../../contexts/AuthContext";

function Timeline() {
  const { currentUser } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTweetCreated = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="main-container">
      <header className="timeline-header">
        Inicio
      </header>
      <TweetForm onTweetCreated={handleTweetCreated} />
      <TweetsList onRefresh={refreshKey} />
    </div>
  );
}

export default Timeline;