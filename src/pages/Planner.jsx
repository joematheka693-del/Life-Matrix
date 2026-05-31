import { useEffect, useMemo, useState } from 'react'

import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Flag,
  ListChecks,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'

const defaultPlans = [
  {
    id: 'plan-demo-1',
    title: 'Review Life Matrix UI',
    category: 'Project',
    date: 'Today',
    time: 'Evening',
    priority: 'High',
    completed: false,
  },
  {
    id: 'plan-demo-2',
    title: 'Study React components',
    category: 'Learning',
    date: 'Tomorrow',
    time: 'Morning',
    priority: 'Medium',
    completed: false,
  },
  {
    id: 'plan-demo-3',
    title: 'Workout session',
    category: 'Fitness',
    date: 'This week',
    time: 'Anytime',
    priority: 'Low',
    completed: false,
  },
]

function Planner() {
  const [plans, setPlans] = useState(() => {
    try {
      const saved = localStorage.getItem('life_matrix_planner')
      return saved ? JSON.parse(saved) : defaultPlans
    } catch {
      return defaultPlans
    }
  })

  const [filter, setFilter] = useState('All')

  const [formData, setFormData] = useState({
    title: '',
    category: 'Project',
    date: 'Today',
    time: '',
    priority: 'Medium',
  })

  useEffect(() => {
    localStorage.setItem('life_matrix_planner', JSON.stringify(plans))
  }, [plans])

  const completedPlans = plans.filter((plan) => plan.completed).length
  const activePlans = plans.length - completedPlans
  const highPriorityPlans = plans.filter((plan) => plan.priority === 'High').length

  const filteredPlans = useMemo(() => {
    if (filter === 'All') {
      return plans
    }

    if (filter === 'Completed') {
      return plans.filter((plan) => plan.completed)
    }

    if (filter === 'Active') {
      return plans.filter((plan) => !plan.completed)
    }

    return plans.filter((plan) => plan.category === filter)
  }, [filter, plans])

  const plannerStats = [
    {
      icon: CalendarDays,
      title: 'Total Plans',
      value: plans.length,
      label: 'Scheduled items',
    },
    {
      icon: ListChecks,
      title: 'Active',
      value: activePlans,
      label: 'Still pending',
    },
    {
      icon: CheckCircle2,
      title: 'Completed',
      value: completedPlans,
      label: 'Done items',
    },
    {
      icon: Flag,
      title: 'High Priority',
      value: highPriorityPlans,
      label: 'Need attention',
    },
  ]

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addPlan = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      alert('Please enter a plan title')
      return
    }

    setPlans((prev) => [
      {
        id: crypto.randomUUID(),
        ...formData,
        time: formData.time || 'Anytime',
        completed: false,
      },
      ...prev,
    ])

    setFormData({
      title: '',
      category: 'Project',
      date: 'Today',
      time: '',
      priority: 'Medium',
    })
  }

  const togglePlan = (planId) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              completed: !plan.completed,
            }
          : plan
      )
    )
  }

  const deletePlan = (planId) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== planId))
  }

  return (
    <section className="page-shell planner-page premium-planner-page">
      <div className="planner-command-hero glass-card">
        <div>
          <p className="page-kicker">Planner Matrix</p>
          <h1>Schedule your missions, deadlines, and daily plans.</h1>
          <p>
            Use the planner to organize study blocks, project tasks, workout
            sessions, habit routines, and personal deadlines in one board.
          </p>

          <div className="planner-hero-actions">
            <a href="#add-plan-form" className="btn-life">
              <Plus size={18} />
              Add Plan
            </a>

            <button
              type="button"
              className="btn-soft-life"
              onClick={() => setFilter('Active')}
            >
              <Clock size={17} />
              View Active
            </button>
          </div>
        </div>

        <div className="planner-rank-card">
          <Sparkles size={40} />
          <span>Planner Completion</span>
          <strong>
            {plans.length ? Math.round((completedPlans / plans.length) * 100) : 0}%
          </strong>
          <p>{completedPlans} / {plans.length} plans completed</p>

          <div className="planner-mini-progress">
            <div
              style={{
                width: `${plans.length ? Math.round((completedPlans / plans.length) * 100) : 0}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="planner-stat-grid section-gap">
        {plannerStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="planner-metric-card" key={stat.title}>
              <div className="planner-metric-icon">
                <Icon size={22} />
              </div>

              <p>{stat.title}</p>
              <h3>{stat.value}</h3>
              <span>{stat.label}</span>
            </article>
          )
        })}
      </div>

      <article id="add-plan-form" className="planner-console-form glass-card section-gap">
        <div className="premium-form-header">
          <div>
            <p className="page-kicker">Create Plan</p>
            <h2>Add a schedule item</h2>
            <p>Use this board for deadlines, events, tasks, and timed blocks.</p>
          </div>

          <span>Saved locally</span>
        </div>

        <form className="planner-premium-form-grid" onSubmit={addPlan}>
          <label>
            Plan Title
            <input
              type="text"
              name="title"
              placeholder="Example: Complete React routing"
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
              <option>Reading</option>
              <option>Habit</option>
              <option>Personal</option>
              <option>Money</option>
            </select>
          </label>

          <label>
            Date
            <input
              type="text"
              name="date"
              placeholder="Today / Tomorrow / 2026-06-01"
              value={formData.date}
              onChange={handleChange}
            />
          </label>

          <label>
            Time
            <input
              type="text"
              name="time"
              placeholder="Example: 8:00 PM"
              value={formData.time}
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

          <button type="submit" className="btn-life">
            <Plus size={18} />
            Save Plan
          </button>
        </form>
      </article>

      <div className="planner-toolbar section-gap">
        {['All', 'Active', 'Completed', 'Project', 'Learning', 'Fitness', 'Reading', 'Habit'].map(
          (item) => (
            <button
              type="button"
              key={item}
              className={filter === item ? 'active' : ''}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          )
        )}
      </div>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Planner Board</p>
          <h2>{filter} plans</h2>
        </div>
      </div>

      <div className="planner-grid-premium">
        {filteredPlans.map((plan) => (
          <article
            className={plan.completed ? 'planner-card-premium completed' : 'planner-card-premium'}
            key={plan.id}
          >
            <div className="planner-card-top">
              <div>
                <p>{plan.category}</p>
                <h3>{plan.title}</h3>
              </div>

              <span className={`planner-priority-pill ${plan.priority.toLowerCase()}`}>
                {plan.priority}
              </span>
            </div>

            <div className="planner-meta-row">
              <span>
                <CalendarDays size={16} />
                {plan.date}
              </span>

              <span>
                <Clock size={16} />
                {plan.time}
              </span>
            </div>

            <div className="planner-status-box">
              <CheckCircle2 size={20} />
              <span>{plan.completed ? 'Completed' : 'Pending'}</span>
            </div>

            <div className="planner-card-actions">
              <button type="button" className="btn-life" onClick={() => togglePlan(plan.id)}>
                <CheckCircle2 size={17} />
                {plan.completed ? 'Undo' : 'Mark Done'}
              </button>

              <button type="button" className="planner-delete-btn" onClick={() => deletePlan(plan.id)}>
                <Trash2 size={17} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Planner
