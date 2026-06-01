import {
  BarChart3,
  BookOpen,
  Brain,
  Dumbbell,
  Library,
  PieChart,
  PlaySquare,
  Radar,
  Target,
  TrendingUp,
} from 'lucide-react'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import FullSystemAnalytics from '../components/FullSystemAnalytics.jsx'
import MatrixInsights from '../components/MatrixInsights.jsx'
import MatrixReportPanel from '../components/MatrixReportPanel.jsx'
import { useLifeData } from '../context/LifeDataContext'
import { getMatrixInsights } from '../utils/matrixInsights.js'

function Analytics() {
  const { lifeData } = useLifeData()
  const insightsData = getMatrixInsights(lifeData)
  const stats = insightsData.stats

  const goals = lifeData.goals || []
  const workouts = lifeData.workouts || []
  const studying = lifeData.studying || []
  const reading = lifeData.reading || []
  const watchlist = lifeData.watchlist || []

  const progressData = [
    { name: 'Goals', value: stats.moduleProgress.goals, items: goals.length },
    { name: 'Workouts', value: stats.moduleProgress.workouts, items: workouts.length },
    { name: 'Studying', value: stats.moduleProgress.studying, items: studying.length },
    { name: 'Reading', value: stats.moduleProgress.reading, items: reading.length },
    { name: 'Watchlist', value: stats.moduleProgress.watchlist, items: watchlist.length },
  ]

  const moduleData = [
    { name: 'Goals', value: goals.length },
    { name: 'Workouts', value: workouts.length },
    { name: 'Studying', value: studying.length },
    { name: 'Reading', value: reading.length },
    { name: 'Watchlist', value: watchlist.length },
  ]

  const insightCards = [
    {
      icon: Target,
      title: 'Total Tracked',
      value: stats.totalItems,
      label: 'Core items only',
    },
    {
      icon: TrendingUp,
      title: 'Core Overall',
      value: `${stats.overallProgress}%`,
      label: 'Main module average',
    },
    {
      icon: BarChart3,
      title: 'Completed',
      value: stats.completedItems,
      label: 'Finished core items',
    },
    {
      icon: Radar,
      title: 'Rank',
      value: stats.calculatedRank,
      label: `Level ${stats.level}`,
    },
  ]

  return (
    <section className="page-shell analytics-page premium-analytics-page">
      <div className="analytics-command-hero glass-card">
        <div>
          <p className="page-kicker">Analytics Core</p>
          <h1>Decode your progress across every Life Matrix module.</h1>
          <p>
            Analytics now connects the original core modules and the newer
            system modules into one performance center.
          </p>
        </div>

        <div className="analytics-score-terminal">
          <TrendingUp size={42} />
          <span>Core Progress</span>
          <strong>{stats.overallProgress}%</strong>
          <p>{stats.totalItems} core items · {stats.calculatedRank}</p>
        </div>
      </div>

      <div className="analytics-insight-grid section-gap">
        {insightCards.map((insight) => {
          const Icon = insight.icon

          return (
            <article className="analytics-metric-card" key={insight.title}>
              <div className="analytics-metric-icon">
                <Icon size={22} />
              </div>

              <div>
                <p>{insight.title}</p>
                <h3>{insight.value}</h3>
                <span>{insight.label}</span>
              </div>
            </article>
          )
        })}
      </div>

      <FullSystemAnalytics />

      <MatrixInsights />

      <MatrixReportPanel />

      <div className="analytics-deep-grid section-gap">
        <article className="analytics-chart-console glass-card">
          <div className="analytics-card-header">
            <div>
              <p className="page-kicker">Core Module Progress</p>
              <h2>Original module completion</h2>
            </div>

            <BarChart3 size={22} />
          </div>

          <div className="analytics-chart-wrap">
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[16, 16, 0, 0]}>
                  {progressData.map((entry, index) => (
                    <Cell key={entry.name} fill={index % 2 === 0 ? '#3b82f6' : '#7c3aed'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="analytics-chart-console glass-card">
          <div className="analytics-card-header">
            <div>
              <p className="page-kicker">Core Module Spread</p>
              <h2>Original item distribution</h2>
            </div>

            <PieChart size={22} />
          </div>

          <div className="analytics-chart-wrap">
            <ResponsiveContainer width="100%" height={340}>
              <RePieChart>
                <Pie
                  data={moduleData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={112}
                  innerRadius={64}
                  paddingAngle={5}
                >
                  {moduleData.map((entry, index) => (
                    <Cell key={entry.name} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                  ))}
                </Pie>

                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="analytics-bottom-grid section-gap">
        <article className="analytics-recommendation-console glass-card">
          <div className="analytics-card-header">
            <div>
              <p className="page-kicker">Activity Timeline</p>
              <h2>Top active core items</h2>
            </div>

            <BookOpen size={22} />
          </div>

          <div className="analytics-timeline-list">
            {insightsData.timeline.map((item, index) => (
              <a href={item.route} className="analytics-timeline-item" key={`${item.title}-${index}`}>
                <div>
                  <span>{item.type}</span>
                  <h3>{item.title}</h3>
                </div>

                <strong>{item.progress}%</strong>
              </a>
            ))}
          </div>
        </article>

        <article className="analytics-module-console glass-card">
          <p className="page-kicker">Core Summary</p>
          <h2>Original tracked areas</h2>

          <div className="analytics-module-list">
            {[
              { icon: Target, name: 'Goals', value: goals.length },
              { icon: Dumbbell, name: 'Workouts', value: workouts.length },
              { icon: Brain, name: 'Studying', value: studying.length },
              { icon: Library, name: 'Reading', value: reading.length },
              { icon: PlaySquare, name: 'Watchlist', value: watchlist.length },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div key={item.name}>
                  <span>
                    <Icon size={18} />
                    {item.name}
                  </span>

                  <strong>{item.value}</strong>
                </div>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}

export default Analytics
