import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, FolderKanban, Plus, Rocket, Target, Trash2, TrendingUp } from 'lucide-react'

const defaultProjects = [
  { id: 'project-1', title: 'Life Matrix', category: 'React', status: 'Active', progress: 75, goal: 'Build a complete personal productivity operating system.' },
  { id: 'project-2', title: 'ManhwaMatrix Android', category: 'Mobile', status: 'Planning', progress: 20, goal: 'Convert ManhwaMatrix into a mobile app.' },
]

function Projects() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('life_matrix_projects')
      return saved ? JSON.parse(saved) : defaultProjects
    } catch {
      return defaultProjects
    }
  })

  const [filter, setFilter] = useState('All')
  const [formData, setFormData] = useState({
    title: '',
    category: 'React',
    status: 'Active',
    progress: 0,
    goal: '',
  })

  useEffect(() => {
    localStorage.setItem('life_matrix_projects', JSON.stringify(projects))
  }, [projects])

  const filteredProjects = useMemo(() => {
    if (filter === 'All') return projects
    return projects.filter((project) => project.status === filter || project.category === filter)
  }, [filter, projects])

  const averageProgress = projects.length
    ? Math.round(projects.reduce((sum, item) => sum + Number(item.progress || 0), 0) / projects.length)
    : 0

  const completed = projects.filter((item) => Number(item.progress) >= 100 || item.status === 'Completed').length

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addProject = (event) => {
    event.preventDefault()

    if (!formData.title.trim() || !formData.goal.trim()) {
      alert('Please enter a project title and goal')
      return
    }

    setProjects((prev) => [
      { id: String(Date.now()), ...formData, progress: Number(formData.progress) },
      ...prev,
    ])

    setFormData({ title: '', category: 'React', status: 'Active', progress: 0, goal: '' })
  }

  const updateProgress = (id, amount) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, progress: Math.min(100, Math.max(0, Number(project.progress) + amount)) }
          : project
      )
    )
  }

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <section className="page-shell projects-page premium-projects-page">
      <div className="projects-command-hero glass-card">
        <div>
          <p className="page-kicker">Project Matrix</p>
          <h1>Manage your apps, builds, and long-term systems.</h1>
          <p>
            Track your major projects like Life Matrix, ManhwaMatrix, PrimeCore,
            Android apps, backend systems, and future SaaS ideas.
          </p>

          <div className="projects-hero-actions">
            <a href="#add-project-form" className="btn-life"><Plus size={18} /> Add Project</a>
          </div>
        </div>

        <div className="projects-rank-card">
          <Rocket size={42} />
          <span>Average Progress</span>
          <strong>{averageProgress}%</strong>
          <p>{completed} completed projects</p>
        </div>
      </div>

      <div className="page-action-grid section-gap">
        <article className="system-metric-card"><div className="system-metric-icon"><FolderKanban size={22} /></div><p>Projects</p><h3>{projects.length}</h3><span>Total builds</span></article>
        <article className="system-metric-card"><div className="system-metric-icon"><TrendingUp size={22} /></div><p>Average</p><h3>{averageProgress}%</h3><span>Progress</span></article>
        <article className="system-metric-card"><div className="system-metric-icon"><CheckCircle2 size={22} /></div><p>Completed</p><h3>{completed}</h3><span>Finished</span></article>
        <article className="system-metric-card"><div className="system-metric-icon"><Target size={22} /></div><p>Active</p><h3>{projects.filter((p) => p.status === 'Active').length}</h3><span>In progress</span></article>
      </div>

      <article id="add-project-form" className="system-console-form glass-card section-gap">
        <div className="premium-form-header">
          <div><p className="page-kicker">Create Project</p><h2>Add a build to your board</h2><p>Track important projects from idea to launch.</p></div>
          <span>Saved locally</span>
        </div>

        <form className="projects-form-grid" onSubmit={addProject}>
          <label>Project Title<input name="title" value={formData.title} onChange={handleChange} placeholder="Example: SAKURA AI" /></label>
          <label>Category<select name="category" value={formData.category} onChange={handleChange}><option>React</option><option>Flask</option><option>Mobile</option><option>AI</option><option>Business</option><option>School</option></select></label>
          <label>Status<select name="status" value={formData.status} onChange={handleChange}><option>Planning</option><option>Active</option><option>Testing</option><option>Completed</option><option>Paused</option></select></label>
          <label>Progress %<input type="number" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange} /></label>
          <label className="projects-wide-field">Project Goal<textarea name="goal" rows="5" value={formData.goal} onChange={handleChange} placeholder="What is this project supposed to achieve?"></textarea></label>
          <button className="btn-life" type="submit"><Plus size={18} /> Save Project</button>
        </form>
      </article>

      <div className="system-toolbar section-gap">
        {['All', 'Planning', 'Active', 'Testing', 'Completed', 'Paused', 'React', 'Flask', 'Mobile', 'AI'].map((item) => (
          <button type="button" key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>

      <div className="section-heading section-gap"><div><p className="page-kicker">Project Board</p><h2>{filteredProjects.length} projects</h2></div></div>

      <div className="system-card-grid">
        {filteredProjects.map((project) => (
          <article className="system-card" key={project.id}>
            <div className="system-card-top">
              <div><p>{project.category}</p><h3>{project.title}</h3></div>
              <span className="system-pill">{project.status}</span>
            </div>
            <p className="system-card-body">{project.goal}</p>
            <div className="habit-progress-info"><span>Progress</span><strong>{project.progress}%</strong></div>
            <div className="habit-progress-bar"><div className="habit-progress-fill" style={{ width: `${project.progress}%` }}></div></div>
            <div className="system-card-actions">
              <button className="btn-soft-life" type="button" onClick={() => updateProgress(project.id, -10)}>-10%</button>
              <button className="btn-life" type="button" onClick={() => updateProgress(project.id, 10)}>+10%</button>
              <button className="system-delete-btn" type="button" onClick={() => deleteProject(project.id)}><Trash2 size={16} /> Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Projects
