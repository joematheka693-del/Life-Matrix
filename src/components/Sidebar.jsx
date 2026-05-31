import { NavLink } from 'react-router-dom'
import {
  Archive, Award, BarChart3, BookOpen, BrainCircuit, CalendarCheck, CalendarDays, ClipboardCheck, Dumbbell, FolderKanban, HeartPulse, Home, LayoutDashboard, Library, NotebookPen, PlaySquare, Rocket, Scale, Settings, Sparkles, Star, Target, User, Wallet, X,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext'

const navItems = [
  { name: 'Home', path: '/', icon: Home, text: 'Start here' },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, text: 'Command center' },
  { name: 'Planner', path: '/planner', icon: CalendarDays, text: 'Schedule board' },
  { name: 'Habits', path: '/habits', icon: CalendarCheck, text: 'Daily routines' },
  { name: 'Notes', path: '/notes', icon: NotebookPen, text: 'Journal vault' },
  { name: 'Achievements', path: '/achievements', icon: Award, text: 'Badge hall' },
  { name: 'Mood', path: '/mood', icon: HeartPulse, text: 'Energy tracker' },
  { name: 'Projects', path: '/projects', icon: FolderKanban, text: 'Build board' },
  { name: 'Resources', path: '/resources', icon: Archive, text: 'Link vault' },
  { name: 'Review', path: '/review', icon: ClipboardCheck, text: 'Weekly review' },
  { name: 'Finance', path: '/finance', icon: Wallet, text: 'Money tracker' },
  { name: 'Skills', path: '/skills', icon: BrainCircuit, text: 'Skill tree' },
  { name: 'Decisions', path: '/decisions', icon: Scale, text: 'Compare choices' },
  { name: 'Score', path: '/score', icon: Star, text: 'Life score' },
  { name: 'Launch', path: '/launch', icon: Rocket, text: 'Launch checks' },
  { name: 'Workouts', path: '/workouts', icon: Dumbbell, text: 'Fitness tracker' },
  { name: 'Reading', path: '/reading', icon: Library, text: 'Manhwa & books' },
  { name: 'Studying', path: '/studying', icon: BookOpen, text: 'Learning paths' },
  { name: 'Watchlist', path: '/watchlist', icon: PlaySquare, text: 'Anime & shows' },
  { name: 'Goals', path: '/goals', icon: Target, text: 'Mission board' },
  { name: 'Profile', path: '/profile', icon: User, text: 'Player profile' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, text: 'Performance' },
  { name: 'Settings', path: '/settings', icon: Settings, text: 'Control panel' },
]

function Sidebar({ sidebarOpen, closeSidebar }) {
  const { lifeData } = useLifeData()

  const user = lifeData.user || {}
  const username = user.username || user.name || 'User'
  const rank = user.rank || 'Rank C'
  const avatarUrl = user.avatarUrl || ''
  const level = Number(user.level) || 1
  const xp = Number(user.xp) || 0
  const nextRankXp = Number(user.nextRankXp) || 700
  const xpPercent = Math.min(100, Math.round((xp / nextRankXp) * 100))

  return (
    <aside className={sidebarOpen ? 'life-sidebar premium-sidebar open' : 'life-sidebar premium-sidebar'}>
      <div className="sidebar-brand premium-sidebar-brand">
        <div className="brand-orb premium-brand-orb"><Sparkles size={22} /></div>
        <div className="premium-sidebar-brand-text"><h1>Life Matrix</h1><p>Personal Command Center</p></div>
        <button type="button" className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close sidebar">
          <X size={19} />
        </button>
      </div>

      <div className="premium-sidebar-profile">
        <div className="premium-sidebar-avatar">
          {avatarUrl ? <img src={avatarUrl} alt={username} /> : username.charAt(0).toUpperCase()}
        </div>
        <div className="premium-sidebar-profile-info">
          <span>Active Player</span>
          <strong>{username}</strong>
          <p>{rank} · Level {level}</p>
        </div>
      </div>

      <nav className="sidebar-nav premium-sidebar-nav">
        <span className="premium-nav-label">Main Modules</span>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              to={item.path}
              key={item.name}
              onClick={closeSidebar}
              className={({ isActive }) =>
                isActive ? 'sidebar-link premium-sidebar-link active' : 'sidebar-link premium-sidebar-link'
              }
            >
              <span className="premium-sidebar-link-icon"><Icon size={19} /></span>
              <span className="premium-sidebar-link-text"><strong>{item.name}</strong><small>{item.text}</small></span>
            </NavLink>
          )
        })}
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
