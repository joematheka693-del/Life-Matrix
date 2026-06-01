import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <section className="auth-loading-screen">
        <div className="auth-loading-card">
          <div className="auth-loading-orb"></div>
          <p className="page-kicker">Checking Session</p>
          <h2>Verifying your Life Matrix access...</h2>
        </div>
      </section>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
