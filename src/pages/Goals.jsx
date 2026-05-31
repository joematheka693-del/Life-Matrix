import { useMemo, useState } from 'react'

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Flag,
  Gem,
  ListChecks,
  Plus,
  ShieldCheck,
  Target,
  Trash2,
  Trophy,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'

function Goals() {
  const { lifeData, addGoal, updateGoalProgress, deleteGoal } = useLifeData()

  const [formData, setFormData] = useState({
    title: '',
    category: 'Project',
    deadline: '',
    priority: 'Medium',
    progress: 0,
  })

  const goals = lifeData.goals || []
  const completedGoals = goals.filter((goal) => goal.completed).length
  const dueSoonGoals = goals.filter((goal) =>
    String(goal.deadline || '').toLowerCase().includes('week')
  ).length

  const averageProgress = goals.length
    ? Math.round(
        goals.reduce((sum, goal) => sum + (Number(goal.progress) || 0), 0) /
          goals.length
      )
    : 0

  const goalStats = [
    {
      icon: Target,
      title: 'Active Goals',
      value: goals.length,
      label: 'Currently tracked',
    },
    {
      icon: CheckCircle2,
      title: 'Completed',
      value: completedGoals,
      label: 'Finished goals',
    },
    {
      icon: Clock,
      title: 'Due Soon',
      value: dueSoonGoals,
      label: 'Need attention',
    },
    {
      icon: Trophy,
      title: 'Progress',
      value: `${averageProgress}%`,
      label: 'Average completion',
    },
  ]

  const sortedGoals = useMemo(
    () =>
      [...goals].sort((a, b) => {
        const priorityScore = { High: 3, Medium: 2, Low: 1 }
        return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0)
      }),
    [goals]
  )

  const milestones = [
    { title: 'Create project layout', done: true },
    { title: 'Build all main pages', done: true },
    { title: 'Add localStorage data system', done: true },
    { title: 'Connect backend later', done: false },
  ]

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      alert('Please enter a goal title')
      return
    }

    addGoal({
      title: formData.title,
      category: formData.category,
      deadline: formData.deadline || 'No deadline',
      priority: formData.priority,
      progress: Number(formData.progress),
    })

    setFormData({
      title: '',
      category: 'Project',
      deadline: '',
      priority: 'Medium',
      progress: 0,
    })
  }

  return (
    <section className="page-shell goals-page premium-goals-page">
      <div className="goals-command-hero glass-card">
        <div>
          <p className="page-kicker">Goal Matrix</p>
          <h1>Set targets. Track milestones. Complete your missions.</h1>
          <p>
            Organize personal goals, project goals, learning goals, deadlines,
            priorities, and achievements in a cleaner mission board.
          </p>

          <div className="goals-hero-actions">
            <a href="#add-goal-form" className="btn-life">
              <Plus size={18} />
              Add New Goal
            </a>

            <button className="btn-soft-life" type="button">
              <CalendarDays size={17} />
              Goal Calendar
            </button>
          </div>
        </div>

        <div className="goals-rank-card">
          <Flag size={40} />
          <span>Main Mission</span>
          <strong>{goals[0]?.title || 'Life Matrix'}</strong>
          <p>{goals[0]?.progress || 0}% progress</p>

          <div className="goals-mini-progress">
            <div style={{ width: `${goals[0]?.progress || 0}%` }}></div>
          </div>
        </div>
      </div>

      <div className="goal-stat-grid section-gap">
        {goalStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="goal-metric-card" key={stat.title}>
              <div className="goal-metric-icon">
                <Icon size={22} />
              </div>

              <div>
                <p>{stat.title}</p>
                <h3>{stat.value}</h3>
                <span>{stat.label}</span>
              </div>
            </article>
          )
        })}
      </div>

      <article id="add-goal-form" className="goal-console-form glass-card section-gap">
        <div className="premium-form-header">
          <div>
            <p className="page-kicker">Create Goal</p>
            <h2>Add a new mission</h2>
            <p>Separate mission details, priority, and progress cleanly.</p>
          </div>

          <span>Saved locally</span>
        </div>

        <form className="goal-premium-form-grid" onSubmit={handleSubmit}>
          <label>
            Goal Title
            <input
              type="text"
              name="title"
              placeholder="Example: Finish backend"
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Category
            <select name="category" value={formData.category} onChange={handleChange}>
              <option>Project</option>
              <option>Learning</option>
              <option>Fitness</option>
              <option>Growth</option>
              <option>Money</option>
              <option>Personal</option>
            </select>
          </label>

          <label>
            Deadline
            <input
              type="text"
              name="deadline"
              placeholder="Example: This week"
              value={formData.deadline}
              onChange={handleChange}
            />
          </label>

          <label>
            Priority
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>

          <label>
            Progress %
            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
            />
          </label>

          <button className="btn-life" type="submit">
            <Plus size={18} />
            Save Goal
          </button>
        </form>
      </article>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Active Missions</p>
          <h2>Goal Progress</h2>
        </div>
      </div>

      <div className="goal-grid-premium">
        {sortedGoals.map((goal) => (
          <article className="goal-mission-card" key={goal.id}>
            <div className="goal-card-top">
              <div>
                <p>{goal.category}</p>
                <h3>{goal.title}</h3>
              </div>

              <span className={`goal-priority-pill ${String(goal.priority).toLowerCase()}`}>
                {goal.priority}
              </span>
            </div>

            <div className="goal-meta-row">
              <span>
                <Clock size={16} />
                {goal.deadline}
              </span>

              <span>
                <ListChecks size={16} />
                {goal.progress}% done
              </span>
            </div>

            <div className="habit-progress-info">
              <span>Goal Progress</span>
              <strong>{goal.progress}%</strong>
            </div>

            <div className="habit-progress-bar">
              <div
                className="habit-progress-fill"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>

            <div className="goal-card-actions">
              <label>
                Update Progress
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(event) =>
                    updateGoalProgress(goal.id, event.target.value)
                  }
                />
              </label>

              <button type="button" onClick={() => deleteGoal(goal.id)}>
                <Trash2 size={17} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="goals-bottom-grid section-gap">
        <article className="milestone-console glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Project Milestones</p>
              <h3>Life Matrix Build Path</h3>
            </div>

            <span>3 / 4 Done</span>
          </div>

          <div className="milestone-list">
            {milestones.map((milestone) => (
              <div
                className={milestone.done ? 'milestone-item done' : 'milestone-item'}
                key={milestone.title}
              >
                <CheckCircle2 size={19} />
                <p>{milestone.title}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="achievement-console glass-card">
          <p className="page-kicker">Achievement System</p>
          <h3>Next unlock: Builder Badge</h3>
          <p>Complete frontend pages and local data to unlock your next badge.</p>

          <div className="achievement-badge-preview">
            <div>
              <Gem size={32} />
            </div>

            <div>
              <span>Builder Badge</span>
              <strong>85% unlocked</strong>
            </div>
          </div>

          <div className="habit-progress-bar">
            <div className="habit-progress-fill" style={{ width: '85%' }}></div>
          </div>

          <div className="goal-system-note">
            <ShieldCheck size={17} />
            <span>More automatic achievements can come in the XP phase.</span>
          </div>
        </article>
      </div>
    </section>
  )
}

export default Goals
