import { useAuth } from "../../contexts/AuthContext";
import TweetsList from "../tweets/TweetsList";

function Profile() {
  const { currentUser } = useAuth();
  
  const getAvatarUrl = (username, name) => {
    const displayName = name || username || "usuario";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=200`;
  };

  return (
    <div className="profile">
      <div className="profile-header">
        <div className="profile-user">
          <div className="profile-avatar-container">
            <img 
              src={getAvatarUrl(currentUser.username, currentUser.name || currentUser.displayName)} 
              alt={currentUser.name || "Usuario"} 
              className="profile-avatar"
            />
          </div>
          <div>
            <h2 className="profile-name">{currentUser.name || currentUser.displayName || "Usuario"}</h2>
            <div className="profile-username">@{currentUser.username || "usuario"}</div>
          </div>
        </div>
        
        <div className="profile-info">
          <div className="profile-info-item">
            <span className="icon">📧</span>
            <span>{currentUser.email}</span>
          </div>
          <div className="profile-info-item">
            <span className="icon">📅</span>
            <span>Se unió el {new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <span className="profile-stat-number">0</span>
            <span className="profile-stat-label">Siguiendo</span>
          </div>
          <div className="profile-stat">
            <span className="profile-stat-number">0</span>
            <span className="profile-stat-label">Seguidores</span>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <div className="profile-tab active">Publicaciones</div>
      </div>

      <div className="profile-tweets">
        <TweetsList userId={currentUser.uid} />
      </div>
    </div>
  );
}

export default Profile;