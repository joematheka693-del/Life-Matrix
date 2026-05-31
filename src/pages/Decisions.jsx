import { useEffect, useMemo, useState } from 'react'
import { GitCompareArrows, Plus, Scale, Sparkles, Trash2, Trophy } from 'lucide-react'

const defaults = [
  { id: 'dec-1', title: 'Focus on React or Android first?', optionA: 'React', optionB: 'Android', scoreA: 8, scoreB: 6, reason: 'React helps current web projects faster.' },
]

function Decisions() {
  const [decisions, setDecisions] = useState(() => {
    try { return JSON.parse(localStorage.getItem('life_matrix_decisions')) || defaults } catch { return defaults }
  })
  const [formData, setFormData] = useState({ title: '', optionA: '', optionB: '', scoreA: 5, scoreB: 5, reason: '' })
  useEffect(() => { localStorage.setItem('life_matrix_decisions', JSON.stringify(decisions)) }, [decisions])
  const winnersA = decisions.filter((d) => Number(d.scoreA) >= Number(d.scoreB)).length
  const latest = decisions[0]
  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))
  const addDecision = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.optionA.trim() || !formData.optionB.trim()) return alert('Fill title and both options')
    setDecisions((prev) => [{ id: String(Date.now()), ...formData, scoreA: Number(formData.scoreA), scoreB: Number(formData.scoreB) }, ...prev])
    setFormData({ title: '', optionA: '', optionB: '', scoreA: 5, scoreB: 5, reason: '' })
  }
  const deleteDecision = (id) => setDecisions((prev) => prev.filter((d) => d.id !== id))
  const best = (d) => Number(d.scoreA) >= Number(d.scoreB) ? d.optionA : d.optionB
  return (
    <section className="page-shell decisions-page">
      <div className="system-hero glass-card">
        <div><p className="page-kicker">Decision Matrix</p><h1>Compare options and choose with structure.</h1><p>Use this for course choices, project direction, investment ideas, tech stacks, and priorities.</p><div className="system-hero-actions"><a href="#decision-form" className="btn-life"><Plus size={18} /> Add Decision</a></div></div>
        <div className="system-hero-card"><Scale size={42} /><span>Decisions</span><strong>{decisions.length}</strong><p>Latest winner: {latest ? best(latest) : 'None'}</p></div>
      </div>
      <div className="system-grid-4 section-gap">
        <article className="system-stat-card"><div className="system-stat-icon"><GitCompareArrows size={22} /></div><p>Total</p><h3>{decisions.length}</h3><span>Comparisons</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><Trophy size={22} /></div><p>Option A Wins</p><h3>{winnersA}</h3><span>Higher scores</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><Sparkles size={22} /></div><p>Option B Wins</p><h3>{decisions.length - winnersA}</h3><span>Higher scores</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><Scale size={22} /></div><p>Latest</p><h3>{latest ? best(latest) : 'None'}</h3><span>Best option</span></article>
      </div>
      <article id="decision-form" className="system-form-card glass-card section-gap">
        <div className="premium-form-header"><div><p className="page-kicker">Add Decision</p><h2>Compare two options</h2><p>Score both options from 1 to 10.</p></div><span>Saved locally</span></div>
        <form className="system-form-grid" onSubmit={addDecision}>
          <label className="system-wide">Decision Title<input name="title" value={formData.title} onChange={handleChange} /></label>
          <label>Option A<input name="optionA" value={formData.optionA} onChange={handleChange} /></label>
          <label>Score A<input type="number" min="1" max="10" name="scoreA" value={formData.scoreA} onChange={handleChange} /></label>
          <label>Option B<input name="optionB" value={formData.optionB} onChange={handleChange} /></label>
          <label>Score B<input type="number" min="1" max="10" name="scoreB" value={formData.scoreB} onChange={handleChange} /></label>
          <label className="system-wide">Reason<textarea name="reason" rows="4" value={formData.reason} onChange={handleChange}></textarea></label>
          <button className="btn-life" type="submit"><Plus size={18} /> Save Decision</button>
        </form>
      </article>
      <div className="section-heading section-gap"><div><p className="page-kicker">Decision Log</p><h2>{decisions.length} comparisons</h2></div></div>
      <div className="system-list-grid">{decisions.map((d) => (
        <article className="system-item-card" key={d.id}>
          <div className="system-item-top"><div><p>Winner: {best(d)}</p><h3>{d.title}</h3></div><span className="system-pill">{d.scoreA} vs {d.scoreB}</span></div>
          <p className="system-body">{d.optionA}: {d.scoreA}/10<br />{d.optionB}: {d.scoreB}/10<br /><br />{d.reason}</p>
          <div className="system-actions"><button className="system-danger-btn" onClick={() => deleteDecision(d.id)}><Trash2 size={16} /> Delete</button></div>
        </article>
      ))}</div>
    </section>
  )
}
export default Decisions
