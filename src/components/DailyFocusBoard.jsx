import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CalendarCheck,
  Flame,
  Focus,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'
import { getDailyFocus } from '../utils/dailyFocus.js'

function DailyFocusBoard() {
  const { lifeData } = useLifeData()
  const { focusTasks, focusSummary } = getDailyFocus(lifeData)

  const priorityClass = {
    High: 'high',
    Medium: 'medium',
    Low: 'low',
  }

  return (
    <section className="daily-focus-section section-gap">
      <div className="daily-focus-hero glass-card">
        <div>
          <p className="page-kicker">Daily Focus Engine</p>
          <h2>Today&apos;s priority board</h2>
          <p>
            These actions are generated from your actual Life Matrix data:
            weakest module, near-complete items, XP, rank, and streak.
          </p>
        </div>

        <div className="daily-focus-score">
          <Sparkles size={34} />
          <span>Daily Score</span>
          <strong>{focusSummary.dailyScore}%</strong>
        </div>
      </div>

      <div className="daily-focus-grid">
        <article className="daily-focus-list glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Priority Actions</p>
              <h2>Complete these first</h2>
            </div>

            <Focus size={22} />
          </div>

          <div className="daily-task-list">
            {focusTasks.map((task, index) => (
              <Link
                to={task.route}
                className="daily-task-card"
                key={`${task.title}-${index}`}
              >
                <div className={`daily-task-priority ${priorityClass[task.priority]}`}>
                  {task.priority}
                </div>

                <div>
                  <span>{task.category}</span>
                  <h3>{task.title}</h3>
                  <p>{task.text}</p>
                </div>

                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        </article>

        <article className="daily-focus-summary glass-card">
          <p className="page-kicker">Today&apos;s System State</p>
          <h2>Focus snapshot</h2>

          <div className="daily-summary-list">
            <div>
              <Zap size={18} />
              <span>XP</span>
              <strong>{focusSummary.xp}</strong>
            </div>

            <div>
              <Trophy size={18} />
              <span>Rank</span>
              <strong>{focusSummary.rank}</strong>
            </div>

            <div>
              <Target size={18} />
              <span>Weakest</span>
              <strong>{focusSummary.weakestModule}</strong>
            </div>

            <div>
              <CalendarCheck size={18} />
              <span>Strongest</span>
              <strong>{focusSummary.strongestModule}</strong>
            </div>

            <div>
              <Flame size={18} />
              <span>Streak</span>
              <strong>{focusSummary.streak} days</strong>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

export default DailyFocusBoard
