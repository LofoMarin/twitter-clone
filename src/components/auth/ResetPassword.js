"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

function ResetPassword() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setMessage("")
      setError("")
      setLoading(true)
      await resetPassword(email)
      setMessage("Revisa tu email para seguir las instrucciones")
    } catch (error) {
      setError("Error al restablecer la contraseña: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2>Restablecer Contraseña</h2>
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Restablecer Contraseña"}
        </button>
      </form>
      <div style={{ marginTop: "10px" }}>
        <Link to="/login">Volver a Iniciar Sesión</Link>
      </div>
    </div>
  )
}

export default ResetPassword
