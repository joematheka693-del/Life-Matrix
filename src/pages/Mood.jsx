import { useEffect, useMemo, useState } from 'react'
import { BatteryCharging, CalendarClock, HeartPulse, Plus, Sparkles, Trash2, TrendingUp } from 'lucide-react'

const defaultEntries = [
  { id: 'mood-1', mood: 'Focused', energy: 80, category: 'Learning', note: 'Good coding session and steady progress.', createdAt: new Date().toISOString() },
  { id: 'mood-2', mood: 'Motivated', energy: 70, category: 'Project', note: 'Ready to continue building Life Matrix.', createdAt: new Date().toISOString() },
]

function Mood() {
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('life_matrix_mood')
      return saved ? JSON.parse(saved) : defaultEntries
    } catch {
      return defaultEntries
    }
  })

  const [formData, setFormData] = useState({
    mood: 'Focused',
    energy: 75,
    category: 'Learning',
    note: '',
  })

  useEffect(() => {
    localStorage.setItem('life_matrix_mood', JSON.stringify(entries))
  }, [entries])

  const averageEnergy = entries.length
    ? Math.round(entries.reduce((sum, item) => sum + Number(item.energy || 0), 0) / entries.length)
    : 0

  const topMood = useMemo(() => {
    const counts = entries.reduce((acc, item) => {
      acc[item.mood] = (acc[item.mood] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
  }, [entries])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addEntry = (event) => {
    event.preventDefault()

    if (!formData.note.trim()) {
      alert('Please write a short note')
      return
    }

    setEntries((prev) => [
      {
        id: String(Date.now()),
        ...formData,
        energy: Number(formData.energy),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])

    setFormData({
      mood: 'Focused',
      energy: 75,
      category: 'Learning',
      note: '',
    })
  }

  const deleteEntry = (id) => {
    setEntries((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <section className="page-shell mood-page premium-mood-page">
      <div className="mood-command-hero glass-card">
        <div>
          <p className="page-kicker">Mood Core</p>
          <h1>Track your energy, mindset, and emotional performance.</h1>
          <p>
            Log how you feel before or after studying, coding, workouts, reading,
            or project work so you understand what affects your productivity.
          </p>

          <div className="mood-hero-actions">
            <a href="#add-mood-form" className="btn-life">
              <Plus size={18} />
              Add Mood
            </a>
          </div>
        </div>

        <div className="mood-rank-card">
          <HeartPulse size={42} />
          <span>Average Energy</span>
          <strong>{averageEnergy}%</strong>
          <p>Most common mood: {topMood}</p>
        </div>
      </div>

      <div className="page-action-grid section-gap">
        <article className="system-metric-card">
          <div className="system-metric-icon"><HeartPulse size={22} /></div>
          <p>Entries</p><h3>{entries.length}</h3><span>Mood logs</span>
        </article>

        <article className="system-metric-card">
          <div className="system-metric-icon"><BatteryCharging size={22} /></div>
          <p>Average Energy</p><h3>{averageEnergy}%</h3><span>Energy score</span>
        </article>

        <article className="system-metric-card">
          <div className="system-metric-icon"><Sparkles size={22} /></div>
          <p>Top Mood</p><h3>{topMood}</h3><span>Most frequent</span>
        </article>

        <article className="system-metric-card">
          <div className="system-metric-icon"><TrendingUp size={22} /></div>
          <p>Status</p><h3>{averageEnergy >= 70 ? 'Strong' : 'Building'}</h3><span>Current state</span>
        </article>
      </div>

      <article id="add-mood-form" className="system-console-form glass-card section-gap">
        <div className="premium-form-header">
          <div>
            <p className="page-kicker">Mood Entry</p>
            <h2>Record how you feel</h2>
            <p>Quickly capture your state and what caused it.</p>
          </div>
          <span>Saved locally</span>
        </div>

        <form className="mood-form-grid" onSubmit={addEntry}>
          <label>
            Mood
            <select name="mood" value={formData.mood} onChange={handleChange}>
              <option>Focused</option>
              <option>Motivated</option>
              <option>Calm</option>
              <option>Inspired</option>
              <option>Tired</option>
              <option>Confused</option>
              <option>Stressed</option>
            </select>
          </label>

          <label>
            Energy %
            <input type="number" name="energy" min="0" max="100" value={formData.energy} onChange={handleChange} />
          </label>

          <label>
            Category
            <select name="category" value={formData.category} onChange={handleChange}>
              <option>Learning</option>
              <option>Project</option>
              <option>Fitness</option>
              <option>Reading</option>
              <option>Personal</option>
            </select>
          </label>

          <label className="mood-wide-field">
            Note
            <textarea name="note" rows="5" placeholder="What happened today?" value={formData.note} onChange={handleChange}></textarea>
          </label>

          <button type="submit" className="btn-life">
            <Plus size={18} />
            Save Mood
          </button>
        </form>
      </article>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Mood History</p>
          <h2>Recent entries</h2>
        </div>
      </div>

      <div className="system-card-grid">
        {entries.map((entry) => (
          <article className="system-card" key={entry.id}>
            <div className="system-card-top">
              <div>
                <p>{entry.category}</p>
                <h3>{entry.mood}</h3>
              </div>
              <span className="system-pill">{entry.energy}% energy</span>
            </div>

            <p className="system-card-body">{entry.note}</p>

            <div className="system-card-actions">
              <span className="mood-date"><CalendarClock size={15} /> {new Date(entry.createdAt).toLocaleDateString()}</span>
              <button type="button" className="system-delete-btn" onClick={() => deleteEntry(entry.id)}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Mood
