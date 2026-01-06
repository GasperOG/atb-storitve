'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        setError('Napačen uporabniško ime ali geslo')
        return
      }

      // redirect to admin
      window.location.href = '/admin'
    } catch {
      setError('Napaka pri prijavi. Poskusi ponovno.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 animated-bg" />
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-700 to-indigo-600 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-2xl">⚙️</div>
              <div>
                <h1 className="text-2xl font-bold">Admin prijava</h1>
                <p className="text-sm opacity-80">Prijavi se v administratorski vmesnik</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <label className="block text-sm font-medium text-gray-700">Uporabniško ime</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="email"
                inputMode="email"
                autoComplete="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Uporabniško ime"
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <label className="block text-sm font-medium text-gray-700 mt-4">Geslo</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Geslo"
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

            <button
              onClick={submit}
              disabled={loading}
              className={`mt-6 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Prijavljam...' : 'Prijavi se'}
            </button>

            <div className="mt-4 text-center text-xs text-gray-400">
              Dostop dovoljen le administratorjem.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Animated background styles scoped to this component */
const __styles = `
.animated-bg {
  background: linear-gradient(120deg, #0f172a 0%, #2563eb 25%, #60a5fa 50%, #e6eefc 75%, #0f172a 100%);
  background-size: 400% 400%;
  animation: gradientShift 12s ease infinite;
  filter: blur(48px);
  opacity: 0.65;
}
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

// Inject styles at runtime (client-only)
if (typeof window !== 'undefined') {
  const id = 'login-animated-bg-styles';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = __styles;
    document.head.appendChild(s);
  }
}
