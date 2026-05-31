import { Award, BarChart3, Brain, CalendarCheck, FolderKanban, HeartPulse, Star, Target } from 'lucide-react'
import { useLifeData } from '../context/LifeDataContext.jsx'
import { getMatrixStats } from '../utils/matrixStats.js'

function readArray(key) {
  try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] }
}

function Score() {
  const { lifeData } = useLifeData()
  const stats = getMatrixStats(lifeData)
  const modules = [
    { name: 'Core Matrix', icon: BarChart3, count: stats.totalItems, score: stats.overallProgress },
    { name: 'Habits', icon: CalendarCheck, count: readArray('life_matrix_habits').length, score: readArray('life_matrix_habits').filter((h) => h.completedToday).length * 20 },
    { name: 'Mood', icon: HeartPulse, count: readArray('life_matrix_mood').length, score: readArray('life_matrix_mood').length ? Math.round(readArray('life_matrix_mood').reduce((s, i) => s + Number(i.energy || 0), 0) / readArray('life_matrix_mood').length) : 0 },
    { name: 'Projects', icon: FolderKanban, count: readArray('life_matrix_projects').length, score: readArray('life_matrix_projects').length ? Math.round(readArray('life_matrix_projects').reduce((s, i) => s + Number(i.progress || 0), 0) / readArray('life_matrix_projects').length) : 0 },
    { name: 'Skills', icon: Brain, count: readArray('life_matrix_skills').length, score: readArray('life_matrix_skills').length ? Math.round(readArray('life_matrix_skills').reduce((s, i) => s + Number(i.level || 0), 0) / readArray('life_matrix_skills').length) : 0 },
  ]
  const lifeScore = Math.round(modules.reduce((s, m) => s + Math.min(100, m.score), 0) / modules.length)
  return (
    <section className="page-shell score-page">
      <div className="system-hero glass-card">
        <div><p className="page-kicker">Life Score</p><h1>One command overview for your entire system.</h1><p>This page combines your main Life Matrix progress with habits, mood, projects, and skills into one score.</p><div className="system-hero-actions"><a href="/analytics" className="btn-life"><BarChart3 size={18} /> Analytics</a></div></div>
        <div className="system-hero-card"><Star size={42} /><span>Life Score</span><strong>{lifeScore}%</strong><p>{stats.calculatedRank} · Level {stats.level}</p></div>
      </div>
      <div className="system-grid-4 section-gap">
        <article className="system-stat-card"><div className="system-stat-icon"><Target size={22} /></div><p>Tracked</p><h3>{stats.totalItems}</h3><span>Core items</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><Award size={22} /></div><p>Badges</p><h3>{stats.unlockedBadges.length}</h3><span>Unlocked</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><Star size={22} /></div><p>XP</p><h3>{stats.calculatedXp}</h3><span>Calculated</span></article>
        <article className="system-stat-card"><div className="system-stat-icon"><BarChart3 size={22} /></div><p>Overall</p><h3>{stats.overallProgress}%</h3><span>Core progress</span></article>
      </div>
      <div className="section-heading section-gap"><div><p className="page-kicker">System Modules</p><h2>Score breakdown</h2></div></div>
      <div className="system-list-grid">{modules.map((m) => { const Icon = m.icon; return (
        <article className="system-item-card" key={m.name}>
          <div className="system-item-top"><div><p>{m.count} records</p><h3>{m.name}</h3></div><span className="system-pill">{Math.min(100, m.score)}%</span></div>
          <div className="habit-progress-bar"><div className="habit-progress-fill" style={{ width: `${Math.min(100, m.score)}%` }}></div></div>
          <p className="system-body"><Icon size={18} /> This module contributes to your Life Score overview.</p>
        </article>
      )})}</div>
    </section>
  )
}
export default Score
