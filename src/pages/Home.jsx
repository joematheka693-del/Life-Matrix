import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  Dumbbell,
  Library,
  PlaySquare,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import { useLifeData } from '../context/LifeDataContext.jsx'

function Home() {
  const { lifeData } = useLifeData()

  const user = lifeData.user || {}
  const goals = lifeData.goals || []
  const workouts = lifeData.workouts || []
  const studying = lifeData.studying || []
  const reading = lifeData.reading || []
  const watchlist = lifeData.watchlist || []

  const username = user.username || user.name || 'User'
  const rank = user.rank || 'Rank C'
  const totalItems =
    goals.length + workouts.length + studying.length + reading.length + watchlist.length

  const average = (items) => {
    if (!items.length) {
      return 0
    }

    return Math.round(
      items.reduce((sum, item) => sum + (Number(item.progress) || 0), 0) /
        items.length
    )
  }

  const overallProgress = average([
    ...goals,
    ...workouts,
    ...studying,
    ...reading,
    ...watchlist,
  ])

  const modules = [
    {
      icon: Target,
      title: 'Goals',
      text: 'Plan missions, deadlines, and progress.',
      path: '/goals',
      count: goals.length,
    },
    {
      icon: Dumbbell,
      title: 'Workouts',
      text: 'Track training sessions and fitness growth.',
      path: '/workouts',
      count: workouts.length,
    },
    {
      icon: Brain,
      title: 'Studying',
      text: 'Organize lessons, courses, and skills.',
      path: '/studying',
      count: studying.length,
    },
    {
      icon: Library,
      title: 'Reading',
      text: 'Track manhwa, manga, books, and novels.',
      path: '/reading',
      count: reading.length,
    },
    {
      icon: PlaySquare,
      title: 'Watchlist',
      text: 'Manage anime, shows, movies, and episodes.',
      path: '/watchlist',
      count: watchlist.length,
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      text: 'View progress insight across the system.',
      path: '/analytics',
      count: `${overallProgress}%`,
    },
  ]

  const buildSteps = [
    {
      icon: ShieldCheck,
      title: 'Local-first system',
      text: 'Your current version stores data safely inside browser localStorage.',
    },
    {
      icon: Sparkles,
      title: 'Premium UI layer',
      text: 'Each major module now has its own page design and CSS file.',
    },
    {
      icon: Zap,
      title: 'Next evolution',
      text: 'Backend sync, authentication, cloud backup, and mobile app can come next.',
    },
  ]

  return (
    <section className="home-page premium-home-page">
      <div className="home-command-hero glass-card">
        <div className="home-hero-copy">
          <p className="page-kicker">Life Matrix OS</p>
          <h1>Build your personal command center, {username}.</h1>
          <p>
            Track your goals, workouts, studying, reading, watchlist, XP, rank,
            and progress from one premium dashboard built with React.
          </p>

          <div className="home-hero-actions">
            <Link to="/dashboard" className="btn-life">
              Open Dashboard
              <ArrowRight size={18} />
            </Link>

            <Link to="/settings" className="btn-soft-life">
              Customize Profile
            </Link>
          </div>

          <div className="home-chip-row">
            <span>
              <Trophy size={16} />
              {rank}
            </span>

            <span>
              <CheckCircle2 size={16} />
              {totalItems} tracked items
            </span>

            <span>
              <BarChart3 size={16} />
              {overallProgress}% progress
            </span>
          </div>
        </div>

        <div className="home-preview-console">
          <div className="preview-console-top">
            <div>
              <span>Current System</span>
              <strong>Life Matrix</strong>
            </div>

            <Sparkles size={22} />
          </div>

          <div className="preview-progress-orb">
            <strong>{overallProgress}%</strong>
            <span>Overall</span>
          </div>

          <div className="preview-console-list">
            <div>
              <Target size={17} />
              <span>Goals</span>
              <strong>{goals.length}</strong>
            </div>

            <div>
              <BookOpen size={17} />
              <span>Learning</span>
              <strong>{studying.length + reading.length}</strong>
            </div>

            <div>
              <PlaySquare size={17} />
              <span>Watchlist</span>
              <strong>{watchlist.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="home-stat-strip section-gap">
        <article>
          <span>Total Matrix Items</span>
          <strong>{totalItems}</strong>
          <p>Across all modules</p>
        </article>

        <article>
          <span>Current Rank</span>
          <strong>{rank}</strong>
          <p>Editable in Settings</p>
        </article>

        <article>
          <span>System Progress</span>
          <strong>{overallProgress}%</strong>
          <p>Average completion</p>
        </article>
      </div>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Main Modules</p>
          <h2>Choose your next system area</h2>
        </div>
      </div>

      <div className="home-module-grid">
        {modules.map((module) => {
          const Icon = module.icon

          return (
            <Link to={module.path} className="home-module-card" key={module.title}>
              <div className="home-module-icon">
                <Icon size={23} />
              </div>

              <div>
                <p>{module.title}</p>
                <h3>{module.count}</h3>
                <span>{module.text}</span>
              </div>

              <ArrowRight size={18} />
            </Link>
          )
        })}
      </div>

      <div className="home-bottom-grid section-gap">
        <article className="home-system-card glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">System Blueprint</p>
              <h2>How Life Matrix works</h2>
            </div>

            <ShieldCheck size={22} />
          </div>

          <div className="home-step-list">
            {buildSteps.map((step) => {
              const Icon = step.icon

              return (
                <div className="home-step-item" key={step.title}>
                  <div>
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <article className="home-next-card glass-card">
          <p className="page-kicker">Next Upgrade Path</p>
          <h2>Phase 6 direction</h2>
          <p>
            Now that the page UI has improved, the next strong move is adding
            real app behavior: quick add modal, real reminders, better settings
            persistence, and eventually backend login/sync.
          </p>

          <Link to="/analytics" className="btn-life">
            Review Progress
            <ArrowRight size={18} />
          </Link>
        </article>
      </div>
    </section>
  )
}

export default Home
