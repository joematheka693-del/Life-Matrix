import { useMemo, useState } from 'react'

import {
  BookOpen,
  Bookmark,
  Filter,
  ImagePlus,
  Library,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext'

function Reading() {
  const {
    lifeData,
    addReadingItem,
    updateReadingUnits,
    deleteReadingItem,
  } = useLifeData()

  const [formData, setFormData] = useState({
    title: '',
    type: 'Manhwa',
    status: 'Reading',
    unitLabel: 'Chapter',
    totalUnits: 100,
    currentUnit: 0,
    posterUrl: '',
    notes: '',
  })

  const [filters, setFilters] = useState({
    search: '',
    type: 'All',
    status: 'All',
    sort: 'Newest first',
  })

  const readingList = lifeData.reading || []

  const averageProgress = readingList.length
    ? Math.round(
        readingList.reduce((sum, item) => sum + (Number(item.progress) || 0), 0) /
          readingList.length
      )
    : 0

  const readingStats = [
    {
      icon: Library,
      title: 'Library Items',
      value: readingList.length,
      label: 'Saved titles',
    },
    {
      icon: Bookmark,
      title: 'Average Progress',
      value: `${averageProgress}%`,
      label: 'Across library',
    },
    {
      icon: Sparkles,
      title: 'Active Reads',
      value: readingList.filter((item) => item.status !== 'Completed').length,
      label: 'Still reading',
    },
    {
      icon: Star,
      title: 'Near Complete',
      value: readingList.filter((item) => Number(item.progress) >= 80).length,
      label: 'Above 80%',
    },
  ]

  const filteredReading = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase()

    const result = readingList.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.title?.toLowerCase().includes(searchTerm) ||
        item.type?.toLowerCase().includes(searchTerm)

      const matchesType = filters.type === 'All' || item.type === filters.type
      const matchesStatus =
        filters.status === 'All' || item.status === filters.status

      return matchesSearch && matchesType && matchesStatus
    })

    if (filters.sort === 'Highest progress') {
      return [...result].sort((a, b) => (b.progress || 0) - (a.progress || 0))
    }

    if (filters.sort === 'Lowest progress') {
      return [...result].sort((a, b) => (a.progress || 0) - (b.progress || 0))
    }

    if (filters.sort === 'A-Z') {
      return [...result].sort((a, b) => a.title.localeCompare(b.title))
    }

    return result
  }, [readingList, filters])

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

  const removeCover = () => {
    setFormData((prev) => ({
      ...prev,
      posterUrl: '',
    }))
  }

  const createUnitOptions = (totalUnits) => {
    const total = Math.max(1, Number(totalUnits) || 1)

    return Array.from({ length: total + 1 }, (_, index) => (
      <option key={index} value={index}>
        {index} read
      </option>
    ))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      alert('Please enter a reading title')
      return
    }

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

    setFormData({
      title: '',
      type: 'Manhwa',
      status: 'Reading',
      unitLabel: 'Chapter',
      totalUnits: 100,
      currentUnit: 0,
      posterUrl: '',
      notes: '',
    })
  }

  return (
    <section className="page-shell reading-page premium-reading-page">
      <div className="reading-hero premium-reading-hero glass-card">
        <div>
          <p className="page-kicker">Reading Matrix</p>
          <h1>Track manhwa, manga, novels, books, and webtoons.</h1>
          <p>
            Add total chapters, choose your current chapter from a dropdown,
            upload a cover, and let Life Matrix calculate your reading progress.
          </p>

          <a href="#add-reading-form" className="btn-life reading-main-btn">
            <Plus size={18} />
            Add Reading Item
          </a>
        </div>

        <div className="reading-hero-card premium-reading-hero-card">
          <BookOpen size={34} />
          <span>Saved Titles</span>
          <strong>{readingList.length}</strong>
          <p>{averageProgress}% average progress</p>
        </div>
      </div>

      <div className="reading-stat-grid section-gap">
        {readingStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="reading-stat-card" key={stat.title}>
              <div className="reading-stat-icon">
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
        id="add-reading-form"
        className="premium-reading-form-card glass-card section-gap"
      >
        <div className="premium-form-header">
          <div>
            <p className="page-kicker">Create Reading Item</p>
            <h2>Add manhwa, manga, novel, or book</h2>
            <p>
              Add title details, progress data, and a clean cover image for your
              reading library.
            </p>
          </div>

          <span>Auto percentage</span>
        </div>

        <form className="premium-reading-form" onSubmit={handleSubmit}>
          <div className="reading-form-section">
            <div className="reading-section-title">
              <span>01</span>
              <div>
                <h3>Title details</h3>
                <p>Name, type, status, and tracking mode.</p>
              </div>
            </div>

            <div className="premium-reading-grid">
              <label>
                Title
                <input
                  type="text"
                  name="title"
                  placeholder="Example: Solo Leveling"
                  value={formData.title}
                  onChange={handleChange}
                />
              </label>

              <label>
                Type
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option>Manhwa</option>
                  <option>Manga</option>
                  <option>Manhua</option>
                  <option>Webtoon</option>
                  <option>Light Novel</option>
                  <option>Book</option>
                  <option>Comic</option>
                </select>
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option>Reading</option>
                  <option>Active</option>
                  <option>Paused</option>
                  <option>Completed</option>
                  <option>Plan to Read</option>
                </select>
              </label>

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
            </div>
          </div>

          <div className="reading-form-section">
            <div className="reading-section-title">
              <span>02</span>
              <div>
                <h3>Progress details</h3>
                <p>Works for long manhwa with hundreds or thousands of chapters.</p>
              </div>
            </div>

            <div className="premium-reading-grid compact">
              <label>
                Total {formData.unitLabel}s
                <input
                  type="number"
                  name="totalUnits"
                  min="1"
                  value={formData.totalUnits}
                  onChange={handleChange}
                />
              </label>

              <label>
                Current {formData.unitLabel}
                <select
                  name="currentUnit"
                  value={formData.currentUnit}
                  onChange={handleChange}
                >
                  {createUnitOptions(formData.totalUnits)}
                </select>
              </label>

              <label className="wide-field">
                Notes
                <input
                  type="text"
                  name="notes"
                  placeholder="Example: Re-read later, best arc, stopped at fight scene..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </label>
            </div>
          </div>

          <div className="reading-form-section">
            <div className="reading-section-title">
              <span>03</span>
              <div>
                <h3>Cover upload</h3>
                <p>Paste a cover URL or upload an image from your computer.</p>
              </div>
            </div>

            <div className="reading-cover-upload-panel">
              <div className="reading-cover-preview">
                {formData.posterUrl ? (
                  <img src={formData.posterUrl} alt="Cover preview" />
                ) : (
                  <div className="reading-cover-placeholder">
                    <ImagePlus size={38} />
                    <strong>No Cover Yet</strong>
                    <p>Use a vertical manhwa, manga, novel, or book cover.</p>
                  </div>
                )}
              </div>

              <div className="reading-cover-controls">
                <label>
                  Cover Image URL
                  <input
                    type="text"
                    name="posterUrl"
                    placeholder="Paste image URL"
                    value={formData.posterUrl}
                    onChange={handleChange}
                  />
                </label>

                <div className="reading-upload-actions">
                  <label className="reading-upload-btn">
                    <ImagePlus size={18} />
                    Upload Cover
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterUpload}
                    />
                  </label>

                  {formData.posterUrl && (
                    <button
                      type="button"
                      className="reading-remove-cover-btn"
                      onClick={removeCover}
                    >
                      <X size={17} />
                      Remove Cover
                    </button>
                  )}
                </div>

                <div className="reading-cover-tips">
                  <span>Best ratio</span>
                  <strong>Vertical cover / poster format</strong>
                  <p>
                    Avoid wide banners. Use images similar to manhwa or manga
                    covers for a cleaner library card.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="premium-form-actions">
            <button className="btn-life" type="submit">
              <Plus size={18} />
              Save Reading Item
            </button>
          </div>
        </form>
      </article>

      <div className="premium-reading-toolbar section-gap">
        <div className="premium-search-box">
          <Search size={18} />
          <input
            type="text"
            name="search"
            placeholder="Search reading library..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        <div className="premium-filter-group">
          <Filter size={17} />

          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option>All</option>
            <option>Manhwa</option>
            <option>Manga</option>
            <option>Manhua</option>
            <option>Webtoon</option>
            <option>Light Novel</option>
            <option>Book</option>
            <option>Comic</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option>All</option>
            <option>Reading</option>
            <option>Active</option>
            <option>Paused</option>
            <option>Completed</option>
            <option>Plan to Read</option>
          </select>

          <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option>Newest first</option>
            <option>Highest progress</option>
            <option>Lowest progress</option>
            <option>A-Z</option>
          </select>
        </div>
      </div>

      <div className="premium-reading-grid-list">
        {filteredReading.map((item) => {
          const totalUnits = Number(item.totalUnits) || 1
          const currentUnit = Number(item.currentUnit) || 0
          const progress = Number(item.progress) || 0
          const unitLabel = item.unitLabel || 'Chapter'

          return (
            <article className="premium-reading-card" key={item.id}>
              <div className="premium-reading-cover">
                {item.posterUrl ? (
                  <img src={item.posterUrl} alt={item.title} />
                ) : (
                  <div>
                    <BookOpen size={34} />
                    <span>No Cover</span>
                  </div>
                )}

                <span className="reading-type-pill">{item.type}</span>
              </div>

              <div className="premium-reading-card-body">
                <div className="premium-reading-card-top">
                  <div>
                    <p>{item.status}</p>
                    <h3>{item.title}</h3>
                  </div>

                  <strong>{progress}%</strong>
                </div>

                <p className="premium-reading-progress-text">
                  {currentUnit} / {totalUnits} {unitLabel.toLowerCase()}s read
                </p>

                {item.notes && (
                  <p className="premium-reading-notes">{item.notes}</p>
                )}

                <div className="habit-progress-bar">
                  <div
                    className="habit-progress-fill"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <label className="premium-unit-control">
                  Current {unitLabel}
                  <select
                    value={currentUnit}
                    onChange={(event) =>
                      updateReadingUnits(item.id, event.target.value)
                    }
                  >
                    {createUnitOptions(totalUnits)}
                  </select>
                </label>

                <button
                  type="button"
                  className="premium-delete-btn"
                  onClick={() => deleteReadingItem(item.id)}
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

export default Reading