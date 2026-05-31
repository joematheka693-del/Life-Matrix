import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  User,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext'
import GlobalSearchModal from './GlobalSearchModal.jsx'
import NotificationPanel from './NotificationPanel.jsx'
import QuickAddModal from './QuickAddModal.jsx'

function Navbar({ toggleSidebar }) {
  const { lifeData } = useLifeData()
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const user = lifeData.user || {}
  const goals = lifeData.goals || []
  const reading = lifeData.reading || []
  const watchlist = lifeData.watchlist || []

  const username = user.username || user.name || 'User'
  const rank = user.rank || 'Matrix Rank'
  const avatarUrl = user.avatarUrl || ''
  const level = user.level || 1

  const alertCount =
    goals.filter((goal) => Number(goal.progress) < 50).length +
    reading.filter((item) => Number(item.progress) >= 80 && Number(item.progress) < 100).length +
    watchlist.filter((item) => Number(item.progress) >= 80 && Number(item.progress) < 100).length

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isSearchShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'

      if (isSearchShortcut) {
        event.preventDefault()
        setSearchOpen(true)
      }

      if (event.key === 'Escape') {
        setSearchOpen(false)
        setQuickAddOpen(false)
        setNotificationsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const openSearch = () => {
    setSearchOpen(true)
  }

  return (
    <>
      <header className="life-navbar premium-navbar">
        <div className="premium-navbar-left">
          <button
            className="navbar-menu-btn premium-menu-btn"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={21} />
          </button>

          <div className="navbar-left premium-navbar-title">
            <div className="navbar-brand-chip">
              <Sparkles size={16} />
              <span>Life OS</span>
            </div>

            <div>
              <p className="navbar-kicker">Welcome back, {username}</p>
              <h2>Life Matrix</h2>
            </div>
          </div>
        </div>

        <button
          className="navbar-search premium-navbar-search navbar-search-button"
          type="button"
          onClick={openSearch}
        >
          <Search size={18} />
          <span className="navbar-search-placeholder">
            {searchQuery || 'Search your matrix...'}
          </span>
          <span className="search-shortcut">Ctrl K</span>
        </button>

        <div className="navbar-actions premium-navbar-actions">
          <button
            className="quick-add-btn premium-quick-add"
            type="button"
            onClick={() => setQuickAddOpen(true)}
          >
            <Plus size={18} />
            <span>Quick Add</span>
          </button>

          <div className="notification-wrapper">
            <button
              className="navbar-icon-btn premium-icon-btn"
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
              aria-label="Open notifications"
            >
              <Bell size={19} />
              {alertCount > 0 && <span className="notification-dot"></span>}
            </button>

            <NotificationPanel
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />
          </div>

          <div className="profile-dropdown premium-profile-dropdown">
            <button className="profile-btn premium-profile-btn" type="button">
              <div className="profile-avatar premium-profile-avatar">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} />
                ) : (
                  username.charAt(0).toUpperCase()
                )}
              </div>

              <div className="profile-info premium-profile-info">
                <strong>{username}</strong>
                <span>
                  {rank} · LVL {level}
                </span>
              </div>

              <ChevronDown size={17} />
            </button>

            <div className="dropdown-menu-panel premium-dropdown-panel">
              <div className="premium-dropdown-header">
                <div className="premium-dropdown-avatar">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={username} />
                  ) : (
                    username.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <strong>{username}</strong>
                  <span>{rank}</span>
                </div>
              </div>

              <Link to="/profile" className="dropdown-item-life">
                <User size={17} />
                Profile
              </Link>

              <Link to="/settings" className="dropdown-item-life">
                <Settings size={17} />
                Settings
              </Link>

              <button className="dropdown-item-life danger" type="button">
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <QuickAddModal
        isOpen={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        openQuickAdd={() => setQuickAddOpen(true)}
      />
    </>
  )
}

export default Navbar
