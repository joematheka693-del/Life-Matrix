import { useMemo } from 'react'
import { Link } from 'react-router-dom'

import {
  BarChart3,
  BookOpen,
  Brain,
  Dumbbell,
  Home,
  Library,
  PlaySquare,
  Search,
  Settings,
  Target,
  User,
  X,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'

const pageResults = [
  {
    title: 'Home',
    type: 'Page',
    description: 'Life Matrix landing screen',
    path: '/',
    icon: Home,
  },
  {
    title: 'Dashboard',
    type: 'Page',
    description: 'Main command center',
    path: '/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Workouts',
    type: 'Page',
    description: 'Fitness tracker',
    path: '/workouts',
    icon: Dumbbell,
  },
  {
    title: 'Reading',
    type: 'Page',
    description: 'Manhwa, manga, books, and novels',
    path: '/reading',
    icon: Library,
  },
  {
    title: 'Studying',
    type: 'Page',
    description: 'Courses, skills, and learning paths',
    path: '/studying',
    icon: Brain,
  },
  {
    title: 'Watchlist',
    type: 'Page',
    description: 'Anime, shows, movies, and episodes',
    path: '/watchlist',
    icon: PlaySquare,
  },
  {
    title: 'Goals',
    type: 'Page',
    description: 'Mission board and progress',
    path: '/goals',
    icon: Target,
  },
  {
    title: 'Profile',
    type: 'Page',
    description: 'Player profile and rank',
    path: '/profile',
    icon: User,
  },
  {
    title: 'Analytics',
    type: 'Page',
    description: 'Progress insights and charts',
    path: '/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    type: 'Page',
    description: 'Profile, data, and preferences',
    path: '/settings',
    icon: Settings,
  },
]

function GlobalSearchModal({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  openQuickAdd,
}) {
  const { lifeData } = useLifeData()

  const results = useMemo(() => {
    const goals = lifeData.goals || []
    const workouts = lifeData.workouts || []
    const studying = lifeData.studying || []
    const reading = lifeData.reading || []
    const watchlist = lifeData.watchlist || []

    const dataResults = [
      ...goals.map((item) => ({
        title: item.title,
        type: 'Goal',
        description: `${item.category || 'Goal'} · ${item.progress || 0}% progress`,
        path: '/goals',
        icon: Target,
      })),
      ...workouts.map((item) => ({
        title: item.title,
        type: 'Workout',
        description: `${item.level || 'Workout'} · ${item.duration || 'Session'}`,
        path: '/workouts',
        icon: Dumbbell,
      })),
      ...studying.map((item) => ({
        title: item.title,
        type: 'Study',
        description: `${item.category || 'Learning'} · ${item.progress || 0}% progress`,
        path: '/studying',
        icon: Brain,
      })),
      ...reading.map((item) => ({
        title: item.title,
        type: item.type || 'Reading',
        description: `${item.currentUnit || 0} / ${item.totalUnits || 1} ${
          item.unitLabel || 'Chapter'
        }s`,
        path: '/reading',
        icon: BookOpen,
      })),
      ...watchlist.map((item) => ({
        title: item.title,
        type: item.type || 'Watchlist',
        description: `${item.watchedEpisodes || 0} / ${item.episodes || 1} episodes`,
        path: '/watchlist',
        icon: PlaySquare,
      })),
    ]

    const allResults = [...pageResults, ...dataResults]
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      return allResults.slice(0, 10)
    }

    return allResults
      .filter((item) => {
        const title = String(item.title || '').toLowerCase()
        const type = String(item.type || '').toLowerCase()
        const description = String(item.description || '').toLowerCase()

        return (
          title.includes(query) ||
          type.includes(query) ||
          description.includes(query)
        )
      })
      .slice(0, 18)
  }, [lifeData, searchQuery])

  if (!isOpen) {
    return null
  }

  return (
    <div className="global-search-overlay" role="presentation">
      <div className="global-search-modal glass-card" role="dialog" aria-modal="true">
        <div className="global-search-header">
          <div>
            <p className="page-kicker">Matrix Search</p>
            <h2>Find anything in Life Matrix</h2>
          </div>

          <button type="button" className="global-search-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="global-search-input-panel">
          <Search size={20} />
          <input
            autoFocus
            type="text"
            placeholder="Search pages, goals, workouts, reading, watchlist..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>

        <div className="global-search-content">
          <div className="global-search-result-list">
            {results.length > 0 ? (
              results.map((item, index) => {
                const Icon = item.icon

                return (
                  <Link
                    to={item.path}
                    className="global-search-result"
                    key={`${item.type}-${item.title}-${index}`}
                    onClick={onClose}
                  >
                    <div className="global-search-result-icon">
                      <Icon size={19} />
                    </div>

                    <div>
                      <span>{item.type}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="global-search-empty">
                <Search size={34} />
                <h3>No results found</h3>
                <p>
                  Nothing matched your search. Try a different keyword or create
                  a new Matrix item.
                </p>

                <button
                  type="button"
                  className="btn-life"
                  onClick={() => {
                    onClose()
                    openQuickAdd()
                  }}
                >
                  Add New Item
                </button>
              </div>
            )}
          </div>

          <aside className="global-search-help">
            <p className="page-kicker">Search Tips</p>
            <h3>Try searching</h3>

            <div className="global-search-tags">
              <button type="button" onClick={() => setSearchQuery('goals')}>
                goals
              </button>

              <button type="button" onClick={() => setSearchQuery('reading')}>
                reading
              </button>

              <button type="button" onClick={() => setSearchQuery('anime')}>
                anime
              </button>

              <button type="button" onClick={() => setSearchQuery('workout')}>
                workout
              </button>

              <button type="button" onClick={() => setSearchQuery('settings')}>
                settings
              </button>
            </div>

            <div className="global-search-shortcuts">
              <div>
                <strong>Enter</strong>
                <span>Open selected item later</span>
              </div>

              <div>
                <strong>Esc</strong>
                <span>Close search</span>
              </div>

              <div>
                <strong>Ctrl K</strong>
                <span>Open search</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default GlobalSearchModal
