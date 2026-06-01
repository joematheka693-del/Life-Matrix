import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Brain,
  Crown,
  Dumbbell,
  Flame,
  Library,
  PlaySquare,
  Target,
  Trophy,
  Zap,
} from 'lucide-react'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import DailyFocusBoard from '../components/DailyFocusBoard.jsx'
import FocusTimer from '../components/FocusTimer.jsx'
import MatrixLevelCard from '../components/MatrixLevelCard.jsx'
import ReminderCenter from '../components/ReminderCenter.jsx'
import { useLifeData } from '../context/LifeDataContext'
import { getMatrixStats } from '../utils/matrixStats.js'

function Dashboard() {
  const { lifeData } = useLifeData()
  const stats = getMatrixStats(lifeData)

  const user = lifeData.user || {}
  const goals = lifeData.goals || []
  const workouts = lifeData.workouts || []
  const studying = lifeData.studying || []
  const reading = lifeData.reading || []
  const watchlist = lifeData.watchlist || []

  const username = user.username || user.name || 'User'

  const dashboardStats = [
    {
      icon: Target,
      title: 'Goals',
      value: goals.length,
      label: `${stats.completed.goals} completed`,
      progress: stats.moduleProgress.goals,
    },
    {
      icon: Dumbbell,
      title: 'Workouts',
      value: workouts.length,
      label: `${stats.completed.workouts} completed`,
      progress: stats.moduleProgress.workouts,
    },
    {
      icon: Brain,
      title: 'Study',
      value: studying.length,
      label: `${stats.completed.studying} completed`,
      progress: stats.moduleProgress.studying,
    },
    {
      icon: Library,
      title: 'Reading',
      value: reading.length,
      label: `${stats.completed.reading} completed`,
      progress: stats.moduleProgress.reading,
    },
    {
      icon: PlaySquare,
      title: 'Watchlist',
      value: watchlist.length,
      label: `${stats.completed.watchlist} completed`,
      progress: stats.moduleProgress.watchlist,
    },
  ]

  const chartData = [
    { name: 'Goals', progress: stats.moduleProgress.goals },
    { name: 'Fitness', progress: stats.moduleProgress.workouts },
    { name: 'Study', progress: stats.moduleProgress.studying },
    { name: 'Reading', progress: stats.moduleProgress.reading },
    { name: 'Watch', progress: stats.moduleProgress.watchlist },
  ]

  const recentActivity = [
    ...goals.slice(0, 2).map((item) => ({
      type: 'Goal',
      title: item.title,
      progress: item.progress,
      icon: Target,
    })),
    ...workouts.slice(0, 2).map((item) => ({
      type: 'Workout',
      title: item.title,
      progress: item.progress,
      icon: Dumbbell,
    })),
    ...reading.slice(0, 2).map((item) => ({
      type: item.type || 'Reading',
      title: item.title,
      progress: item.progress,
      icon: BookOpen,
    })),
  ].slice(0, 6)

  return (
    <section className="page-shell dashboard-page premium-dashboard-page">
      <div className="dashboard-command-hero glass-card">
        <div>
          <p className="page-kicker">Command Center</p>
          <h1>Welcome back, {username}.</h1>
          <p>
            Dashboard now includes Daily Focus, XP calculation, smart progress,
            Pomodoro timer, and a real Reminder Engine.
          </p>

          <div className="dashboard-hero-actions">
            <a href="/goals" className="btn-life">
              <Target size={18} />
              Add Mission
            </a>

            <a href="/analytics" className="btn-soft-life">
              <ArrowUpRight size={17} />
              View Analytics
            </a>
          </div>
        </div>

        <div className="dashboard-rank-terminal">
          <div className="dashboard-terminal-icon">
            <Crown size={38} />
          </div>

          <span>Calculated Rank</span>
          <strong>{stats.calculatedRank}</strong>
          <p>Level {stats.level} · {stats.calculatedXp} XP</p>

          <div className="dashboard-terminal-progress">
            <div style={{ width: `${stats.levelProgress}%` }}></div>
          </div>
        </div>
      </div>

      <ReminderCenter />

      <DailyFocusBoard />

      <FocusTimer />

      <div className="dashboard-module-grid section-gap">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="dashboard-module-card" key={stat.title}>
              <div className="dashboard-module-top">
                <div className="dashboard-module-icon">
                  <Icon size={22} />
                </div>

                <span>{stat.progress}%</span>
              </div>

              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
              <small>{stat.label}</small>

              <div className="habit-progress-bar">
                <div
                  className="habit-progress-fill"
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="dashboard-deep-grid section-gap">
        <article className="dashboard-chart-console glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Progress Overview</p>
              <h2>Matrix performance</h2>
            </div>

            <span>{stats.overallProgress}% overall</span>
          </div>

          <div className="dashboard-chart-wrap">
            <ResponsiveContainer width="100%" height={310}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="dashboardProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.36} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="#3b82f6"
                  fill="url(#dashboardProgress)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <MatrixLevelCard />
      </div>

      <div className="dashboard-deep-grid section-gap">
        <article className="dashboard-focus-console glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Today&apos;s Focus</p>
              <h2>General system moves</h2>
            </div>

            <Activity size={22} />
          </div>

          <div className="dashboard-focus-list">
            <div>
              <Flame size={19} />
              <p>Keep your {user.streak || 0} day streak alive.</p>
            </div>

            <div>
              <Zap size={19} />
              <p>Push one module above 80% progress today.</p>
            </div>

            <div>
              <Trophy size={19} />
              <p>Unlock your next badge by completing more items.</p>
            </div>
          </div>
        </article>

        <article className="dashboard-activity-console glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Recent Matrix Items</p>
              <h2>Continue where you left off</h2>
            </div>

            <span>{recentActivity.length} items</span>
          </div>

          <div className="dashboard-activity-list">
            {recentActivity.map((item, index) => {
              const Icon = item.icon

              return (
                <div className="dashboard-activity-item" key={`${item.title}-${index}`}>
                  <div className="dashboard-activity-icon">
                    <Icon size={19} />
                  </div>

                  <div>
                    <p>{item.type}</p>
                    <h3>{item.title}</h3>
                  </div>

                  <strong>{Number(item.progress) || 0}%</strong>
                </div>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}

export default Dashboard
