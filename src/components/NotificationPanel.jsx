import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle2,
  Clock,
  Dumbbell,
  Target,
  TrendingUp,
  X,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'

function NotificationPanel({ isOpen, onClose }) {
  const { lifeData } = useLifeData()

  const goals = lifeData.goals || []
  const workouts = lifeData.workouts || []
  const reading = lifeData.reading || []
  const watchlist = lifeData.watchlist || []
  const user = lifeData.user || {}

  if (!isOpen) {
    return null
  }

  const lowProgressGoals = goals
    .filter((goal) => Number(goal.progress) < 50)
    .slice(0, 3)

  const nearCompleteItems = [
    ...goals
      .filter((goal) => Number(goal.progress) >= 80 && Number(goal.progress) < 100)
      .map((goal) => ({
        title: goal.title,
        type: 'Goal',
        icon: Target,
      })),
    ...reading
      .filter((item) => Number(item.progress) >= 80 && Number(item.progress) < 100)
      .map((item) => ({
        title: item.title,
        type: 'Reading',
        icon: BookOpen,
      })),
    ...watchlist
      .filter((item) => Number(item.progress) >= 80 && Number(item.progress) < 100)
      .map((item) => ({
        title: item.title,
        type: 'Watchlist',
        icon: TrendingUp,
      })),
  ].slice(0, 3)

  const notifications = [
    {
      id: 'daily',
      icon: Bell,
      title: 'Daily matrix check-in',
      text: 'Update at least one module today to keep your system active.',
      type: 'System',
      tone: 'info',
    },
    {
      id: 'streak',
      icon: Clock,
      title: `${user.streak || 0} day streak`,
      text: 'Your streak is stored in Settings and visible across the app.',
      type: 'Profile',
      tone: 'success',
    },
    {
      id: 'workouts',
      icon: Dumbbell,
      title: `${workouts.length} workout sessions`,
      text: workouts.length
        ? 'Keep updating your workout progress after training.'
        : 'Add your first workout using Quick Add.',
      type: 'Fitness',
      tone: workouts.length ? 'info' : 'warning',
    },
    ...lowProgressGoals.map((goal) => ({
      id: `goal-${goal.id}`,
      icon: AlertTriangle,
      title: goal.title,
      text: `This goal is still at ${goal.progress || 0}%. Push it above 50%.`,
      type: 'Goal Alert',
      tone: 'warning',
    })),
    ...nearCompleteItems.map((item, index) => ({
      id: `near-${index}-${item.title}`,
      icon: item.icon,
      title: item.title,
      text: `${item.type} is close to completion. Finish it and raise your Matrix score.`,
      type: 'Near Complete',
      tone: 'success',
    })),
  ]

  return (
    <div className="notification-panel-shell">
      <div className="notification-panel glass-card">
        <div className="notification-header">
          <div>
            <p className="page-kicker">Notification Center</p>
            <h2>Matrix alerts</h2>
          </div>

          <button type="button" onClick={onClose}>
            <X size={19} />
          </button>
        </div>

        <div className="notification-summary">
          <div>
            <strong>{notifications.length}</strong>
            <span>Active alerts</span>
          </div>

          <div>
            <strong>{lowProgressGoals.length}</strong>
            <span>Need focus</span>
          </div>

          <div>
            <strong>{nearCompleteItems.length}</strong>
            <span>Near complete</span>
          </div>
        </div>

        <div className="notification-list">
          {notifications.map((item) => {
            const Icon = item.icon

            return (
              <article
                className={`notification-item ${item.tone}`}
                key={item.id}
              >
                <div className="notification-icon">
                  <Icon size={19} />
                </div>

                <div>
                  <span>{item.type}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            )
          })}
        </div>

        <div className="notification-footer">
          <CheckCircle2 size={17} />
          <span>Future phase can add real reminders and browser notifications.</span>
        </div>
      </div>
    </div>
  )
}

export default NotificationPanel
