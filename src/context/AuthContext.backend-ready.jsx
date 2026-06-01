import { createContext, useContext, useEffect, useMemo, useState } from 'react'

import { authApi } from '../services/authApi.js'

const AuthContext = createContext(null)

const AUTH_USER_KEY = 'life_matrix_auth_user'
const AUTH_TOKEN_KEY = 'life_matrix_auth_token'

function readJson(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => readJson(AUTH_USER_KEY, null))
  const [authToken, setAuthToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || '')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadCurrentUser() {
      if (!authToken) return

      try {
        const data = await authApi.me(authToken)
        setAuthUser(data.user)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user))
      } catch {
        localStorage.removeItem(AUTH_USER_KEY)
        localStorage.removeItem(AUTH_TOKEN_KEY)
        setAuthUser(null)
        setAuthToken('')
      }
    }

    loadCurrentUser()
  }, [authToken])

  const saveSession = (data) => {
    setAuthUser(data.user)
    setAuthToken(data.token)

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user))
    localStorage.setItem(AUTH_TOKEN_KEY, data.token)

    return data.user
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const data = await authApi.register(payload)
      return saveSession(data)
    } finally {
      setLoading(false)
    }
  }

  const login = async (payload) => {
    setLoading(true)
    try {
      const data = await authApi.login(payload)
      return saveSession(data)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setAuthUser(null)
    setAuthToken('')
    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
  }

  const value = useMemo(
    () => ({
      authUser,
      authToken,
      loading,
      isAuthenticated: Boolean(authUser && authToken),
      register,
      login,
      logout,
    }),
    [authUser, authToken, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
