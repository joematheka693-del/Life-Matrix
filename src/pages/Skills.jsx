import { useEffect, useState } from 'react'
import { BrainCircuit, CheckCircle2, GraduationCap, Plus, Target, Trash2, Zap } from 'lucide-react'

const defaults = [
  { id: 'skill-1', title: 'React UI Systems', path: 'Frontend', level: 70, note: 'Components, routes, hooks, context, styling.' },
  { id: 'skill-2', title: 'Flask Backend APIs', path: 'Backend', level: 45, note: 'Routes, MySQL, JWT, deployment.' },
]

function Skills() {
  const [skills, setSkills] = useState(() => {
    try { return JSON.parse(localStorage.getItem('life_matrix_skills')) || defaults } catch { return defaults }
  })
  const [formData, setFormData] = useState({ title: '', path: 'Frontend', level: 0, note: '' })
  useEffect(() => { localStorage.setItem('life_matrix_skills', JSON.stringify(skills)) }, [skills])
  const avg = skills.length ? Math.round(skills.reduce((s, i) => s + Number(i.level || 0), 0) / skills.length) : 0
  const advanced = skills.filter((s) => Number(s.level) >= 70).length
  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))
  const addSkill = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return alert('Enter a skill title')
    setSkills((prev) => [{ id: String(Date.now()), ...formData, level: Number(formData.level) }, ...prev])
    setFormData({ title: '', path: 'Frontend', level: 0, note: '' })
  }
  const updateLevel = (id, amount) => setSkills((prev) => prev.map((s) => s.id === id ? { ...s, level: Math.max(0, Math.min(100, Number(s.level) + amount)) } : s))
  const deleteSkill = (id) => setSkills((prev) => prev.filter((s) => s.id !== id))
  return (
    <section className="page-shell skills-page">
      <div className="system-hero glass-card">
        <div><p className="page-kicker">Skill Tree</p><h1>Build your learning roadmap like an RPG system.</h1><p>Track coding, AI, Android, backend, business, and career skills with level progress.</p><div className="system-hero-actions"><a href="#skills-form" className="btn-life"><Plus size={18} /> Add Skill</a></div></div>
        <div className="system-hero-card"><BrainCircuit size={42} /><span>Average Skill</span><strong>{avg}%</strong><p>{advanced} advanced skills</p></div>
      </div>
      <div className="system-grid-4 section-gap">
        <article className="system-stat-card"><div className="system-stat-icon"><GraduationCap size={22} /></div><p>Skills</p><h3>{skills.length}</h3><span>Total tracked</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><Zap size={22} /></div><p>Average</p><h3>{avg}%</h3><span>Skill level</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><CheckCircle2 size={22} /></div><p>Advanced</p><h3>{advanced}</h3><span>70%+</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><Target size={22} /></div><p>Focus</p><h3>{skills[0]?.title || 'None'}</h3><span>Latest skill</span></article>
      </div>
      <article id="skills-form" className="system-form-card glass-card section-gap">
        <div className="premium-form-header"><div><p className="page-kicker">Add Skill</p><h2>Create a roadmap node</h2><p>Track what you are learning and how far you are.</p></div><span>Saved locally</span></div>
        <form className="system-form-grid" onSubmit={addSkill}>
          <label>Skill<input name="title" value={formData.title} onChange={handleChange} placeholder="Example: Kotlin Android" /></label>
          <label>Path<select name="path" value={formData.path} onChange={handleChange}><option>Frontend</option><option>Backend</option><option>Mobile</option><option>AI</option><option>Business</option><option>Career</option></select></label>
          <label>Level %<input type="number" min="0" max="100" name="level" value={formData.level} onChange={handleChange} /></label>
          <label className="system-wide">Notes<textarea name="note" rows="4" value={formData.note} onChange={handleChange}></textarea></label>
          <button className="btn-life" type="submit"><Plus size={18} /> Save Skill</button>
        </form>
      </article>
      <div className="section-heading section-gap"><div><p className="page-kicker">Skill Nodes</p><h2>{skills.length} roadmap items</h2></div></div>
      <div className="system-list-grid">{skills.map((skill) => (
        <article className="system-item-card" key={skill.id}>
          <div className="system-item-top"><div><p>{skill.path}</p><h3>{skill.title}</h3></div><span className="system-pill">{skill.level}%</span></div>
          <p className="system-body">{skill.note || 'No note added.'}</p>
          <div className="habit-progress-bar"><div className="habit-progress-fill" style={{ width: `${skill.level}%` }}></div></div>
          <div className="system-actions"><button className="btn-soft-life" onClick={() => updateLevel(skill.id, -10)}>-10%</button><button className="btn-life" onClick={() => updateLevel(skill.id, 10)}>+10%</button><button className="system-danger-btn" onClick={() => deleteSkill(skill.id)}><Trash2 size={16} /> Delete</button></div>
        </article>
      ))}</div>
    </section>
  )
}
export default Skills
