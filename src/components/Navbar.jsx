import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext.jsx'
import { useLifeData } from '../context/LifeDataContext.jsx'

function Navbar({ toggleSidebar }) {
  const navigate = useNavigate()
  const { authUser, isAuthenticated, logout } = useAuth()
  const { lifeData } = useLifeData()

  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const profileRef = useRef(null)
  const notificationRef = useRef(null)

  const lifeUser = lifeData.user || {}
  const activeUser = authUser || lifeUser || {}

  const username =
    activeUser.username ||
    activeUser.name ||
    activeUser.full_name ||
    'User'

  const email = activeUser.email || 'Signed in'
  const rank = lifeUser.rank || 'Rank C'
  const avatarUrl = lifeUser.avatarUrl || activeUser.avatarUrl || ''

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }

      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setProfileOpen(false)
        setNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/auth', { replace: true, state: { stay: true } })
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const query = searchText.trim().toLowerCase()

    if (!query) {
      return
    }

    const routeMap = [
      { keywords: ['dashboard', 'home'], path: '/dashboard' },
      { keywords: ['planner', 'calendar', 'schedule'], path: '/planner' },
      { keywords: ['habit', 'habits'], path: '/habits' },
      { keywords: ['goal', 'goals'], path: '/goals' },
      { keywords: ['workout', 'workouts', 'fitness'], path: '/workouts' },
      { keywords: ['watchlist', 'anime', 'movie', 'series'], path: '/watchlist' },
      { keywords: ['reading', 'book', 'manhwa'], path: '/reading' },
      { keywords: ['study', 'studying', 'school'], path: '/studying' },
      { keywords: ['finance', 'money'], path: '/finance' },
      { keywords: ['settings'], path: '/settings' },
      { keywords: ['profile', 'user'], path: '/profile' },
      { keywords: ['sync', 'backup', 'cloud'], path: '/sync' },
    ]

    const match = routeMap.find((item) =>
      item.keywords.some((keyword) => query.includes(keyword))
    )

    if (match) {
      navigate(match.path)
      setSearchText('')
    }
  }

  return (
    <header className="life-navbar premium-navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="navbar-icon-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={21} />
        </button>

        <div className="navbar-title-block">
          <span>Welcome back</span>
          <strong>{username}</strong>
        </div>
      </div>

      <form className="navbar-center" onSubmit={handleSearchSubmit}>
        <label className="navbar-search-trigger navbar-search-real">
          <Search size={18} />
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search pages..."
          />
        </label>
      </form>

      <div className="navbar-right">
        <div className="navbar-notification-wrap" ref={notificationRef}>
          <button
            type="button"
            className="navbar-icon-btn"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setNotificationOpen((prev) => !prev)
              setProfileOpen(false)
            }}
            aria-label="Open notifications"
          >
            <Bell size={20} />
          </button>

          {notificationOpen && (
            <div className="navbar-mini-menu click-dropdown-menu notification-mini-menu">
              <div className="navbar-profile-menu-head">
                <div className="navbar-avatar large">
                  <Bell size={21} />
                </div>

                <div>
                  <strong>Notifications</strong>
                  <span>Reminder center is available on Dashboard.</span>
                </div>
              </div>

              <Link to="/dashboard" onClick={() => setNotificationOpen(false)}>
                <Bell size={17} />
                Open Dashboard Reminders
              </Link>

              <Link to="/sync" onClick={() => setNotificationOpen(false)}>
                <ShieldCheck size={17} />
                Check Cloud Backup
              </Link>
            </div>
          )}
        </div>

        <div
          className={profileOpen ? 'navbar-profile-wrap click-open' : 'navbar-profile-wrap'}
          ref={profileRef}
        >
          <button
            type="button"
            className="navbar-profile-btn"
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              setProfileOpen((prev) => !prev)
              setNotificationOpen(false)
            }}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <div className="navbar-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt={username} />
              ) : (
                username.charAt(0).toUpperCase()
              )}
            </div>

            <div className="navbar-profile-copy">
              <strong>{username}</strong>
              <span>{isAuthenticated ? rank : 'Not signed in'}</span>
            </div>

            <ChevronDown size={17} className={profileOpen ? 'rotate-icon' : ''} />
          </button>

          {profileOpen && (
            <div
              className="navbar-profile-menu click-dropdown-menu"
              role="menu"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="navbar-profile-menu-head">
                <div className="navbar-avatar large">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={username} />
                  ) : (
                    username.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <strong>{username}</strong>
                  <span>{email}</span>
                </div>
              </div>

              <Link to="/profile" onClick={() => setProfileOpen(false)}>
                <User size={17} />
                Profile
              </Link>

              <Link to="/settings" onClick={() => setProfileOpen(false)}>
                <Settings size={17} />
                Settings
              </Link>

              <Link to="/sync" onClick={() => setProfileOpen(false)}>
                <ShieldCheck size={17} />
                Cloud Backup
              </Link>

              <button type="button" onClick={handleLogout}>
                <LogOut size={17} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
