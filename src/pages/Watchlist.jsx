import { useMemo, useState } from 'react'

import {
  Clock,
  Film,
  Flame,
  ImagePlus,
  PlayCircle,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Trash2,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext'

function Watchlist() {
  const {
    lifeData,
    addWatchItem,
    updateWatchEpisodes,
    deleteWatchItem,
  } = useLifeData()

  const [formData, setFormData] = useState({
    title: '',
    type: 'Anime',
    status: 'Watching',
    totalEpisodes: 12,
    watchedEpisodes: 0,
    posterUrl: '',
    notes: '',
  })

  const [filters, setFilters] = useState({
    search: '',
    type: 'All',
    status: 'All',
    sort: 'Newest first',
  })

  const averageProgress = lifeData.watchlist.length
    ? Math.round(
        lifeData.watchlist.reduce((sum, item) => sum + (item.progress || 0), 0) /
          lifeData.watchlist.length
      )
    : 0

  const watchStats = [
    {
      icon: Film,
      title: 'Watch Items',
      value: lifeData.watchlist.length,
      label: 'Saved titles',
    },
    {
      icon: Clock,
      title: 'Average Progress',
      value: `${averageProgress}%`,
      label: 'Across watchlist',
    },
    {
      icon: Flame,
      title: 'Active Shows',
      value: lifeData.watchlist.filter((item) => item.status !== 'Completed').length,
      label: 'Still watching',
    },
    {
      icon: Star,
      title: 'Near Complete',
      value: lifeData.watchlist.filter((item) => item.progress >= 80).length,
      label: 'Above 80%',
    },
  ]

  const filteredWatchlist = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase()

    const filtered = lifeData.watchlist.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm)
      const matchesType = filters.type === 'All' || item.type === filters.type
      const matchesStatus = filters.status === 'All' || item.status === filters.status

      return matchesSearch && matchesType && matchesStatus
    })

    if (filters.sort === 'Highest progress') {
      return [...filtered].sort((a, b) => (b.progress || 0) - (a.progress || 0))
    }

    if (filters.sort === 'Lowest progress') {
      return [...filtered].sort((a, b) => (a.progress || 0) - (b.progress || 0))
    }

    if (filters.sort === 'A-Z') {
      return [...filtered].sort((a, b) => a.title.localeCompare(b.title))
    }

    return filtered
  }, [lifeData.watchlist, filters])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFilterChange = (event) => {
    const { name, value } = event.target

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePosterUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        posterUrl: reader.result,
      }))
    }

    reader.readAsDataURL(file)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      alert('Please enter a watch title')
      return
    }

    const totalEpisodes = Number(formData.totalEpisodes) || 1
    const watchedEpisodes = Math.min(
      totalEpisodes,
      Math.max(0, Number(formData.watchedEpisodes) || 0)
    )

    addWatchItem({
      title: formData.title,
      type: formData.type,
      status: watchedEpisodes === totalEpisodes ? 'Completed' : formData.status,
      totalEpisodes,
      watchedEpisodes,
      posterUrl: formData.posterUrl,
      notes: formData.notes,
    })

    setFormData({
      title: '',
      type: 'Anime',
      status: 'Watching',
      totalEpisodes: 12,
      watchedEpisodes: 0,
      posterUrl: '',
      notes: '',
    })
  }

  const createEpisodeOptions = (totalEpisodes) => {
    const total = Math.min(Number(totalEpisodes) || 1, 2500)

    return Array.from({ length: total + 1 }, (_, index) => (
      <option key={index} value={index}>
        {index} watched
      </option>
    ))
  }

  return (
    <section className="page-shell watchlist-page premium-watchlist-page">
      <div className="watchlist-hero glass-card premium-watch-hero">
        <div className="premium-watch-hero-copy">
          <p className="page-kicker">Watch Matrix</p>
          <h1>Track anime, movies, dramas, series, and learning videos.</h1>
          <p>
            Add total episodes, choose watched episodes from a clean dropdown,
            upload a poster, and Life Matrix calculates your progress automatically.
          </p>

          <a href="#add-watch-form" className="btn-life watchlist-main-btn">
            <Plus size={18} />
            Add Watch Item
          </a>
        </div>

        <div className="premium-watch-hero-card">
          <PlayCircle size={34} />
          <span>Saved Titles</span>
          <strong>{lifeData.watchlist.length}</strong>
          <p>{averageProgress}% average progress</p>
        </div>
      </div>

      <div className="watch-stat-grid premium-watch-stats section-gap">
        {watchStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="watch-stat-card" key={stat.title}>
              <div className="watch-stat-icon">
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
        id="add-watch-form"
        className="premium-watch-form-card glass-card section-gap"
      >
        <div className="premium-form-heading">
          <div>
            <p className="page-kicker">Create Watch Item</p>
            <h2>Enter watch details</h2>
            <span>
              The form is split into clean sections so it does not feel cramped.
            </span>
          </div>

          <div className="premium-form-badge">Auto percentage</div>
        </div>

        <form className="premium-watch-form" onSubmit={handleSubmit}>
          <div className="watch-form-section main-details-section">
            <div className="watch-form-section-title">
              <span>01</span>
              <div>
                <h3>Main details</h3>
                <p>Title, type, status, and episode progress.</p>
              </div>
            </div>

            <div className="premium-field-grid two-columns">
              <label className="premium-field field-wide">
                <span>Title</span>
                <input
                  type="text"
                  name="title"
                  placeholder="Example: One Piece"
                  value={formData.title}
                  onChange={handleChange}
                />
              </label>

              <label className="premium-field">
                <span>Type</span>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option>Anime</option>
                  <option>Movie</option>
                  <option>Drama</option>
                  <option>Series</option>
                  <option>YouTube</option>
                  <option>Course Video</option>
                </select>
              </label>

              <label className="premium-field">
                <span>Status</span>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option>Watching</option>
                  <option>Active</option>
                  <option>Learning</option>
                  <option>Paused</option>
                  <option>Completed</option>
                </select>
              </label>

              <label className="premium-field">
                <span>Total Episodes</span>
                <input
                  type="number"
                  name="totalEpisodes"
                  min="1"
                  value={formData.totalEpisodes}
                  onChange={handleChange}
                />
              </label>

              <label className="premium-field">
                <span>Watched Episodes</span>
                <select
                  name="watchedEpisodes"
                  value={formData.watchedEpisodes}
                  onChange={handleChange}
                >
                  {createEpisodeOptions(formData.totalEpisodes)}
                </select>
              </label>
            </div>
          </div>

          <div className="watch-form-section poster-details-section">
            <div className="watch-form-section-title">
              <span>02</span>
              <div>
                <h3>Poster and notes</h3>
                <p>Add cover art using a URL or upload from your device.</p>
              </div>
            </div>

            <div className="poster-editor-grid">
              <div className="poster-inputs">
                <label className="premium-field">
                  <span>Poster URL</span>
                  <input
                    type="text"
                    name="posterUrl"
                    placeholder="Paste image URL or upload below"
                    value={formData.posterUrl}
                    onChange={handleChange}
                  />
                </label>

                <label className="premium-file-field">
                  <span>Upload Poster</span>
                  <input type="file" accept="image/*" onChange={handlePosterUpload} />
                </label>

                <label className="premium-field">
                  <span>Notes</span>
                  <textarea
                    name="notes"
                    placeholder="Example: continue from Wano arc"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                  ></textarea>
                </label>
              </div>

              <div className="poster-live-preview">
                {formData.posterUrl ? (
                  <img src={formData.posterUrl} alt="Poster preview" />
                ) : (
                  <div>
                    <ImagePlus size={38} />
                    <strong>Poster Preview</strong>
                    <span>Your uploaded image will appear here.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="premium-form-actions">
            <button className="btn-life" type="submit">
              <Plus size={18} />
              Save Watch Item
            </button>
          </div>
        </form>
      </article>

      <article className="premium-watch-filter-card glass-card section-gap">
        <div className="premium-filter-search">
          <Search size={18} />
          <input
            type="text"
            name="search"
            placeholder="Search watchlist..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="premium-filter-controls">
          <div className="filter-label">
            <SlidersHorizontal size={17} />
            <span>Filters</span>
          </div>

          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option>All</option>
            <option>Anime</option>
            <option>Movie</option>
            <option>Drama</option>
            <option>Series</option>
            <option>YouTube</option>
            <option>Course Video</option>
          </select>

          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option>All</option>
            <option>Watching</option>
            <option>Active</option>
            <option>Learning</option>
            <option>Paused</option>
            <option>Completed</option>
          </select>

          <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option>Newest first</option>
            <option>Highest progress</option>
            <option>Lowest progress</option>
            <option>A-Z</option>
          </select>
        </div>
      </article>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Continue Watching</p>
          <h2>Saved Watchlist</h2>
        </div>
      </div>

      <div className="premium-watch-grid">
        {filteredWatchlist.map((item) => {
          const totalEpisodes = Number(item.totalEpisodes) || 1
          const watchedEpisodes = Number(item.watchedEpisodes) || 0
          const progress = item.progress || 0

          return (
            <article className="premium-watch-card" key={item.id}>
              <div className="premium-watch-poster">
                {item.posterUrl ? (
                  <img src={item.posterUrl} alt={item.title} />
                ) : (
                  <div className="premium-poster-placeholder">
                    <Film size={34} />
                    <span>No Poster</span>
                  </div>
                )}
              </div>

              <div className="premium-watch-content">
                <div className="premium-watch-topline">
                  <span>{item.type}</span>
                  <strong>{item.status}</strong>
                </div>

                <h3>{item.title}</h3>

                <p className="premium-watch-episode">
                  {watchedEpisodes} / {totalEpisodes} episodes watched
                </p>

                <div className="habit-progress-info">
                  <span>Progress</span>
                  <strong>{progress}%</strong>
                </div>

                <div className="habit-progress-bar">
                  <div
                    className="habit-progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <label className="premium-card-select">
                  <span>Update watched episodes</span>
                  <select
                    value={watchedEpisodes}
                    onChange={(event) =>
                      updateWatchEpisodes(item.id, event.target.value)
                    }
                  >
                    {createEpisodeOptions(totalEpisodes)}
                  </select>
                </label>

                {item.notes && <p className="premium-watch-notes">{item.notes}</p>}

                <button
                  type="button"
                  className="premium-delete-btn"
                  onClick={() => deleteWatchItem(item.id)}
                >
                  <Trash2 size={17} />
                  Delete
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Watchlist
