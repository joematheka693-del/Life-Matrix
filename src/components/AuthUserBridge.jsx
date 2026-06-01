import { useEffect } from 'react'

import { useAuth } from '../context/AuthContext.jsx'
import { useLifeData } from '../context/LifeDataContext.jsx'

function AuthUserBridge() {
  const { authUser, isAuthenticated } = useAuth()
  const lifeContext = useLifeData()

  useEffect(() => {
    if (!isAuthenticated || !authUser) return
    if (typeof lifeContext.updateUser !== 'function') return

    lifeContext.updateUser({
      name: authUser.name || authUser.full_name || authUser.username || 'User',
      username: authUser.username || authUser.name || 'User',
      email: authUser.email || '',
      role: authUser.role || 'user',
    })
  }, [
    isAuthenticated,
    authUser?.user_id,
    authUser?.id,
    authUser?.name,
    authUser?.username,
    authUser?.email,
    authUser?.role,
  ])

  return null
}

export default AuthUserBridge
