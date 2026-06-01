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
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(AUTH_TOKEN_KEY)))
  const [authError, setAuthError] = useState('')

  const saveSession = (data) => {
    const user = data.user
    const token = data.token

    if (!user || !token) {
      throw new Error('Backend did not return user and token.')
    }

    setAuthUser(user)
    setAuthToken(token)
    setAuthError('')

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    localStorage.setItem(AUTH_TOKEN_KEY, token)
    localStorage.setItem('life_matrix_sync_token', token)

    return user
  }

  useEffect(() => {
    async function loadCurrentUser() {
      if (!authToken) {
        setLoading(false)
        return
      }

      try {
        const data = await authApi.me(authToken)

        if (data.user) {
          setAuthUser(data.user)
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user))
          localStorage.setItem('life_matrix_sync_token', authToken)
        }
      } catch (error) {
        setAuthUser(null)
        setAuthToken('')
        setAuthError(error.message || 'Session expired.')

        localStorage.removeItem(AUTH_USER_KEY)
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem('life_matrix_sync_token')
      } finally {
        setLoading(false)
      }
    }

    loadCurrentUser()
  }, [authToken])

  const register = async (payload) => {
    setLoading(true)
    setAuthError('')

    try {
      const data = await authApi.register(payload)
      return saveSession(data)
    } catch (error) {
      setAuthError(error.message || 'Registration failed.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const login = async (payload) => {
    setLoading(true)
    setAuthError('')

    try {
      const data = await authApi.login(payload)
      return saveSession(data)
    } catch (error) {
      setAuthError(error.message || 'Login failed.')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setAuthUser(null)
    setAuthToken('')
    setAuthError('')

    localStorage.removeItem(AUTH_USER_KEY)
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem('life_matrix_sync_token')
  }

  const value = useMemo(
    () => ({
      authUser,
      authToken,
      loading,
      authError,
      isAuthenticated: Boolean(authUser && authToken),
      register,
      login,
      logout,
    }),
    [authUser, authToken, loading, authError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
