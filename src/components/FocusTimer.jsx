import { useEffect, useMemo, useState } from 'react'

import {
  Pause,
  Play,
  RotateCcw,
  Timer,
  Zap,
} from 'lucide-react'

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60

  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

const timerModes = [
  {
    id: 'focus',
    label: 'Focus',
    minutes: 25,
    text: 'Deep work sprint',
  },
  {
    id: 'short',
    label: 'Short Break',
    minutes: 5,
    text: 'Quick reset',
  },
  {
    id: 'long',
    label: 'Long Break',
    minutes: 15,
    text: 'Recovery block',
  },
]

function FocusTimer() {
  const [activeMode, setActiveMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(() => {
    return Number(localStorage.getItem('life_matrix_focus_sessions')) || 0
  })

  const currentMode = useMemo(
    () => timerModes.find((mode) => mode.id === activeMode) || timerModes[0],
    [activeMode]
  )

  const totalSeconds = currentMode.minutes * 60
  const progress = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100)

  useEffect(() => {
    if (!isRunning) {
      return undefined
    }

    const timerId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId)
          setIsRunning(false)

          if (activeMode === 'focus') {
            setSessions((currentSessions) => {
              const nextSessions = currentSessions + 1
              localStorage.setItem('life_matrix_focus_sessions', String(nextSessions))
              return nextSessions
            })
          }

          return 0
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timerId)
  }, [activeMode, isRunning])

  const switchMode = (mode) => {
    setActiveMode(mode.id)
    setSecondsLeft(mode.minutes * 60)
    setIsRunning(false)
  }

  const resetTimer = () => {
    setSecondsLeft(currentMode.minutes * 60)
    setIsRunning(false)
  }

  return (
    <section className="focus-timer-section section-gap">
      <div className="focus-timer-card glass-card">
        <div className="focus-timer-copy">
          <p className="page-kicker">Focus Timer</p>
          <h2>Pomodoro command block</h2>
          <p>
            Use this timer when working on coding, studying, reading, workouts,
            or project tasks inside Life Matrix.
          </p>

          <div className="focus-mode-tabs">
            {timerModes.map((mode) => (
              <button
                type="button"
                className={activeMode === mode.id ? 'active' : ''}
                key={mode.id}
                onClick={() => switchMode(mode)}
              >
                <strong>{mode.label}</strong>
                <span>{mode.text}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="focus-timer-console">
          <div className="focus-timer-ring">
            <Timer size={34} />
            <strong>{formatTime(secondsLeft)}</strong>
            <span>{currentMode.label}</span>
          </div>

          <div className="habit-progress-info">
            <span>Timer Progress</span>
            <strong>{progress}%</strong>
          </div>

          <div className="habit-progress-bar">
            <div
              className="habit-progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="focus-timer-actions">
            <button
              type="button"
              className="btn-life"
              onClick={() => setIsRunning((prev) => !prev)}
            >
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              {isRunning ? 'Pause' : 'Start'}
            </button>

            <button type="button" className="btn-soft-life" onClick={resetTimer}>
              <RotateCcw size={17} />
              Reset
            </button>
          </div>

          <div className="focus-session-count">
            <Zap size={18} />
            <span>{sessions} focus sessions completed</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FocusTimer
