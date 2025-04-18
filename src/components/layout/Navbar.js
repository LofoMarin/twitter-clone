"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "./Navbar.css"

function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          X Clone
        </Link>

        {currentUser ? (
          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Inicio
            </Link>
            <Link to="/profile" className="navbar-link">
              Perfil
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="navbar-links">
            <Link to="/login" className="navbar-link">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="navbar-link">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
