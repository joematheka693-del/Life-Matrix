import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Lightbulb,
  Radar,
  TrendingUp,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'
import { getMatrixInsights } from '../utils/matrixInsights.js'

function MatrixInsights() {
  const { lifeData } = useLifeData()
  const insights = getMatrixInsights(lifeData)

  const toneIcon = {
    success: CheckCircle2,
    info: TrendingUp,
    warning: AlertTriangle,
    danger: AlertTriangle,
    empty: CircleDashed,
  }

  return (
    <section className="matrix-insights-section">
      <div className="section-heading">
        <div>
          <p className="page-kicker">Smart Insights</p>
          <h2>System recommendations</h2>
        </div>
      </div>

      <div className="matrix-health-grid">
        {insights.modules.map((module) => {
          const Icon = toneIcon[module.tone] || Radar

          return (
            <Link
              to={module.route}
              className={`matrix-health-card ${module.tone}`}
              key={module.key}
            >
              <div className="matrix-health-top">
                <div className="matrix-health-icon">
                  <Icon size={21} />
                </div>

                <span>{module.health}</span>
              </div>

              <h3>{module.name}</h3>
              <p>{module.suggestion}</p>

              <div className="habit-progress-info">
                <span>{module.count} items</span>
                <strong>{module.progress}%</strong>
              </div>

              <div className="habit-progress-bar">
                <div
                  className="habit-progress-fill"
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="matrix-insight-bottom-grid section-gap">
        <article className="matrix-recommendation-console glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Priority Queue</p>
              <h2>What to do next</h2>
            </div>

            <Lightbulb size={22} />
          </div>

          <div className="matrix-recommendation-list">
            {insights.recommendations.map((item) => {
              const Icon = toneIcon[item.tone] || Lightbulb

              return (
                <div className={`matrix-recommendation-item ${item.tone}`} key={item.title}>
                  <div>
                    <Icon size={19} />
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </article>

        <article className="matrix-focus-console glass-card">
          <p className="page-kicker">Focus Target</p>
          <h2>{insights.weakestModule.name}</h2>
          <p>
            This is currently your weakest module. Improving it will raise your
            overall Matrix score faster.
          </p>

          <div className="matrix-focus-route">
            <span>{insights.weakestModule.progress}% progress</span>

            <Link to={insights.weakestModule.route}>
              Improve Module
              <ArrowRight size={17} />
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

export default MatrixInsights
