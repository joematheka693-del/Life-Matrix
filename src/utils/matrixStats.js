export function getAverageProgress(items = []) {
  if (!items.length) {
    return 0
  }

  return Math.round(
    items.reduce((sum, item) => sum + (Number(item.progress) || 0), 0) /
      items.length
  )
}

export function getMatrixStats(lifeData = {}) {
  const goals = lifeData.goals || []
  const workouts = lifeData.workouts || []
  const studying = lifeData.studying || []
  const reading = lifeData.reading || []
  const watchlist = lifeData.watchlist || []
  const user = lifeData.user || {}

  const allTrackedItems = [
    ...goals,
    ...workouts,
    ...studying,
    ...reading,
    ...watchlist,
  ]

  const totalItems = allTrackedItems.length

  const completedGoals = goals.filter((goal) => goal.completed || Number(goal.progress) >= 100)
  const completedWorkouts = workouts.filter(
    (workout) => workout.completed || Number(workout.progress) >= 100
  )
  const completedStudy = studying.filter((item) => Number(item.progress) >= 100)
  const completedReading = reading.filter((item) => Number(item.progress) >= 100)
  const completedWatchlist = watchlist.filter((item) => Number(item.progress) >= 100)

  const completedItems =
    completedGoals.length +
    completedWorkouts.length +
    completedStudy.length +
    completedReading.length +
    completedWatchlist.length

  const overallProgress = getAverageProgress(allTrackedItems)

  const moduleProgress = {
    goals: getAverageProgress(goals),
    workouts: getAverageProgress(workouts),
    studying: getAverageProgress(studying),
    reading: getAverageProgress(reading),
    watchlist: getAverageProgress(watchlist),
  }

  const baseXp = totalItems * 20
  const completedXp = completedItems * 80
  const streakXp = (Number(user.streak) || 0) * 10
  const progressXp = overallProgress * 5
  const calculatedXp = Math.round(baseXp + completedXp + streakXp + progressXp)

  const level = Math.max(1, Math.floor(calculatedXp / 300) + 1)
  const currentLevelXp = calculatedXp % 300
  const nextLevelXp = 300
  const levelProgress = Math.min(100, Math.round((currentLevelXp / nextLevelXp) * 100))

  let calculatedRank = 'Rank E'

  if (calculatedXp >= 3000) {
    calculatedRank = 'Shadow Monarch'
  } else if (calculatedXp >= 2200) {
    calculatedRank = 'Rank S'
  } else if (calculatedXp >= 1500) {
    calculatedRank = 'Rank A'
  } else if (calculatedXp >= 950) {
    calculatedRank = 'Rank B'
  } else if (calculatedXp >= 500) {
    calculatedRank = 'Rank C'
  } else if (calculatedXp >= 200) {
    calculatedRank = 'Rank D'
  }

  const badges = [
    {
      id: 'first-step',
      title: 'First Step',
      text: 'Add at least one item to your Life Matrix.',
      unlocked: totalItems >= 1,
    },
    {
      id: 'builder',
      title: 'Matrix Builder',
      text: 'Track at least 10 items across your system.',
      unlocked: totalItems >= 10,
    },
    {
      id: 'goal-slayer',
      title: 'Goal Slayer',
      text: 'Complete at least 3 goals.',
      unlocked: completedGoals.length >= 3,
    },
    {
      id: 'training-arc',
      title: 'Training Arc',
      text: 'Complete at least 3 workouts.',
      unlocked: completedWorkouts.length >= 3,
    },
    {
      id: 'knowledge-core',
      title: 'Knowledge Core',
      text: 'Complete at least 2 study paths.',
      unlocked: completedStudy.length >= 2,
    },
    {
      id: 'library-master',
      title: 'Library Master',
      text: 'Complete at least 3 reading items.',
      unlocked: completedReading.length >= 3,
    },
    {
      id: 'watch-master',
      title: 'Watch Master',
      text: 'Complete at least 3 watchlist items.',
      unlocked: completedWatchlist.length >= 3,
    },
    {
      id: 'consistency',
      title: 'Consistency Badge',
      text: 'Reach a 7 day streak.',
      unlocked: Number(user.streak) >= 7,
    },
    {
      id: 'high-progress',
      title: 'High Progress',
      text: 'Reach 80% average system progress.',
      unlocked: overallProgress >= 80,
    },
    {
      id: 'shadow-path',
      title: 'Shadow Path',
      text: 'Reach Rank S or above.',
      unlocked: calculatedRank === 'Rank S' || calculatedRank === 'Shadow Monarch',
    },
  ]

  const unlockedBadges = badges.filter((badge) => badge.unlocked)
  const lockedBadges = badges.filter((badge) => !badge.unlocked)

  return {
    totalItems,
    completedItems,
    overallProgress,
    moduleProgress,
    calculatedXp,
    level,
    currentLevelXp,
    nextLevelXp,
    levelProgress,
    calculatedRank,
    badges,
    unlockedBadges,
    lockedBadges,
    completed: {
      goals: completedGoals.length,
      workouts: completedWorkouts.length,
      studying: completedStudy.length,
      reading: completedReading.length,
      watchlist: completedWatchlist.length,
    },
  }
}
