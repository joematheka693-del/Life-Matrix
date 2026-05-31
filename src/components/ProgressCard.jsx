import { useLifeData } from '../context/LifeDataContext.jsx'

function ProgressCard() {
  const { lifeData } = useLifeData()
  const progress = Math.min(100, Math.round((lifeData.user.xp / lifeData.user.nextRankXp) * 100))

  return (
    <article className="progress-card matrix-level-card">
      <div className="level-card-top">
        <div>
          <p className="page-kicker">Current Level</p>
          <h3>{lifeData.user.rank}</h3>
        </div>
        <div className="level-badge">LVL {lifeData.user.level}</div>
      </div>

      <div className="level-progress-wrap">
        <div className="level-progress-info">
          <span>{lifeData.user.xp} XP</span>
          <span>{lifeData.user.nextRankXp} XP</span>
        </div>
        <div className="level-progress-bar"><div className="level-progress-fill" style={{ width: `${progress}%` }}></div></div>
      </div>

      <p className="level-note">
        Earn {lifeData.user.nextRankXp - lifeData.user.xp} more XP to unlock the next rank.
      </p>
    </article>
  )
}

export default ProgressCard
