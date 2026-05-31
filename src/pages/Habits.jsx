import { useEffect, useMemo, useState } from 'react'

import {
  CalendarCheck,
  CheckCircle2,
  Flame,
  Plus,
  RefreshCcw,
  Sparkles,
  Target,
  Trash2,
} from 'lucide-react'

const defaultHabits = [
  {
    id: 'habit-code',
    title: 'Code practice',
    category: 'Learning',
    streak: 0,
    completedToday: false,
  },
  {
    id: 'habit-workout',
    title: 'Workout',
    category: 'Fitness',
    streak: 0,
    completedToday: false,
  },
  {
    id: 'habit-read',
    title: 'Read / Manhwa',
    category: 'Reading',
    streak: 0,
    completedToday: false,
  },
]

function Habits() {
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('life_matrix_habits')
      return saved ? JSON.parse(saved) : defaultHabits
    } catch {
      return defaultHabits
    }
  })

  const [formData, setFormData] = useState({
    title: '',
    category: 'Growth',
  })

  useEffect(() => {
    localStorage.setItem('life_matrix_habits', JSON.stringify(habits))
  }, [habits])

  const completedToday = habits.filter((habit) => habit.completedToday).length
  const totalStreak = habits.reduce((sum, habit) => sum + (Number(habit.streak) || 0), 0)
  const completionRate = habits.length
    ? Math.round((completedToday / habits.length) * 100)
    : 0

  const topHabit = useMemo(() => {
    return [...habits].sort((a, b) => (b.streak || 0) - (a.streak || 0))[0]
  }, [habits])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addHabit = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      alert('Please enter a habit title')
      return
    }

    setHabits((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: formData.title,
        category: formData.category,
        streak: 0,
        completedToday: false,
      },
    ])

    setFormData({
      title: '',
      category: 'Growth',
    })
  }

  const toggleHabit = (habitId) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) {
          return habit
        }

        const completedTodayNext = !habit.completedToday

        return {
          ...habit,
          completedToday: completedTodayNext,
          streak: completedTodayNext
            ? (Number(habit.streak) || 0) + 1
            : Math.max(0, (Number(habit.streak) || 0) - 1),
        }
      })
    )
  }

  const resetDay = () => {
    setHabits((prev) =>
      prev.map((habit) => ({
        ...habit,
        completedToday: false,
      }))
    )
  }

  const deleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId))
  }

  return (
    <section className="page-shell habits-page premium-habits-page">
      <div className="habits-command-hero glass-card">
        <div>
          <p className="page-kicker">Habit Matrix</p>
          <h1>Build streaks that power your Life Matrix.</h1>
          <p>
            Track daily habits, mark them complete, build streaks, and connect
            your productivity routine to your wider personal command system.
          </p>

          <div className="habits-hero-actions">
            <a href="#add-habit-form" className="btn-life">
              <Plus size={18} />
              Add Habit
            </a>

            <button type="button" className="btn-soft-life" onClick={resetDay}>
              <RefreshCcw size={17} />
              Reset Today
            </button>
          </div>
        </div>

        <div className="habits-rank-card">
          <Flame size={40} />
          <span>Today&apos;s Completion</span>
          <strong>{completionRate}%</strong>
          <p>{completedToday} / {habits.length} habits completed</p>

          <div className="habits-mini-progress">
            <div style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </div>

      <div className="habit-stat-grid section-gap">
        <article className="habit-metric-card">
          <div className="habit-metric-icon">
            <Target size={22} />
          </div>

          <p>Total Habits</p>
          <h3>{habits.length}</h3>
          <span>Daily routines</span>
        </article>

        <article className="habit-metric-card">
          <div className="habit-metric-icon">
            <CheckCircle2 size={22} />
          </div>

          <p>Completed Today</p>
          <h3>{completedToday}</h3>
          <span>Marked done</span>
        </article>

        <article className="habit-metric-card">
          <div className="habit-metric-icon">
            <Flame size={22} />
          </div>

          <p>Total Streak</p>
          <h3>{totalStreak}</h3>
          <span>Combined streak days</span>
        </article>

        <article className="habit-metric-card">
          <div className="habit-metric-icon">
            <Sparkles size={22} />
          </div>

          <p>Top Habit</p>
          <h3>{topHabit?.streak || 0}</h3>
          <span>{topHabit?.title || 'No habit yet'}</span>
        </article>
      </div>

      <article id="add-habit-form" className="habit-console-form glass-card section-gap">
        <div className="premium-form-header">
          <div>
            <p className="page-kicker">Create Habit</p>
            <h2>Add a daily routine</h2>
            <p>Keep habits simple so you can actually complete them daily.</p>
          </div>

          <span>Saved locally</span>
        </div>

        <form className="habit-premium-form-grid" onSubmit={addHabit}>
          <label>
            Habit Title
            <input
              type="text"
              name="title"
              placeholder="Example: 1 hour coding"
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Category
            <select name="category" value={formData.category} onChange={handleChange}>
              <option>Growth</option>
              <option>Learning</option>
              <option>Fitness</option>
              <option>Reading</option>
              <option>Money</option>
              <option>Health</option>
              <option>Project</option>
            </select>
          </label>

          <button type="submit" className="btn-life">
            <Plus size={18} />
            Save Habit
          </button>
        </form>
      </article>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Daily Checklist</p>
          <h2>Today&apos;s habits</h2>
        </div>
      </div>

      <div className="habit-grid-premium">
        {habits.map((habit) => (
          <article
            className={habit.completedToday ? 'habit-card-premium completed' : 'habit-card-premium'}
            key={habit.id}
          >
            <div className="habit-card-top">
              <div>
                <p>{habit.category}</p>
                <h3>{habit.title}</h3>
              </div>

              <div className="habit-streak-pill">
                <Flame size={15} />
                {habit.streak}
              </div>
            </div>

            <div className="habit-status-box">
              <CalendarCheck size={20} />
              <span>
                {habit.completedToday
                  ? 'Completed today'
                  : 'Not completed yet'}
              </span>
            </div>

            <div className="habit-card-actions">
              <button type="button" className="btn-life" onClick={() => toggleHabit(habit.id)}>
                <CheckCircle2 size={17} />
                {habit.completedToday ? 'Undo' : 'Mark Done'}
              </button>

              <button type="button" className="habit-delete-btn" onClick={() => deleteHabit(habit.id)}>
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

export default Habits
