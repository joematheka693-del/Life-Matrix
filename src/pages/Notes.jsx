import { useEffect, useMemo, useState } from 'react'

import {
  BookOpenText,
  CalendarClock,
  FileText,
  NotebookPen,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
} from 'lucide-react'

const defaultNotes = [
  {
    id: 'note-demo-1',
    title: 'Life Matrix ideas',
    category: 'Project',
    mood: 'Focused',
    content: 'Improve the dashboard, add reminders, and later connect backend sync.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'note-demo-2',
    title: 'Study reflection',
    category: 'Learning',
    mood: 'Motivated',
    content: 'Review React state, context, routes, and component structure.',
    createdAt: new Date().toISOString(),
  },
]

function Notes() {
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem('life_matrix_notes')
      return saved ? JSON.parse(saved) : defaultNotes
    } catch {
      return defaultNotes
    }
  })

  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const [formData, setFormData] = useState({
    title: '',
    category: 'Project',
    mood: 'Focused',
    content: '',
  })

  useEffect(() => {
    localStorage.setItem('life_matrix_notes', JSON.stringify(notes))
  }, [notes])

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase()

    return notes.filter((note) => {
      const matchesCategory =
        categoryFilter === 'All' || note.category === categoryFilter

      const matchesQuery =
        !q ||
        note.title.toLowerCase().includes(q) ||
        note.category.toLowerCase().includes(q) ||
        note.mood.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q)

      return matchesCategory && matchesQuery
    })
  }, [categoryFilter, notes, query])

  const totalWords = notes.reduce((sum, note) => {
    return sum + note.content.trim().split(/\s+/).filter(Boolean).length
  }, 0)

  const categories = ['All', ...new Set(notes.map((note) => note.category))]

  const noteStats = [
    {
      icon: NotebookPen,
      title: 'Total Notes',
      value: notes.length,
      label: 'Saved entries',
    },
    {
      icon: FileText,
      title: 'Words',
      value: totalWords,
      label: 'Written total',
    },
    {
      icon: Tag,
      title: 'Categories',
      value: Math.max(0, categories.length - 1),
      label: 'Note groups',
    },
    {
      icon: Sparkles,
      title: 'Latest Mood',
      value: notes[0]?.mood || 'None',
      label: 'Current state',
    },
  ]

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const addNote = (event) => {
    event.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please enter a title and note content')
      return
    }

    setNotes((prev) => [
      {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])

    setFormData({
      title: '',
      category: 'Project',
      mood: 'Focused',
      content: '',
    })
  }

  const deleteNote = (noteId) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  return (
    <section className="page-shell notes-page premium-notes-page">
      <div className="notes-command-hero glass-card">
        <div>
          <p className="page-kicker">Notes Vault</p>
          <h1>Capture thoughts, project ideas, and daily reflections.</h1>
          <p>
            Use this vault for coding notes, study reflections, personal journal
            entries, project planning, and ideas you do not want to lose.
          </p>

          <div className="notes-hero-actions">
            <a href="#add-note-form" className="btn-life">
              <Plus size={18} />
              Add Note
            </a>

            <button
              type="button"
              className="btn-soft-life"
              onClick={() => setCategoryFilter('All')}
            >
              <BookOpenText size={17} />
              View All
            </button>
          </div>
        </div>

        <div className="notes-rank-card">
          <NotebookPen size={40} />
          <span>Vault Size</span>
          <strong>{notes.length}</strong>
          <p>{totalWords} words stored locally</p>
        </div>
      </div>

      <div className="notes-stat-grid section-gap">
        {noteStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="notes-metric-card" key={stat.title}>
              <div className="notes-metric-icon">
                <Icon size={22} />
              </div>

              <p>{stat.title}</p>
              <h3>{stat.value}</h3>
              <span>{stat.label}</span>
            </article>
          )
        })}
      </div>

      <article id="add-note-form" className="notes-console-form glass-card section-gap">
        <div className="premium-form-header">
          <div>
            <p className="page-kicker">Create Note</p>
            <h2>Add a journal entry</h2>
            <p>Store useful thoughts and reflections inside localStorage.</p>
          </div>

          <span>Saved locally</span>
        </div>

        <form className="notes-premium-form-grid" onSubmit={addNote}>
          <label>
            Note Title
            <input
              type="text"
              name="title"
              placeholder="Example: React routing lesson"
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Category
            <select name="category" value={formData.category} onChange={handleChange}>
              <option>Project</option>
              <option>Learning</option>
              <option>Reflection</option>
              <option>Idea</option>
              <option>Fitness</option>
              <option>Money</option>
              <option>Personal</option>
            </select>
          </label>

          <label>
            Mood
            <select name="mood" value={formData.mood} onChange={handleChange}>
              <option>Focused</option>
              <option>Motivated</option>
              <option>Calm</option>
              <option>Confused</option>
              <option>Tired</option>
              <option>Inspired</option>
            </select>
          </label>

          <label className="notes-wide-field">
            Content
            <textarea
              name="content"
              placeholder="Write your note..."
              value={formData.content}
              onChange={handleChange}
              rows="6"
            ></textarea>
          </label>

          <button type="submit" className="btn-life">
            <Plus size={18} />
            Save Note
          </button>
        </form>
      </article>

      <div className="notes-toolbar section-gap">
        <div className="notes-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="notes-filter-row">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={categoryFilter === category ? 'active' : ''}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Saved Notes</p>
          <h2>{filteredNotes.length} entries found</h2>
        </div>
      </div>

      <div className="notes-grid-premium">
        {filteredNotes.map((note) => (
          <article className="note-card-premium" key={note.id}>
            <div className="note-card-top">
              <div>
                <p>{note.category}</p>
                <h3>{note.title}</h3>
              </div>

              <span>{note.mood}</span>
            </div>

            <p className="note-card-content">{note.content}</p>

            <div className="note-card-footer">
              <span>
                <CalendarClock size={15} />
                {new Date(note.createdAt).toLocaleDateString()}
              </span>

              <button type="button" onClick={() => deleteNote(note.id)}>
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Notes
