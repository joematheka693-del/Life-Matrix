import { Crown, Sparkles, Trophy, Zap } from 'lucide-react'

import { getMatrixStats } from '../utils/matrixStats.js'
import { useLifeData } from '../context/LifeDataContext.jsx'

function MatrixLevelCard() {
  const { lifeData } = useLifeData()
  const stats = getMatrixStats(lifeData)

  return (
    <article className="matrix-level-card glass-card">
      <div className="matrix-level-top">
        <div>
          <p className="page-kicker">Matrix Level</p>
          <h2>Level {stats.level}</h2>
        </div>

        <div className="matrix-level-icon">
          <Crown size={28} />
        </div>
      </div>

      <div className="matrix-rank-display">
        <span>Calculated Rank</span>
        <strong>{stats.calculatedRank}</strong>
      </div>

      <div className="matrix-xp-row">
        <div>
          <Zap size={18} />
          <span>{stats.calculatedXp} XP</span>
        </div>

        <div>
          <Trophy size={18} />
          <span>{stats.unlockedBadges.length} badges</span>
        </div>
      </div>

      <div className="habit-progress-info">
        <span>Next Level</span>
        <strong>
          {stats.currentLevelXp} / {stats.nextLevelXp} XP
        </strong>
      </div>

      <div className="habit-progress-bar">
        <div
          className="habit-progress-fill"
          style={{ width: `${stats.levelProgress}%` }}
        ></div>
      </div>

      <p className="matrix-level-note">
        <Sparkles size={16} />
        XP is calculated from tracked items, completed items, streak, and average
        progress.
      </p>
    </article>
  )
}

export default MatrixLevelCard
