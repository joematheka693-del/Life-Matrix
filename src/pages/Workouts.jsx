import { useMemo, useState } from 'react'

import {
  Activity,
  CalendarDays,
  Dumbbell,
  Flame,
  HeartPulse,
  Plus,
  Timer,
  Trash2,
  Zap,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'

function Workouts() {
  const { lifeData, addWorkout, updateWorkoutProgress, deleteWorkout } = useLifeData()

  const [formData, setFormData] = useState({
    title: '',
    level: 'Beginner',
    duration: '',
    progress: 0,
  })

  const workouts = lifeData.workouts || []
  const completedWorkouts = workouts.filter((workout) => workout.completed).length
  const averageProgress = workouts.length
    ? Math.round(
        workouts.reduce((sum, workout) => sum + (Number(workout.progress) || 0), 0) /
          workouts.length
      )
    : 0

  const workoutStats = [
    {
      icon: Flame,
      title: 'Completed',
      value: completedWorkouts,
      label: 'Finished sessions',
    },
    {
      icon: Timer,
      title: 'Training Time',
      value: `${workouts.length * 30}m`,
      label: 'Estimated time',
    },
    {
      icon: Dumbbell,
      title: 'Sessions',
      value: workouts.length,
      label: 'Saved workouts',
    },
    {
      icon: HeartPulse,
      title: 'Streak',
      value: `${lifeData.user?.streak || 0} Days`,
      label: 'Fitness consistency',
    },
  ]

  const suggestedExercises = [
    { name: 'Push Ups', sets: '4', reps: '15', status: 'Strength' },
    { name: 'Squats', sets: '4', reps: '20', status: 'Lower body' },
    { name: 'Plank', sets: '3', reps: '60 sec', status: 'Core' },
    { name: 'Bicep Curls', sets: '3', reps: '12', status: 'Arms' },
  ]

  const featuredWorkout = workouts[0]

  const sortedWorkouts = useMemo(
    () => [...workouts].sort((a, b) => (b.progress || 0) - (a.progress || 0)),
    [workouts]
  )

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
      alert('Please enter a workout title')
      return
    }

    addWorkout({
      title: formData.title,
      level: formData.level,
      duration: formData.duration || '30 min',
      progress: Number(formData.progress),
    })

    setFormData({
      title: '',
      level: 'Beginner',
      duration: '',
      progress: 0,
    })
  }

  return (
    <section className="page-shell workouts-page premium-workouts-page">
      <div className="workout-command-hero glass-card">
        <div>
          <p className="page-kicker">Fitness Matrix</p>
          <h1>Train smarter. Track every session. Build discipline.</h1>
          <p>
            Log workouts, update progress, monitor streaks, and keep your
            fitness system organized like the rest of your Life Matrix.
          </p>

          <div className="workout-hero-actions">
            <a href="#add-workout-form" className="btn-life">
              <Plus size={18} />
              Add Workout
            </a>

            <button className="btn-soft-life" type="button">
              <CalendarDays size={17} />
              Weekly Plan
            </button>
          </div>
        </div>

        <div className="workout-rank-card">
          <Activity size={40} />
          <span>Fitness Progress</span>
          <strong>{averageProgress}%</strong>
          <p>{completedWorkouts} completed sessions</p>

          <div className="workout-mini-progress">
            <div style={{ width: `${averageProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="workout-stat-grid section-gap">
        {workoutStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="workout-metric-card" key={stat.title}>
              <div className="workout-metric-icon">
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

      <article
        id="add-workout-form"
        className="workout-console-form glass-card section-gap"
      >
        <div className="premium-form-header">
          <div>
            <p className="page-kicker">Create Workout</p>
            <h2>Add a new training session</h2>
            <p>Use this clean form to save workouts without cramped inputs.</p>
          </div>

          <span>Saved locally</span>
        </div>

        <form className="workout-premium-form-grid" onSubmit={handleSubmit}>
          <label>
            Workout Title
            <input
              type="text"
              name="title"
              placeholder="Example: Push Day Strength"
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Level
            <select name="level" value={formData.level} onChange={handleChange}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Elite</option>
            </select>
          </label>

          <label>
            Duration
            <input
              type="text"
              name="duration"
              placeholder="Example: 45 min"
              value={formData.duration}
              onChange={handleChange}
            />
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
            Save Workout
          </button>
        </form>
      </article>

      <div className="workout-deep-grid section-gap">
        <article className="workout-plan-console glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Training Queue</p>
              <h2>Suggested exercises</h2>
            </div>

            <Zap size={22} />
          </div>

          <div className="workout-exercise-list">
            {suggestedExercises.map((exercise) => (
              <div className="workout-exercise-item" key={exercise.name}>
                <div>
                  <h3>{exercise.name}</h3>
                  <p>
                    {exercise.sets} sets · {exercise.reps} reps
                  </p>
                </div>

                <span>{exercise.status}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="workout-feature-card glass-card">
          <p className="page-kicker">Current Focus</p>
          <h2>{featuredWorkout?.title || 'No workout yet'}</h2>
          <p>
            {featuredWorkout
              ? `${featuredWorkout.level} · ${featuredWorkout.duration}`
              : 'Add your first workout and it will appear here as your current focus.'}
          </p>

          <div className="habit-progress-info">
            <span>Focus Progress</span>
            <strong>{featuredWorkout?.progress || 0}%</strong>
          </div>

          <div className="habit-progress-bar">
            <div
              className="habit-progress-fill"
              style={{ width: `${featuredWorkout?.progress || 0}%` }}
            ></div>
          </div>
        </article>
      </div>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Saved Training</p>
          <h2>Workout Progress</h2>
        </div>
      </div>

      <div className="workout-grid-premium">
        {sortedWorkouts.map((workout) => (
          <article className="workout-session-card" key={workout.id}>
            <div className="workout-card-top">
              <div>
                <p>{workout.level}</p>
                <h3>{workout.title}</h3>
              </div>

              <span>{workout.duration}</span>
            </div>

            <div className="habit-progress-info">
              <span>Session Progress</span>
              <strong>{workout.progress}%</strong>
            </div>

            <div className="habit-progress-bar">
              <div
                className="habit-progress-fill"
                style={{ width: `${workout.progress}%` }}
              ></div>
            </div>

            <div className="workout-card-actions">
              <label>
                Update Progress
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={workout.progress}
                  onChange={(event) =>
                    updateWorkoutProgress(workout.id, event.target.value)
                  }
                />
              </label>

              <button type="button" onClick={() => deleteWorkout(workout.id)}>
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

export default Workouts
