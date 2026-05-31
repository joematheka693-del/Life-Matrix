import { useEffect, useMemo, useState } from 'react'
import { Archive, ExternalLink, Link as LinkIcon, Plus, Search, Star, Trash2 } from 'lucide-react'

const defaultResources = [
  { id: 'res-1', title: 'React Docs', type: 'Documentation', topic: 'React', url: 'https://react.dev', notes: 'Official React documentation.' },
  { id: 'res-2', title: 'Flask Docs', type: 'Documentation', topic: 'Backend', url: 'https://flask.palletsprojects.com', notes: 'Useful for Flask backend work.' },
]

function Resources() {
  const [resources, setResources] = useState(() => {
    try {
      const saved = localStorage.getItem('life_matrix_resources')
      return saved ? JSON.parse(saved) : defaultResources
    } catch {
      return defaultResources
    }
  })

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [formData, setFormData] = useState({ title: '', type: 'Documentation', topic: 'React', url: '', notes: '' })

  useEffect(() => {
    localStorage.setItem('life_matrix_resources', JSON.stringify(resources))
  }, [resources])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return resources.filter((item) => {
      const matchesFilter = filter === 'All' || item.type === filter || item.topic === filter
      const matchesQuery = !q || [item.title, item.type, item.topic, item.notes, item.url].join(' ').toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [filter, query, resources])

  const types = ['All', ...new Set(resources.flatMap((item) => [item.type, item.topic]))]

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addResource = (event) => {
    event.preventDefault()

    if (!formData.title.trim() || !formData.url.trim()) {
      alert('Please enter a title and URL')
      return
    }

    setResources((prev) => [{ id: String(Date.now()), ...formData }, ...prev])
    setFormData({ title: '', type: 'Documentation', topic: 'React', url: '', notes: '' })
  }

  const deleteResource = (id) => {
    setResources((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <section className="page-shell resources-page premium-resources-page">
      <div className="resources-command-hero glass-card">
        <div>
          <p className="page-kicker">Resources Vault</p>
          <h1>Store useful links, docs, courses, and learning materials.</h1>
          <p>
            Build your own resource library for coding, AI, Android, Flask,
            React, business, finance, and future projects.
          </p>

          <div className="resources-hero-actions">
            <a href="#add-resource-form" className="btn-life"><Plus size={18} /> Add Resource</a>
          </div>
        </div>

        <div className="resources-rank-card">
          <Archive size={42} />
          <span>Saved Resources</span>
          <strong>{resources.length}</strong>
          <p>{types.length - 1} topics and types</p>
        </div>
      </div>

      <div className="page-action-grid section-gap">
        <article className="system-metric-card"><div className="system-metric-icon"><Archive size={22} /></div><p>Total</p><h3>{resources.length}</h3><span>Saved items</span></article>
        <article className="system-metric-card"><div className="system-metric-icon"><Star size={22} /></div><p>Topics</p><h3>{types.length - 1}</h3><span>Groups</span></article>
        <article className="system-metric-card"><div className="system-metric-icon"><LinkIcon size={22} /></div><p>Links</p><h3>{resources.filter((r) => r.url).length}</h3><span>Available URLs</span></article>
        <article className="system-metric-card"><div className="system-metric-icon"><Search size={22} /></div><p>Showing</p><h3>{filtered.length}</h3><span>Filtered items</span></article>
      </div>

      <article id="add-resource-form" className="system-console-form glass-card section-gap">
        <div className="premium-form-header">
          <div><p className="page-kicker">Create Resource</p><h2>Add a learning link</h2><p>Save links you will need again.</p></div>
          <span>Saved locally</span>
        </div>

        <form className="resources-form-grid" onSubmit={addResource}>
          <label>Title<input name="title" value={formData.title} onChange={handleChange} placeholder="Example: Vite Docs" /></label>
          <label>Type<select name="type" value={formData.type} onChange={handleChange}><option>Documentation</option><option>Course</option><option>YouTube</option><option>Article</option><option>Tool</option><option>Reference</option></select></label>
          <label>Topic<select name="topic" value={formData.topic} onChange={handleChange}><option>React</option><option>Flask</option><option>Python</option><option>Android</option><option>AI</option><option>Business</option><option>Finance</option></select></label>
          <label className="resources-wide-field">URL<input name="url" value={formData.url} onChange={handleChange} placeholder="https://..." /></label>
          <label className="resources-wide-field">Notes<textarea name="notes" rows="4" value={formData.notes} onChange={handleChange} placeholder="Why is this resource useful?"></textarea></label>
          <button className="btn-life" type="submit"><Plus size={18} /> Save Resource</button>
        </form>
      </article>

      <div className="resources-toolbar section-gap">
        <div className="resources-search-box"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources..." /></div>
        <div className="resources-filter-row">
          {types.map((item) => <button type="button" key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}
        </div>
      </div>

      <div className="section-heading section-gap"><div><p className="page-kicker">Resource Library</p><h2>{filtered.length} resources</h2></div></div>

      <div className="system-card-grid">
        {filtered.map((item) => (
          <article className="system-card" key={item.id}>
            <div className="system-card-top">
              <div><p>{item.topic}</p><h3>{item.title}</h3></div>
              <span className="system-pill">{item.type}</span>
            </div>
            <p className="system-card-body">{item.notes || item.url}</p>
            <div className="system-card-actions">
              <a className="btn-life" href={item.url} target="_blank" rel="noreferrer"><ExternalLink size={17} /> Open</a>
              <button className="system-delete-btn" type="button" onClick={() => deleteResource(item.id)}><Trash2 size={16} /> Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Resources
