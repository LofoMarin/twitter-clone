import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const getAvatarUrl = (username, name) => {
    const displayName = name || username || "usuario";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=64`;
  };

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">T</div>
          <span>Not Twitter</span>
        </Link>

        {currentUser ? (
          <div className="navbar-links">
            <Link to="/" className="navbar-link">
              Inicio
            </Link>
            <Link to="/profile" className="navbar-link">
              Perfil
            </Link>
            <Link to="/profile" className="user-info">
              <img 
                src={getAvatarUrl(currentUser.username, currentUser.name || currentUser.displayName)} 
                alt={currentUser.name || "Usuario"} 
                className="user-info-avatar"
              />
              <span className="user-info-name">
                {currentUser.name || currentUser.displayName || currentUser.username || "Usuario"}
              </span>
            </Link>
            <button onClick={handleLogout} className="btn btn-danger">
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
  );
}

export default Navbar;