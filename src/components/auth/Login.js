"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)

      // Login and wait for it to complete
      await login(email, password)

      // Add a small delay to ensure Firebase auth state is updated
      setTimeout(() => {
        // Store a flag to indicate successful login
        localStorage.setItem("loginSuccess", "true")
        // Navigate to home page
        navigate("/")
      }, 1000)
    } catch (error) {
      setError("Error al iniciar sesión: " + error.message)
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2>Iniciar Sesión</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
      <div style={{ marginTop: "10px" }}>
        <Link to="/reset-password">¿Olvidaste tu contraseña?</Link>
      </div>
      <div style={{ marginTop: "10px" }}>
        ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
      </div>
    </div>
  )
}

export default Login
