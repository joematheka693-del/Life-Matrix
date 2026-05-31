import {
  Award,
  BadgeCheck,
  BookOpen,
  Brain,
  Crown,
  Dumbbell,
  Flame,
  Gem,
  Library,
  Medal,
  ShieldCheck,
  Target,
  Trophy,
  User,
  Zap,
} from 'lucide-react'

import MatrixLevelCard from '../components/MatrixLevelCard.jsx'
import { useLifeData } from '../context/LifeDataContext'
import { getMatrixStats } from '../utils/matrixStats.js'

function Profile() {
  const { lifeData } = useLifeData()
  const stats = getMatrixStats(lifeData)

  const user = lifeData.user || {}
  const username = user.username || user.name || 'User'
  const name = user.name || username
  const avatarUrl = user.avatarUrl || ''
  const streak = Number(user.streak) || 0

  const goals = lifeData.goals || []
  const workouts = lifeData.workouts || []
  const studying = lifeData.studying || []
  const reading = lifeData.reading || []

  const profileStats = [
    {
      icon: Target,
      title: 'Goals',
      value: goals.length,
      label: `${stats.completed.goals} completed`,
    },
    {
      icon: Dumbbell,
      title: 'Workouts',
      value: workouts.length,
      label: `${stats.completed.workouts} completed`,
    },
    {
      icon: Brain,
      title: 'Study Paths',
      value: studying.length,
      label: `${stats.completed.studying} completed`,
    },
    {
      icon: Library,
      title: 'Library',
      value: reading.length,
      label: `${stats.completed.reading} completed`,
    },
  ]

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

  return (
    <section className="page-shell profile-page premium-profile-page">
      <div className="profile-command-hero glass-card">
        <div className="profile-identity-panel">
          <div className="profile-main-avatar premium-main-avatar">
            {avatarUrl ? (
              <img src={avatarUrl} alt={username} />
            ) : (
              <User size={48} />
            )}
          </div>

          <div>
            <p className="page-kicker">Player Identity</p>
            <h1>{name}</h1>
            <p className="profile-handle">
              @{username} · {stats.calculatedRank} · Level {stats.level}
            </p>

            <div className="profile-chip-row">
              <span>
                <BadgeCheck size={17} />
                {stats.totalItems} tracked
              </span>

              <span>
                <Flame size={17} />
                {streak} day streak
              </span>

              <span>
                <Gem size={17} />
                {stats.calculatedXp} XP
              </span>
            </div>
          </div>
        </div>

        <div className="profile-rank-terminal">
          <div className="rank-terminal-glow">
            <Crown size={40} />
          </div>

          <span>Calculated Class</span>
          <strong>{stats.calculatedRank}</strong>
          <p>{stats.unlockedBadges.length} / {stats.badges.length} badges unlocked.</p>

          <div className="profile-rank-progress">
            <div style={{ width: `${stats.levelProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="profile-stat-grid section-gap">
        {profileStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="profile-metric-card" key={stat.title}>
              <div className="profile-metric-icon">
                <Icon size={22} />
              </div>

              <div>
                <p>{stat.title}</p>
                <h3>{stat.value}</h3>
                <span>{stat.label}</span>
              </div>
            </article>
          )
        })}
      </div>

      <div className="profile-deep-grid section-gap">
        <MatrixLevelCard />

        <article className="profile-rank-path glass-card">
          <p className="page-kicker">Rank Path</p>
          <h2>Evolution route</h2>

          <div className="rank-path-list">
            {rankTimeline.map((rank, index) => (
              <div
                className={
                  index <= currentRankIndex ? 'rank-path-item active' : 'rank-path-item'
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
          <p className="page-kicker">Achievement Vault</p>
          <h2>Unlocked badges</h2>
        </div>
      </div>

      <div className="badge-grid premium-badge-grid">
        {stats.badges.map((badge) => (
          <article
            className={badge.unlocked ? 'premium-badge-card' : 'premium-badge-card locked'}
            key={badge.id}
          >
            <div className="premium-badge-icon">
              {badge.unlocked ? <Trophy size={24} /> : <Award size={24} />}
            </div>

            <div>
              <h3>{badge.title}</h3>
              <p>{badge.text}</p>
              <span className={badge.unlocked ? 'badge-status unlocked' : 'badge-status locked'}>
                {badge.unlocked ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          </article>
        ))}
      </div>

      <article className="profile-xp-console glass-card section-gap">
        <div className="profile-console-header">
          <div>
            <p className="page-kicker">XP Formula</p>
            <h2>How your score is calculated</h2>
          </div>

          <Zap size={24} />
        </div>

        <div className="xp-formula-grid">
          <div>
            <ShieldCheck size={20} />
            <strong>+20 XP</strong>
            <span>Every tracked item</span>
          </div>

          <div>
            <Trophy size={20} />
            <strong>+80 XP</strong>
            <span>Every completed item</span>
          </div>

          <div>
            <Flame size={20} />
            <strong>+10 XP</strong>
            <span>Every streak day</span>
          </div>

          <div>
            <BookOpen size={20} />
            <strong>+5 XP</strong>
            <span>Every average progress point</span>
          </div>
        </div>
      </article>
    </section>
  )
}

export default Profile
