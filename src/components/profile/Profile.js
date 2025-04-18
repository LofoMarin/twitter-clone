"use client"
import { useAuth } from "../../contexts/AuthContext"
import TweetsList from "../tweets/TweetsList"
import "./Profile.css"

function Profile() {
  const { currentUser } = useAuth()

  return (
    <div className="profile">
      <div className="profile-header">
        <h2>Perfil</h2>
        <div className="profile-info">
          <div className="profile-name">{currentUser.name || currentUser.displayName}</div>
          <div className="profile-username">@{currentUser.username}</div>
          <div className="profile-email">{currentUser.email}</div>
        </div>
      </div>

      <div className="profile-tweets">
        <h3>Mis Tweets</h3>
        <TweetsList userId={currentUser.uid} />
      </div>
    </div>
  )
}

export default Profile
