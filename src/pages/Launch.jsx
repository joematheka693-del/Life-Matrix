import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ClipboardCheck, Rocket, ShieldCheck, Trash2 } from 'lucide-react'

const defaults = [
  { id: 'launch-1', title: 'No broken imports', category: 'Code', done: false },
  { id: 'launch-2', title: 'All routes tested', category: 'Testing', done: false },
  { id: 'launch-3', title: 'Responsive layout checked', category: 'UI', done: false },
  { id: 'launch-4', title: 'Backup exported', category: 'Data', done: false },
  { id: 'launch-5', title: 'Deployment build runs', category: 'Deployment', done: false },
]

function Launch() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('life_matrix_launch')) || defaults } catch { return defaults }
  })
  useEffect(() => { localStorage.setItem('life_matrix_launch', JSON.stringify(items)) }, [items])
  const done = items.filter((i) => i.done).length
  const progress = items.length ? Math.round((done / items.length) * 100) : 0
  const toggle = (id) => setItems((prev) => prev.map((i) => i.id === id ? { ...i, done: !i.done } : i))
  const reset = () => setItems(defaults)
  return (
    <section className="page-shell launch-page">
      <div className="system-hero glass-card">
        <div><p className="page-kicker">Launch Readiness</p><h1>Prepare Life Matrix for testing, defense, and deployment.</h1><p>Use this checklist before hosting or presenting your project so you avoid broken imports, routes, UI errors, and missing backups.</p><div className="system-hero-actions"><button className="btn-soft-life" onClick={reset}>Reset Checklist</button></div></div>
        <div className="system-hero-card"><Rocket size={42} /><span>Ready</span><strong>{progress}%</strong><p>{done} / {items.length} tasks done</p></div>
      </div>
      <div className="system-grid-4 section-gap">
        <article className="system-stat-card"><div className="system-stat-icon"><ClipboardCheck size={22} /></div><p>Checklist</p><h3>{items.length}</h3><span>Total tasks</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><CheckCircle2 size={22} /></div><p>Done</p><h3>{done}</h3><span>Completed</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><ShieldCheck size={22} /></div><p>Remaining</p><h3>{items.length - done}</h3><span>Pending</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><Rocket size={22} /></div><p>Status</p><h3>{progress >= 100 ? 'Launch' : 'Testing'}</h3><span>Project state</span></article>
      </div>
      <div className="section-heading section-gap"><div><p className="page-kicker">Deployment Checklist</p><h2>Final checks</h2></div></div>
      <div className="system-list-grid">{items.map((item) => (
        <article className={item.done ? 'system-item-card launch-done' : 'system-item-card'} key={item.id}>
          <div className="system-item-top"><div><p>{item.category}</p><h3>{item.title}</h3></div><span className="system-pill">{item.done ? 'Done' : 'Pending'}</span></div>
          <p className="system-body">{item.done ? 'Completed and ready.' : 'Review this before launch.'}</p>
          <div className="system-actions"><button className="btn-life" onClick={() => toggle(item.id)}><CheckCircle2 size={17} /> {item.done ? 'Undo' : 'Mark Done'}</button></div>
        </article>
      ))}</div>
    </section>
  )
}
export default Launch
