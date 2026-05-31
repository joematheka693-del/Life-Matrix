import {
  Award,
  BadgeCheck,
  Crown,
  Flame,
  Gem,
  Lock,
  Medal,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react'

import MatrixLevelCard from '../components/MatrixLevelCard.jsx'
import { useLifeData } from '../context/LifeDataContext.jsx'
import { getMatrixStats } from '../utils/matrixStats.js'

function Achievements() {
  const { lifeData } = useLifeData()
  const stats = getMatrixStats(lifeData)

  const user = lifeData.user || {}
  const username = user.username || user.name || 'User'

  const completionRate = stats.badges.length
    ? Math.round((stats.unlockedBadges.length / stats.badges.length) * 100)
    : 0

  const rankTimeline = [
    'Rank E',
    'Rank D',
    'Rank C',
    'Rank B',
    'Rank A',
    'Rank S',
    'Shadow Monarch',
  ]

  const currentRankIndex = rankTimeline.indexOf(stats.calculatedRank)

  const achievementStats = [
    {
      icon: Trophy,
      title: 'Unlocked',
      value: stats.unlockedBadges.length,
      label: 'Badges active',
    },
    {
      icon: Lock,
      title: 'Locked',
      value: stats.lockedBadges.length,
      label: 'Still hidden',
    },
    {
      icon: Zap,
      title: 'XP',
      value: stats.calculatedXp,
      label: 'Calculated score',
    },
    {
      icon: Crown,
      title: 'Rank',
      value: stats.calculatedRank,
      label: `Level ${stats.level}`,
    },
  ]

  return (
    <section className="page-shell achievements-page premium-achievements-page">
      <div className="achievements-command-hero glass-card">
        <div>
          <p className="page-kicker">Achievement Hall</p>
          <h1>Track your badges, rank, XP, and unlock path.</h1>
          <p>
            This hall uses your real Life Matrix data to show what you have
            unlocked, what is still locked, and what you should target next.
          </p>

          <div className="achievement-hero-actions">
            <a href="/dashboard" className="btn-life">
              <Sparkles size={18} />
              Open Dashboard
            </a>

            <a href="/analytics" className="btn-soft-life">
              <ShieldCheck size={17} />
              View Analytics
            </a>
          </div>
        </div>

        <div className="achievements-rank-card">
          <Crown size={42} />
          <span>Current Class</span>
          <strong>{stats.calculatedRank}</strong>
          <p>{stats.unlockedBadges.length} / {stats.badges.length} badges unlocked</p>

          <div className="achievement-mini-progress">
            <div style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>
      </div>

      <div className="achievement-stat-grid section-gap">
        {achievementStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="achievement-metric-card" key={stat.title}>
              <div className="achievement-metric-icon">
                <Icon size={22} />
              </div>

              <p>{stat.title}</p>
              <h3>{stat.value}</h3>
              <span>{stat.label}</span>
            </article>
          )
        })}
      </div>

      <div className="achievement-deep-grid section-gap">
        <MatrixLevelCard />

        <article className="achievement-rank-road glass-card">
          <p className="page-kicker">Rank Road</p>
          <h2>{username}&apos;s evolution route</h2>

          <div className="achievement-rank-list">
            {rankTimeline.map((rank, index) => (
              <div
                className={
                  index <= currentRankIndex
                    ? 'achievement-rank-item active'
                    : 'achievement-rank-item'
                }
                key={rank}
              >
                <Medal size={18} />
                <span>{rank}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Badge Vault</p>
          <h2>All achievements</h2>
        </div>
      </div>

      <div className="achievement-badge-grid">
        {stats.badges.map((badge) => (
          <article
            className={
              badge.unlocked
                ? 'achievement-badge-card unlocked'
                : 'achievement-badge-card locked'
            }
            key={badge.id}
          >
            <div className="achievement-badge-orb">
              {badge.unlocked ? <Trophy size={26} /> : <Lock size={26} />}
            </div>

            <div>
              <span>{badge.unlocked ? 'Unlocked' : 'Locked'}</span>
              <h3>{badge.title}</h3>
              <p>{badge.text}</p>
            </div>
          </article>
        ))}
      </div>

      <article className="achievement-next-target glass-card section-gap">
        <div>
          <p className="page-kicker">Next Target</p>
          <h2>
            {stats.lockedBadges[0]
              ? stats.lockedBadges[0].title
              : 'All badges unlocked'}
          </h2>
          <p>
            {stats.lockedBadges[0]
              ? stats.lockedBadges[0].text
              : 'You have cleared the current badge system. Add more advanced badges in the next phase.'}
          </p>
        </div>

        <div className="achievement-target-icons">
          <Gem size={24} />
          <Star size={24} />
          <Flame size={24} />
          <BadgeCheck size={24} />
          <Award size={24} />
        </div>
      </article>
    </section>
  )
}

export default Achievements
