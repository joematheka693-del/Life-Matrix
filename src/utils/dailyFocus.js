import { getMatrixInsights } from './matrixInsights.js'

function getLowProgressItem(items = []) {
  return [...items]
    .filter((item) => Number(item.progress) < 100)
    .sort((a, b) => (Number(a.progress) || 0) - (Number(b.progress) || 0))[0]
}

function getNearCompleteItem(items = []) {
  return [...items]
    .filter((item) => Number(item.progress) >= 70 && Number(item.progress) < 100)
    .sort((a, b) => (Number(b.progress) || 0) - (Number(a.progress) || 0))[0]
}

export function getDailyFocus(lifeData = {}) {
  const insights = getMatrixInsights(lifeData)
  const stats = insights.stats

  const goals = lifeData.goals || []
  const workouts = lifeData.workouts || []
  const studying = lifeData.studying || []
  const reading = lifeData.reading || []
  const watchlist = lifeData.watchlist || []
  const user = lifeData.user || {}

  const weakestModule = insights.weakestModule
  const nearGoal = getNearCompleteItem(goals)
  const nearReading = getNearCompleteItem(reading)
  const nearWatch = getNearCompleteItem(watchlist)
  const lowGoal = getLowProgressItem(goals)
  const lowStudy = getLowProgressItem(studying)
  const lowWorkout = getLowProgressItem(workouts)

  const focusTasks = []

  if (weakestModule) {
    focusTasks.push({
      title: `Improve ${weakestModule.name}`,
      text: `This is your weakest module at ${weakestModule.progress}%. Add or update one item there today.`,
      route: weakestModule.route,
      priority: 'High',
      category: 'Weak Module',
    })
  }

  if (nearGoal) {
    focusTasks.push({
      title: `Finish goal: ${nearGoal.title}`,
      text: `This goal is already at ${nearGoal.progress}%. Push it to 100%.`,
      route: '/goals',
      priority: 'High',
      category: 'Near Complete',
    })
  } else if (lowGoal) {
    focusTasks.push({
      title: `Push goal: ${lowGoal.title}`,
      text: `This goal is only at ${lowGoal.progress || 0}%. Move it above 50%.`,
      route: '/goals',
      priority: 'Medium',
      category: 'Goal',
    })
  }

  if (nearReading) {
    focusTasks.push({
      title: `Continue reading: ${nearReading.title}`,
      text: `You are close to completing this reading item.`,
      route: '/reading',
      priority: 'Medium',
      category: 'Reading',
    })
  }

  if (nearWatch) {
    focusTasks.push({
      title: `Finish watch item: ${nearWatch.title}`,
      text: `Complete this title to raise your Matrix score.`,
      route: '/watchlist',
      priority: 'Medium',
      category: 'Watchlist',
    })
  }

  if (lowStudy) {
    focusTasks.push({
      title: `Study: ${lowStudy.title}`,
      text: `This learning path needs progress. Add one focused study session.`,
      route: '/studying',
      priority: 'Medium',
      category: 'Study',
    })
  }

  if (lowWorkout) {
    focusTasks.push({
      title: `Train: ${lowWorkout.title}`,
      text: `Update this workout after your next session.`,
      route: '/workouts',
      priority: 'Low',
      category: 'Fitness',
    })
  }

  if (!focusTasks.length) {
    focusTasks.push(
      {
        title: 'Add your first goal',
        text: 'Start your Life Matrix by creating a mission.',
        route: '/goals',
        priority: 'High',
        category: 'Start',
      },
      {
        title: 'Add a workout',
        text: 'Create one workout plan to begin tracking fitness.',
        route: '/workouts',
        priority: 'Medium',
        category: 'Fitness',
      },
      {
        title: 'Add a study path',
        text: 'Track one course, coding skill, or subject.',
        route: '/studying',
        priority: 'Medium',
        category: 'Learning',
      }
    )
  }

  const dailyScore = Math.min(
    100,
    Math.round(
      stats.overallProgress * 0.45 +
        stats.levelProgress * 0.25 +
        Math.min(30, (Number(user.streak) || 0) * 3)
    )
  )

  const focusSummary = {
    dailyScore,
    streak: Number(user.streak) || 0,
    rank: stats.calculatedRank,
    level: stats.level,
    xp: stats.calculatedXp,
    weakestModule: weakestModule?.name || 'None',
    strongestModule: insights.strongestModule?.name || 'None',
  }

  return {
    focusTasks: focusTasks.slice(0, 5),
    focusSummary,
  }
}
