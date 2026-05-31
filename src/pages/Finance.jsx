import { useEffect, useMemo, useState } from 'react'
import { Banknote, CreditCard, Plus, PiggyBank, TrendingDown, TrendingUp, Trash2, Wallet } from 'lucide-react'

const defaultItems = [
  { id: 'fin-1', title: 'Project earnings target', type: 'Income', amount: 5000, category: 'Freelance', note: 'Target from beginner online jobs.' },
  { id: 'fin-2', title: 'Internet bundles', type: 'Expense', amount: 1000, category: 'Utilities', note: 'Monthly data and connectivity.' },
]

function Finance() {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('life_matrix_finance')) || defaultItems } catch { return defaultItems }
  })
  const [filter, setFilter] = useState('All')
  const [formData, setFormData] = useState({ title: '', type: 'Income', amount: 0, category: 'Freelance', note: '' })

  useEffect(() => { localStorage.setItem('life_matrix_finance', JSON.stringify(items)) }, [items])

  const filtered = useMemo(() => filter === 'All' ? items : items.filter((item) => item.type === filter || item.category === filter), [filter, items])
  const income = items.filter((i) => i.type === 'Income').reduce((s, i) => s + Number(i.amount || 0), 0)
  const expenses = items.filter((i) => i.type === 'Expense').reduce((s, i) => s + Number(i.amount || 0), 0)
  const savings = income - expenses

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }))

  const addItem = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return alert('Enter a title')
    setItems((prev) => [{ id: String(Date.now()), ...formData, amount: Number(formData.amount) }, ...prev])
    setFormData({ title: '', type: 'Income', amount: 0, category: 'Freelance', note: '' })
  }

  const deleteItem = (id) => setItems((prev) => prev.filter((item) => item.id !== id))

  return (
    <section className="page-shell finance-page">
      <div className="system-hero glass-card">
        <div>
          <p className="page-kicker">Finance Matrix</p>
          <h1>Track income, expenses, and money goals.</h1>
          <p>Use this module to monitor freelance earnings, subscriptions, school expenses, project costs, and savings targets.</p>
          <div className="system-hero-actions"><a href="#finance-form" className="btn-life"><Plus size={18} /> Add Record</a></div>
        </div>
        <div className="system-hero-card"><Wallet size={42} /><span>Balance</span><strong>KSh {savings}</strong><p>Income minus expenses</p></div>
      </div>

      <div className="system-grid-4 section-gap">
        <article className="system-stat-card"><div className="system-stat-icon"><TrendingUp size={22} /></div><p>Income</p><h3>KSh {income}</h3><span>Total money in</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><TrendingDown size={22} /></div><p>Expenses</p><h3>KSh {expenses}</h3><span>Total money out</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><PiggyBank size={22} /></div><p>Savings</p><h3>KSh {savings}</h3><span>Current balance</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><CreditCard size={22} /></div><p>Records</p><h3>{items.length}</h3><span>Finance entries</span></article>
      </div>

      <article id="finance-form" className="system-form-card glass-card section-gap">
        <div className="premium-form-header"><div><p className="page-kicker">Add Finance Record</p><h2>Save money movement</h2><p>Track every income or expense locally.</p></div><span>Saved locally</span></div>
        <form className="system-form-grid" onSubmit={addItem}>
          <label>Title<input name="title" value={formData.title} onChange={handleChange} placeholder="Example: Website client payment" /></label>
          <label>Type<select name="type" value={formData.type} onChange={handleChange}><option>Income</option><option>Expense</option></select></label>
          <label>Amount<input type="number" name="amount" value={formData.amount} onChange={handleChange} /></label>
          <label>Category<select name="category" value={formData.category} onChange={handleChange}><option>Freelance</option><option>School</option><option>Transport</option><option>Food</option><option>Utilities</option><option>Project</option><option>Saving</option></select></label>
          <label className="system-wide">Note<textarea name="note" rows="4" value={formData.note} onChange={handleChange} placeholder="Details..."></textarea></label>
          <button className="btn-life" type="submit"><Plus size={18} /> Save Record</button>
        </form>
      </article>

      <div className="system-toolbar section-gap">
        {['All', 'Income', 'Expense', 'Freelance', 'School', 'Project', 'Saving'].map((f) => <button key={f} type="button" className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f}</button>)}
      </div>

      <div className="section-heading section-gap"><div><p className="page-kicker">Finance Records</p><h2>{filtered.length} entries</h2></div></div>
      <div className="system-list-grid">
        {filtered.map((item) => (
          <article className="system-item-card" key={item.id}>
            <div className="system-item-top"><div><p>{item.category}</p><h3>{item.title}</h3></div><span className="system-pill">{item.type}</span></div>
            <p className="system-body">{item.note || 'No note added.'}</p>
            <div className="habit-progress-info"><span>Amount</span><strong>KSh {item.amount}</strong></div>
            <div className="system-actions"><button className="system-danger-btn" onClick={() => deleteItem(item.id)}><Trash2 size={16} /> Delete</button></div>
          </article>
        ))}
      </div>
    </section>
  )
}
export default Finance
