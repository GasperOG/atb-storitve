'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function submit() {
    setError('')
    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      setError('Napačen email ali geslo')
      return
    }

    window.location.href = '/admin'
  }

  return (
    <div style={{ padding: 40, maxWidth: 400 }}>
      <h1>Admin prijava</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Geslo"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={submit}>Prijavi se</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
