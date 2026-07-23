import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiFetch, getToken, setToken } from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // true while we verify a stored token on first load

  // On first load, if a token is saved from a previous session,
  // verify it's still valid against the server and restore the user.
  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }
    apiFetch('/auth/me', { auth: true })
      .then((data) => setUser(data.user))
      .catch(() => {
        setToken(null) // stored token is invalid/expired — clear it
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  // Creates the account only — deliberately does NOT log the user in.
  // They're sent to the sign-in page afterwards to sign in fresh.
  const signup = useCallback(async ({ fullName, email, phone, password }) => {
    const data = await apiFetch('/auth/signup', {
      method: 'POST',
      body: { fullName, email, phone, password },
    })
    return data.user
  }, [])

  const signin = useCallback(async ({ email, password }) => {
    const data = await apiFetch('/auth/signin', {
      method: 'POST',
      body: { email, password },
    })
    setToken(data.token)
    setUser(data.user)
    return data.user
  }, [])

  const signout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading, // true only during the initial token-check on app load
    signup,
    signin,
    signout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
