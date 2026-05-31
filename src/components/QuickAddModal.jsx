import { useState } from 'react'

import {
  BookOpen,
  Brain,
  Dumbbell,
  Library,
  PlaySquare,
  Plus,
  Target,
  X,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'

const quickTypes = [
  {
    id: 'goal',
    label: 'Goal',
    icon: Target,
    description: 'Add a new mission or target.',
  },
  {
    id: 'workout',
    label: 'Workout',
    icon: Dumbbell,
    description: 'Add a training session.',
  },
  {
    id: 'study',
    label: 'Study',
    icon: Brain,
    description: 'Add a learning path.',
  },
  {
    id: 'reading',
    label: 'Reading',
    icon: Library,
    description: 'Add manhwa, manga, book, or novel.',
  },
  {
    id: 'watch',
    label: 'Watchlist',
    icon: PlaySquare,
    description: 'Add anime, show, movie, or series.',
  },
]

function QuickAddModal({ isOpen, onClose }) {
  const {
    addGoal,
    addWorkout,
    addStudyItem,
    addReadingItem,
    addWatchItem,
  } = useLifeData()

  const [activeType, setActiveType] = useState('goal')
  const [formData, setFormData] = useState({
    title: '',
    category: 'Project',
    priority: 'Medium',
    deadline: '',
    level: 'Beginner',
    duration: '',
    status: 'Active',
    progress: 0,
    totalUnits: 100,
    currentUnit: 0,
    unitLabel: 'Chapter',
    type: 'Anime',
    episodes: 12,
    watchedEpisodes: 0,
    posterUrl: '',
    notes: '',
  })

  if (!isOpen) {
    return null
  }

  const ActiveIcon = quickTypes.find((item) => item.id === activeType)?.icon || Plus

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Project',
      priority: 'Medium',
      deadline: '',
      level: 'Beginner',
      duration: '',
      status: 'Active',
      progress: 0,
      totalUnits: 100,
      currentUnit: 0,
      unitLabel: 'Chapter',
      type: 'Anime',
      episodes: 12,
      watchedEpisodes: 0,
      posterUrl: '',
      notes: '',
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      alert('Please enter a title')
      return
    }

    if (activeType === 'goal') {
      addGoal({
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        deadline: formData.deadline || 'No deadline',
        progress: Number(formData.progress) || 0,
      })
    }

    if (activeType === 'workout') {
      addWorkout({
        title: formData.title,
        level: formData.level,
        duration: formData.duration || '30 min',
        progress: Number(formData.progress) || 0,
      })
    }

    if (activeType === 'study') {
      addStudyItem({
        title: formData.title,
        category: formData.category,
        lesson: formData.notes || 'General study session',
        status: formData.status,
        progress: Number(formData.progress) || 0,
      })
    }

    if (activeType === 'reading') {
      const totalUnits = Number(formData.totalUnits) || 1
      const currentUnit = Math.min(
        totalUnits,
        Math.max(0, Number(formData.currentUnit) || 0)
      )

      addReadingItem({
        title: formData.title,
        type: formData.type,
        status: currentUnit === totalUnits ? 'Completed' : formData.status,
        unitLabel: formData.unitLabel,
        totalUnits,
        currentUnit,
        chapter: `${formData.unitLabel} ${currentUnit}`,
        posterUrl: formData.posterUrl,
        notes: formData.notes,
      })
    }

    if (activeType === 'watch') {
      const episodes = Number(formData.episodes) || 1
      const watchedEpisodes = Math.min(
        episodes,
        Math.max(0, Number(formData.watchedEpisodes) || 0)
      )

      addWatchItem({
        title: formData.title,
        type: formData.type,
        status: watchedEpisodes === episodes ? 'Completed' : formData.status,
        episodes,
        watchedEpisodes,
        posterUrl: formData.posterUrl,
        notes: formData.notes,
      })
    }

    resetForm()
    onClose()
  }

  return (
    <div className="quick-add-overlay" role="presentation">
      <div className="quick-add-modal glass-card" role="dialog" aria-modal="true">
        <div className="quick-add-header">
          <div>
            <p className="page-kicker">Universal Quick Add</p>
            <h2>Add anything to your Life Matrix</h2>
            <p>
              Create a goal, workout, study path, reading item, or watchlist
              item from any page.
            </p>
          </div>

          <button type="button" className="quick-add-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="quick-add-body">
          <aside className="quick-add-type-list">
            {quickTypes.map((item) => {
              const Icon = item.icon

              return (
                <button
                  type="button"
                  key={item.id}
                  className={
                    activeType === item.id
                      ? 'quick-add-type-btn active'
                      : 'quick-add-type-btn'
                  }
                  onClick={() => setActiveType(item.id)}
                >
                  <span>
                    <Icon size={19} />
                  </span>

                  <div>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </div>
                </button>
              )
            })}
          </aside>

          <form className="quick-add-form" onSubmit={handleSubmit}>
            <div className="quick-add-form-title">
              <div className="quick-add-form-icon">
                <ActiveIcon size={22} />
              </div>

              <div>
                <h3>{quickTypes.find((item) => item.id === activeType)?.label}</h3>
                <p>Fill the important fields only. You can edit deeper later.</p>
              </div>
            </div>

            <div className="quick-add-grid">
              <label className="wide-field">
                Title
                <input
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </label>

              {(activeType === 'goal' || activeType === 'study') && (
                <label>
                  Category
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option>Project</option>
                    <option>Learning</option>
                    <option>Fitness</option>
                    <option>Growth</option>
                    <option>Money</option>
                    <option>Personal</option>
                    <option>Web Development</option>
                    <option>Python Backend</option>
                    <option>Mobile Apps</option>
                    <option>Database</option>
                    <option>Cybersecurity</option>
                    <option>AI / Machine Learning</option>
                  </select>
                </label>
              )}

              {activeType === 'goal' && (
                <>
                  <label>
                    Priority
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
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
                </>
              )}

              {activeType === 'workout' && (
                <>
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
                </>
              )}

              {(activeType === 'study' ||
                activeType === 'reading' ||
                activeType === 'watch') && (
                <label>
                  Status
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option>Active</option>
                    <option>In Progress</option>
                    <option>Reading</option>
                    <option>Watching</option>
                    <option>Paused</option>
                    <option>Completed</option>
                    <option>Plan to Read</option>
                    <option>Plan to Watch</option>
                  </select>
                </label>
              )}

              {(activeType === 'reading' || activeType === 'watch') && (
                <label>
                  Type
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option>Anime</option>
                    <option>Movie</option>
                    <option>Series</option>
                    <option>Manhwa</option>
                    <option>Manga</option>
                    <option>Manhua</option>
                    <option>Webtoon</option>
                    <option>Light Novel</option>
                    <option>Book</option>
                  </select>
                </label>
              )}

              {activeType === 'reading' && (
                <>
                  <label>
                    Unit Label
                    <select
                      name="unitLabel"
                      value={formData.unitLabel}
                      onChange={handleChange}
                    >
                      <option>Chapter</option>
                      <option>Page</option>
                      <option>Episode</option>
                      <option>Volume</option>
                    </select>
                  </label>

                  <label>
                    Total Units
                    <input
                      type="number"
                      name="totalUnits"
                      min="1"
                      value={formData.totalUnits}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    Current Unit
                    <input
                      type="number"
                      name="currentUnit"
                      min="0"
                      value={formData.currentUnit}
                      onChange={handleChange}
                    />
                  </label>
                </>
              )}

              {activeType === 'watch' && (
                <>
                  <label>
                    Episodes
                    <input
                      type="number"
                      name="episodes"
                      min="1"
                      value={formData.episodes}
                      onChange={handleChange}
                    />
                  </label>

                  <label>
                    Watched
                    <input
                      type="number"
                      name="watchedEpisodes"
                      min="0"
                      value={formData.watchedEpisodes}
                      onChange={handleChange}
                    />
                  </label>
                </>
              )}

              {activeType !== 'reading' && activeType !== 'watch' && (
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
              )}

              {(activeType === 'reading' || activeType === 'watch') && (
                <label className="wide-field">
                  Poster URL
                  <input
                    type="text"
                    name="posterUrl"
                    placeholder="Paste image URL"
                    value={formData.posterUrl}
                    onChange={handleChange}
                  />
                </label>
              )}

              {(activeType === 'study' ||
                activeType === 'reading' ||
                activeType === 'watch') && (
                <label className="wide-field">
                  Notes
                  <input
                    type="text"
                    name="notes"
                    placeholder="Extra notes"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </label>
              )}
            </div>

            <div className="quick-add-actions">
              <button type="button" className="btn-soft-life" onClick={onClose}>
                Cancel
              </button>

              <button type="submit" className="btn-life">
                <Plus size={18} />
                Add to Matrix
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default QuickAddModal
