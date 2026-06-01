import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  FolderKanban,
  HeartPulse,
  Lightbulb,
  NotebookPen,
  Rocket,
  Scale,
  ShieldCheck,
  Star,
  Target,
  Wallet,
} from 'lucide-react'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { useLifeData } from '../context/LifeDataContext.jsx'
import { getExtendedSystemStats } from '../utils/extendedSystemStats.js'

const moduleIcons = {
  core: Target,
  habits: CalendarCheck,
  planner: CalendarDays,
  mood: HeartPulse,
  projects: FolderKanban,
  skills: BrainCircuit,
  finance: Wallet,
  review: ClipboardCheck,
  notes: NotebookPen,
  resources: ShieldCheck,
  decisions: Scale,
  launch: Rocket,
}

function FullSystemAnalytics() {
  const { lifeData } = useLifeData()
  const stats = getExtendedSystemStats(lifeData)

  return (
    <section className="full-system-analytics section-gap">
      <div className="system-analytics-hero glass-card">
        <div>
          <p className="page-kicker">Full System Analytics</p>
          <h2>All Life Matrix modules connected</h2>
          <p>
            Analytics now reads both the main LifeDataContext and the newer
            localStorage modules: Habits, Planner, Mood, Projects, Skills,
            Finance, Review, Notes, Resources, Decisions, and Launch.
          </p>
        </div>

        <div className="system-analytics-score">
          <Star size={36} />
          <span>System Score</span>
          <strong>{stats.systemScore}%</strong>
        </div>
      </div>

      <div className="system-analytics-stat-grid">
        <article>
          <Activity size={21} />
          <p>Total System Items</p>
          <h3>{stats.totalExtendedItems}</h3>
          <span>Across all modules</span>
        </article>

        <article>
          <BarChart3 size={21} />
          <p>Active Modules</p>
          <h3>{stats.activeModules}</h3>
          <span>Modules with data</span>
        </article>

        <article>
          <ShieldCheck size={21} />
          <p>Strongest</p>
          <h3>{stats.strongest?.name || 'None'}</h3>
          <span>{stats.strongest?.score || 0}% score</span>
        </article>

        <article>
          <Lightbulb size={21} />
          <p>Weakest</p>
          <h3>{stats.weakest?.name || 'None'}</h3>
          <span>{stats.weakest?.score || 0}% score</span>
        </article>
      </div>

      <div className="system-analytics-grid section-gap">
        <article className="system-analytics-chart glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">System Scoreboard</p>
              <h2>Module scores</h2>
            </div>

            <BarChart3 size={22} />
          </div>

          <div className="system-analytics-chart-wrap">
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={stats.extendedModules}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="score" radius={[16, 16, 0, 0]}>
                  {stats.extendedModules.map((module, index) => (
                    <Cell key={module.key} fill={index % 2 === 0 ? '#3b82f6' : '#7c3aed'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="system-recommendation-panel glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Priority Queue</p>
              <h2>System recommendations</h2>
            </div>

            <Lightbulb size={22} />
          </div>

          <div className="system-recommendation-list">
            {stats.recommendations.map((item) => (
              <Link to={item.route} className="system-recommendation-item" key={item.title}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>

                <ArrowRight size={18} />
              </Link>
            ))}
          </div>
        </article>
      </div>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Module Health</p>
          <h2>Every connected system area</h2>
        </div>
      </div>

      <div className="system-module-health-grid">
        {stats.extendedModules.map((module) => {
          const Icon = moduleIcons[module.key] || Activity

          return (
            <Link to={module.route} className="system-module-health-card" key={module.key}>
              <div className="system-module-health-top">
                <div>
                  <Icon size={21} />
                </div>

                <span>{module.score}%</span>
              </div>

              <h3>{module.name}</h3>
              <p>{module.detail}</p>

              <div className="habit-progress-info">
                <span>{module.count} records</span>
                <strong>{module.score}%</strong>
              </div>

              <div className="habit-progress-bar">
                <div
                  className="habit-progress-fill"
                  style={{ width: `${Math.min(100, module.score)}%` }}
                ></div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default FullSystemAnalytics
