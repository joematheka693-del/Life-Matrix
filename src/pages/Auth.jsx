import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  LockKeyhole,
  LogIn,
  LogOut,
  Server,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext.jsx'
import { authApi, getApiBaseUrl } from '../services/authApi.js'

function Auth() {
  const navigate = useNavigate()
  const location = useLocation()
  const { authUser, isAuthenticated, loading, login, logout, register } = useAuth()

  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [backendStatus, setBackendStatus] = useState('Not tested')
  const [backendUrl, setBackendUrl] = useState(() => getApiBaseUrl())
  const [loginForm, setLoginForm] = useState({
    emailOrUsername: '',
    password: '',
  })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    localStorage.setItem('life_matrix_backend_url', backendUrl)
  }, [backendUrl])

  if (isAuthenticated && location.pathname === '/auth' && !location.state?.stay) {
    return <Navigate to={from} replace />
  }

  const handleLoginChange = (event) => {
    const { name, value } = event.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (event) => {
    const { name, value } = event.target
    setRegisterForm((prev) => ({ ...prev, [name]: value }))
  }

  const testBackend = async () => {
    setBackendStatus('Testing...')

    try {
      const data = await authApi.health()
      setBackendStatus(data.message || 'Backend connected')
    } catch (err) {
      setBackendStatus(err.message || 'Backend test failed')
    }
  }

  const submitLogin = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login(loginForm)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed.')
    }
  }

  const submitRegister = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await register(registerForm)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    }
  }

  const logoutAndStay = () => {
    logout()
    setMode('login')
    navigate('/auth', { replace: true, state: { stay: true } })
  }

  return (
    <section className="auth-page">
      <div className="auth-background-orb auth-orb-one"></div>
      <div className="auth-background-orb auth-orb-two"></div>

      <div className="auth-shell">
        <article className="auth-hero-panel">
          <div className="auth-brand">
            <div>
              <Sparkles size={28} />
            </div>

            <span>Life Matrix</span>
          </div>

          <p className="page-kicker">Backend Authentication</p>
          <h1>Real login powered by Flask, MySQL, bcrypt, and JWT.</h1>
          <p>
            This phase connects the frontend Auth system to your backend API.
            Accounts are now created in MySQL and sessions use real JWT tokens
            from Flask.
          </p>

          <div className="auth-feature-grid">
            <div>
              <ShieldCheck size={21} />
              <span>JWT Token</span>
            </div>

            <div>
              <LockKeyhole size={21} />
              <span>Protected Routes</span>
            </div>

            <div>
              <Server size={21} />
              <span>Flask API</span>
            </div>
          </div>

          <div className="auth-backend-config">
            <label>
              Backend URL
              <input
                value={backendUrl}
                onChange={(event) => setBackendUrl(event.target.value)}
                placeholder="http://127.0.0.1:5000"
              />
            </label>

            <button type="button" className="btn-soft-life" onClick={testBackend}>
              <Server size={17} />
              Test Backend
            </button>

            <p>{backendStatus}</p>
          </div>
        </article>

        <article className="auth-card">
          {isAuthenticated ? (
            <div className="auth-signed-card">
              <div className="auth-signed-icon">
                <ShieldCheck size={34} />
              </div>

              <p className="page-kicker">Signed In</p>
              <h2>{authUser?.username || authUser?.name}</h2>
              <p>
                You are authenticated through the backend-ready session layer.
                Continue to the dashboard or log out to test login again.
              </p>

              <div className="auth-button-row">
                <button type="button" className="btn-life" onClick={() => navigate('/dashboard')}>
                  <LogIn size={18} />
                  Dashboard
                </button>

                <button type="button" className="btn-soft-life" onClick={logoutAndStay}>
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="auth-card-header">
                <div>
                  <p className="page-kicker">{mode === 'login' ? 'Login' : 'Register'}</p>
                  <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
                </div>

                {mode === 'login' ? <LogIn size={24} /> : <UserPlus size={24} />}
              </div>

              <div className="auth-mode-switch">
                <button
                  type="button"
                  className={mode === 'login' ? 'active' : ''}
                  onClick={() => {
                    setMode('login')
                    setError('')
                  }}
                >
                  Login
                </button>

                <button
                  type="button"
                  className={mode === 'register' ? 'active' : ''}
                  onClick={() => {
                    setMode('register')
                    setError('')
                  }}
                >
                  Register
                </button>
              </div>

              {error && <div className="auth-error">{error}</div>}

              {mode === 'login' ? (
                <form className="auth-form" onSubmit={submitLogin}>
                  <label>
                    Email or Username
                    <input
                      type="text"
                      name="emailOrUsername"
                      value={loginForm.emailOrUsername}
                      onChange={handleLoginChange}
                      placeholder="joe or joe@email.com"
                    />
                  </label>

                  <label>
                    Password
                    <input
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="Enter password"
                    />
                  </label>

                  <button type="submit" className="btn-life" disabled={loading}>
                    <LogIn size={18} />
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>
              ) : (
                <form className="auth-form" onSubmit={submitRegister}>
                  <label>
                    Full Name
                    <input
                      type="text"
                      name="name"
                      value={registerForm.name}
                      onChange={handleRegisterChange}
                      placeholder="Joe"
                    />
                  </label>

                  <label>
                    Username
                    <input
                      type="text"
                      name="username"
                      value={registerForm.username}
                      onChange={handleRegisterChange}
                      placeholder="joe"
                    />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      name="email"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                      placeholder="joe@email.com"
                    />
                  </label>

                  <label>
                    Password
                    <input
                      type="password"
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      placeholder="At least 6 characters"
                    />
                  </label>

                  <button type="submit" className="btn-life" disabled={loading}>
                    <UserPlus size={18} />
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </form>
              )}

              <div className="auth-backend-note">
                <LockKeyhole size={18} />
                <p>
                  Backend mode active. Make sure Flask is running and MySQL
                  schema has been loaded.
                </p>
              </div>
            </>
          )}
        </article>
      </div>
    </section>
  )
}

export default Auth
