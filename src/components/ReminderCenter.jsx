import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  CalendarClock,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react'

import { getReminderEngineData } from '../utils/reminderEngine.js'

function ReminderCenter() {
  const data = getReminderEngineData()

  const priorityClass = {
    High: 'high',
    Medium: 'medium',
    Low: 'low',
  }

  return (
    <section className="reminder-center-section section-gap">
      <div className="reminder-hero glass-card">
        <div>
          <p className="page-kicker">Reminder Engine</p>
          <h2>Today&apos;s system reminders</h2>
          <p>
            These reminders are generated from your actual local modules:
            Planner, Habits, Projects, Skills, Finance, Reviews, Launch checks,
            and Focus sessions.
          </p>
        </div>

        <div className="reminder-score-card">
          <BellRing size={36} />
          <span>{data.today}</span>
          <strong>{data.reminders.length}</strong>
          <p>active reminders</p>
        </div>
      </div>

      <div className="reminder-stat-grid">
        <article>
          <AlertTriangle size={21} />
          <p>High Priority</p>
          <h3>{data.high}</h3>
          <span>Needs attention</span>
        </article>

        <article>
          <Clock size={21} />
          <p>Medium Priority</p>
          <h3>{data.medium}</h3>
          <span>Plan soon</span>
        </article>

        <article>
          <ShieldCheck size={21} />
          <p>Low Priority</p>
          <h3>{data.low}</h3>
          <span>Optional polish</span>
        </article>

        <article>
          <Zap size={21} />
          <p>Focus Sessions</p>
          <h3>{data.focusSessions}</h3>
          <span>Completed sessions</span>
        </article>
      </div>

      <div className="reminder-list glass-card section-gap">
        <div className="dashboard-card-header">
          <div>
            <p className="page-kicker">Priority Queue</p>
            <h2>Action reminders</h2>
          </div>

          <CalendarClock size={22} />
        </div>

        {data.reminders.length ? (
          <div className="reminder-item-list">
            {data.reminders.map((reminder) => (
              <Link to={reminder.route} className="reminder-item" key={reminder.id}>
                <span className={`reminder-priority ${priorityClass[reminder.priority]}`}>
                  {reminder.priority}
                </span>

                <div>
                  <small>{reminder.type}</small>
                  <h3>{reminder.title}</h3>
                  <p>{reminder.text}</p>
                </div>

                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="life-empty-state">
            <CheckCircle2 size={38} />
            <h3>No reminders right now</h3>
            <p>Your system is clear. Keep updating your modules daily.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ReminderCenter
