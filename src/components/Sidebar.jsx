import { NavLink } from 'react-router-dom'
import {
  Archive, Award, BarChart3, BookOpen, BrainCircuit, CalendarCheck, CalendarDays,
  ClipboardCheck, Cloud, CloudUpload, Dumbbell, FolderKanban, HeartPulse, Home,
  LayoutDashboard, Library, NotebookPen, PlaySquare, Rocket, Scale, Settings,
  Sparkles, Star, Target, User, Wallet, X,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext.jsx'
import { useLifeData } from '../context/LifeDataContext.jsx'

const navGroups = [
  {
    label: 'Core',
    items: [
      { name: 'Home', path: '/', icon: Home, text: 'Start here' },
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, text: 'Command center' },
      { name: 'Score', path: '/score', icon: Star, text: 'Life score' },
      { name: 'Analytics', path: '/analytics', icon: BarChart3, text: 'Performance' },
    ],
  },
  {
    label: 'Planning',
    items: [
      { name: 'Planner', path: '/planner', icon: CalendarDays, text: 'Schedule board' },
      { name: 'Goals', path: '/goals', icon: Target, text: 'Mission board' },
      { name: 'Habits', path: '/habits', icon: CalendarCheck, text: 'Daily routines' },
      { name: 'Review', path: '/review', icon: ClipboardCheck, text: 'Weekly review' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { name: 'Studying', path: '/studying', icon: BookOpen, text: 'Learning paths' },
      { name: 'Skills', path: '/skills', icon: BrainCircuit, text: 'Skill tree' },
      { name: 'Projects', path: '/projects', icon: FolderKanban, text: 'Build board' },
      { name: 'Resources', path: '/resources', icon: Archive, text: 'Link vault' },
    ],
  },
  {
    label: 'Lifestyle',
    items: [
      { name: 'Mood', path: '/mood', icon: HeartPulse, text: 'Energy tracker' },
      { name: 'Workouts', path: '/workouts', icon: Dumbbell, text: 'Fitness tracker' },
      { name: 'Reading', path: '/reading', icon: Library, text: 'Manhwa & books' },
      { name: 'Watchlist', path: '/watchlist', icon: PlaySquare, text: 'Anime & shows' },
      { name: 'Finance', path: '/finance', icon: Wallet, text: 'Money tracker' },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Notes', path: '/notes', icon: NotebookPen, text: 'Journal vault' },
      { name: 'Decisions', path: '/decisions', icon: Scale, text: 'Compare choices' },
      { name: 'Achievements', path: '/achievements', icon: Award, text: 'Badge hall' },
      { name: 'Launch', path: '/launch', icon: Rocket, text: 'Launch checks' },
      { name: 'Sync', path: '/sync', icon: Cloud, text: 'Cloud backup' },
      { name: 'Testing', path: '/testing', icon: ClipboardCheck, text: 'QA lab' },
      { name: 'Deploy', path: '/deploy', icon: CloudUpload, text: 'Production' },
      { name: 'Profile', path: '/profile', icon: User, text: 'Player profile' },
      { name: 'Settings', path: '/settings', icon: Settings, text: 'Control panel' },
    ],
  },
]

function Sidebar({ sidebarOpen, closeSidebar }) {
  const { authUser } = useAuth()
  const { lifeData } = useLifeData()

  const lifeUser = lifeData.user || {}
  const activeUser = authUser || lifeUser || {}
  const username = activeUser.username || activeUser.name || activeUser.full_name || 'User'
  const rank = lifeUser.rank || 'Rank C'
  const avatarUrl = lifeUser.avatarUrl || activeUser.avatarUrl || ''
  const level = Number(lifeUser.level) || 1
  const xp = Number(lifeUser.xp) || 0
  const nextRankXp = Number(lifeUser.nextRankXp) || 700
  const xpPercent = Math.min(100, Math.round((xp / nextRankXp) * 100))

  const handleNavClick = () => {
    if (window.innerWidth <= 1100) closeSidebar()
  }

  return (
    <aside className={sidebarOpen ? 'life-sidebar premium-sidebar open' : 'life-sidebar premium-sidebar'}>
      <div className="sidebar-brand premium-sidebar-brand">
        <div className="brand-orb premium-brand-orb"><Sparkles size={22} /></div>

        <div className="premium-sidebar-brand-text">
          <h1>Life Matrix</h1>
          <p>Personal Command Center</p>
        </div>

        <button type="button" className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close sidebar">
          <X size={19} />
        </button>
      </div>

      <div className="premium-sidebar-profile">
        <div className="premium-sidebar-avatar">
          {avatarUrl ? <img src={avatarUrl} alt={username} /> : username.charAt(0).toUpperCase()}
        </div>

        <div className="premium-sidebar-profile-info">
          <span>Logged-in User</span>
          <strong>{username}</strong>
          <p>{rank} · Level {level}</p>
        </div>
      </div>

      <nav className="sidebar-nav premium-sidebar-nav grouped-sidebar-nav">
        {navGroups.map((group) => (
          <div className="sidebar-nav-group" key={group.label}>
            <span className="premium-nav-label">{group.label}</span>

            {group.items.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  to={item.path}
                  key={item.name}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    isActive ? 'sidebar-link premium-sidebar-link active' : 'sidebar-link premium-sidebar-link'
                  }
                >
                  <span className="premium-sidebar-link-icon"><Icon size={19} /></span>

                  <span className="premium-sidebar-link-text">
                    <strong>{item.name}</strong>
                    <small>{item.text}</small>
                  </span>
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-rank-card premium-sidebar-rank-card">
        <div className="rank-card-top"><span>XP Progress</span><strong>{xpPercent}%</strong></div>
        <div className="rank-progress-bar"><div className="rank-progress-fill" style={{ width: `${xpPercent}%` }}></div></div>
        <p className="rank-xp">{xp} / {nextRankXp} XP</p>
      </div>
    </aside>
  )
}

export default Sidebar
