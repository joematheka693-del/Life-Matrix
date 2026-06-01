import {
  Award,
  BarChart3,
  Brain,
  CalendarCheck,
  FolderKanban,
  HeartPulse,
  Star,
  Target,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'
import { getExtendedSystemStats } from '../utils/extendedSystemStats.js'

function Score() {
  const { lifeData } = useLifeData()
  const stats = getExtendedSystemStats(lifeData)

  const cards = [
    {
      icon: Target,
      title: 'Core Items',
      value: stats.core.totalItems,
      label: 'Main LifeData items',
    },
    {
      icon: Award,
      title: 'Badges',
      value: stats.core.unlockedBadges.length,
      label: 'Unlocked achievements',
    },
    {
      icon: Star,
      title: 'XP',
      value: stats.core.calculatedXp,
      label: 'Calculated XP',
    },
    {
      icon: BarChart3,
      title: 'System Score',
      value: `${stats.systemScore}%`,
      label: 'All modules combined',
    },
  ]

  return (
    <section className="page-shell score-page">
      <div className="system-hero glass-card">
        <div>
          <p className="page-kicker">Life Score</p>
          <h1>One command overview for your entire system.</h1>
          <p>
            Life Score now uses the full analytics engine, including core
            modules, habits, planner, mood, projects, skills, finance, reviews,
            notes, resources, decisions, and launch readiness.
          </p>

          <div className="system-hero-actions">
            <a href="/analytics" className="btn-life">
              <BarChart3 size={18} />
              Full Analytics
            </a>
          </div>
        </div>

        <div className="system-hero-card">
          <Star size={42} />
          <span>Life Score</span>
          <strong>{stats.systemScore}%</strong>
          <p>{stats.core.calculatedRank} · Level {stats.core.level}</p>
        </div>
      </div>

      <div className="system-grid-4 section-gap">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <article className="system-stat-card" key={card.title}>
              <div className="system-stat-icon">
                <Icon size={22} />
              </div>

              <p>{card.title}</p>
              <h3>{card.value}</h3>
              <span>{card.label}</span>
            </article>
          )
        })}
      </div>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">System Modules</p>
          <h2>Score breakdown</h2>
        </div>
      </div>

      <div className="system-list-grid">
        {stats.extendedModules.map((module) => {
          const icons = {
            core: BarChart3,
            habits: CalendarCheck,
            mood: HeartPulse,
            projects: FolderKanban,
            skills: Brain,
          }

          const Icon = icons[module.key] || Star

          return (
            <article className="system-item-card" key={module.key}>
              <div className="system-item-top">
                <div>
                  <p>{module.count} records</p>
                  <h3>{module.name}</h3>
                </div>

                <span className="system-pill">{module.score}%</span>
              </div>

              <div className="habit-progress-bar">
                <div
                  className="habit-progress-fill"
                  style={{ width: `${Math.min(100, module.score)}%` }}
                ></div>
              </div>

              <p className="system-body">
                <Icon size={18} /> {module.detail}
              </p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Score
