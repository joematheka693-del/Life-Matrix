import { getMatrixStats } from './matrixStats.js'

export function getModuleHealth(progress) {
  if (progress >= 80) return 'Excellent'
  if (progress >= 60) return 'Strong'
  if (progress >= 40) return 'Building'
  if (progress > 0) return 'Weak'
  return 'Empty'
}

export function getInsightTone(health) {
  if (health === 'Excellent') return 'success'
  if (health === 'Strong') return 'info'
  if (health === 'Building') return 'warning'
  if (health === 'Weak') return 'danger'
  return 'empty'
}

export function getMatrixInsights(lifeData = {}) {
  const stats = getMatrixStats(lifeData)

  const goals = lifeData.goals || []
  const workouts = lifeData.workouts || []
  const studying = lifeData.studying || []
  const reading = lifeData.reading || []
  const watchlist = lifeData.watchlist || []

  const modules = [
    {
      key: 'goals',
      name: 'Goals',
      count: goals.length,
      progress: stats.moduleProgress.goals,
      route: '/goals',
      suggestion:
        goals.length === 0
          ? 'Add your first mission so the system can start measuring your ambition.'
          : 'Push one important goal above 80% to increase your Matrix score.',
    },
    {
      key: 'workouts',
      name: 'Workouts',
      count: workouts.length,
      progress: stats.moduleProgress.workouts,
      route: '/workouts',
      suggestion:
        workouts.length === 0
          ? 'Add one workout plan to begin tracking fitness consistency.'
          : 'Update workout progress after every training session.',
    },
    {
      key: 'studying',
      name: 'Studying',
      count: studying.length,
      progress: stats.moduleProgress.studying,
      route: '/studying',
      suggestion:
        studying.length === 0
          ? 'Add one learning path, course, or skill you are currently building.'
          : 'Complete one study path before adding too many more.',
    },
    {
      key: 'reading',
      name: 'Reading',
      count: reading.length,
      progress: stats.moduleProgress.reading,
      route: '/reading',
      suggestion:
        reading.length === 0
          ? 'Add a manhwa, manga, novel, or book to build your reading matrix.'
          : 'Update your current chapter or page to keep your library accurate.',
    },
    {
      key: 'watchlist',
      name: 'Watchlist',
      count: watchlist.length,
      progress: stats.moduleProgress.watchlist,
      route: '/watchlist',
      suggestion:
        watchlist.length === 0
          ? 'Add an anime, movie, or series to begin tracking watch progress.'
          : 'Finish a near-complete title to unlock more XP.',
    },
  ].map((module) => {
    const health = getModuleHealth(module.progress)

    return {
      ...module,
      health,
      tone: getInsightTone(health),
    }
  })

  const weakestModule = [...modules].sort((a, b) => a.progress - b.progress)[0]
  const strongestModule = [...modules].sort((a, b) => b.progress - a.progress)[0]
  const emptyModules = modules.filter((module) => module.count === 0)
  const weakModules = modules.filter((module) => module.progress < 40 && module.count > 0)

  const recommendations = []

  if (emptyModules.length) {
    recommendations.push({
      title: 'Fill empty modules',
      text: `${emptyModules.map((module) => module.name).join(', ')} ${
        emptyModules.length === 1 ? 'is' : 'are'
      } still empty. Add at least one item there.`,
      tone: 'warning',
    })
  }

  if (weakModules.length) {
    recommendations.push({
      title: 'Improve weak modules',
      text: `${weakModules.map((module) => module.name).join(', ')} ${
        weakModules.length === 1 ? 'needs' : 'need'
      } progress above 40%.`,
      tone: 'danger',
    })
  }

  if (stats.overallProgress >= 80) {
    recommendations.push({
      title: 'High performance',
      text: 'Your overall progress is strong. Focus on completing items for badge unlocks.',
      tone: 'success',
    })
  } else {
    recommendations.push({
      title: 'Raise overall progress',
      text: `Your system average is ${stats.overallProgress}%. Push your weakest module first: ${weakestModule.name}.`,
      tone: 'info',
    })
  }

  if (stats.lockedBadges.length) {
    recommendations.push({
      title: 'Next badge target',
      text: `Next locked badge: ${stats.lockedBadges[0].title}. ${stats.lockedBadges[0].text}`,
      tone: 'info',
    })
  }

  const timeline = [
    ...goals.slice(0, 4).map((item) => ({
      title: item.title,
      type: 'Goal',
      progress: item.progress || 0,
      route: '/goals',
    })),
    ...workouts.slice(0, 4).map((item) => ({
      title: item.title,
      type: 'Workout',
      progress: item.progress || 0,
      route: '/workouts',
    })),
    ...studying.slice(0, 4).map((item) => ({
      title: item.title,
      type: 'Study',
      progress: item.progress || 0,
      route: '/studying',
    })),
    ...reading.slice(0, 4).map((item) => ({
      title: item.title,
      type: item.type || 'Reading',
      progress: item.progress || 0,
      route: '/reading',
    })),
    ...watchlist.slice(0, 4).map((item) => ({
      title: item.title,
      type: item.type || 'Watchlist',
      progress: item.progress || 0,
      route: '/watchlist',
    })),
  ]
    .sort((a, b) => Number(b.progress) - Number(a.progress))
    .slice(0, 10)

  return {
    stats,
    modules,
    weakestModule,
    strongestModule,
    recommendations,
    timeline,
  }
}
