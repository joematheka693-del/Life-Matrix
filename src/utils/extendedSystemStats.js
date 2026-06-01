import { getMatrixStats } from './matrixStats.js'

export function readLocalArray(key) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : []
  } catch {
    return []
  }
}

function average(items, key) {
  if (!items.length) {
    return 0
  }

  const total = items.reduce((sum, item) => sum + Number(item[key] || 0), 0)
  return Math.round(total / items.length)
}

export function getExtendedSystemStats(lifeData = {}) {
  const core = getMatrixStats(lifeData)

  const habits = readLocalArray('life_matrix_habits')
  const planner = readLocalArray('life_matrix_planner')
  const notes = readLocalArray('life_matrix_notes')
  const mood = readLocalArray('life_matrix_mood')
  const projects = readLocalArray('life_matrix_projects')
  const resources = readLocalArray('life_matrix_resources')
  const reviews = readLocalArray('life_matrix_reviews')
  const finance = readLocalArray('life_matrix_finance')
  const skills = readLocalArray('life_matrix_skills')
  const decisions = readLocalArray('life_matrix_decisions')
  const launch = readLocalArray('life_matrix_launch')

  const habitDone = habits.filter((item) => item.completedToday).length
  const habitScore = habits.length ? Math.round((habitDone / habits.length) * 100) : 0

  const plannerDone = planner.filter((item) => item.completed).length
  const plannerScore = planner.length ? Math.round((plannerDone / planner.length) * 100) : 0

  const moodScore = average(mood, 'energy')
  const projectScore = average(projects, 'progress')
  const skillScore = average(skills, 'level')
  const reviewScore = reviews.length ? Math.round(average(reviews, 'rating') * 10) : 0

  const income = finance
    .filter((item) => item.type === 'Income')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  const expenses = finance
    .filter((item) => item.type === 'Expense')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0)

  const financeBalance = income - expenses
  const financeScore = income > 0 ? Math.max(0, Math.min(100, Math.round((financeBalance / income) * 100))) : 0

  const launchDone = launch.filter((item) => item.done).length
  const launchScore = launch.length ? Math.round((launchDone / launch.length) * 100) : 0

  const notesScore = Math.min(100, notes.length * 10)
  const resourcesScore = Math.min(100, resources.length * 10)
  const decisionsScore = Math.min(100, decisions.length * 15)

  const extendedModules = [
    {
      key: 'core',
      name: 'Core Matrix',
      route: '/dashboard',
      count: core.totalItems,
      score: core.overallProgress,
      detail: 'Goals, workouts, studying, reading, and watchlist.',
    },
    {
      key: 'habits',
      name: 'Habits',
      route: '/habits',
      count: habits.length,
      score: habitScore,
      detail: `${habitDone} completed today.`,
    },
    {
      key: 'planner',
      name: 'Planner',
      route: '/planner',
      count: planner.length,
      score: plannerScore,
      detail: `${plannerDone} plans completed.`,
    },
    {
      key: 'mood',
      name: 'Mood',
      route: '/mood',
      count: mood.length,
      score: moodScore,
      detail: 'Average energy score.',
    },
    {
      key: 'projects',
      name: 'Projects',
      route: '/projects',
      count: projects.length,
      score: projectScore,
      detail: 'Average project progress.',
    },
    {
      key: 'skills',
      name: 'Skills',
      route: '/skills',
      count: skills.length,
      score: skillScore,
      detail: 'Average learning level.',
    },
    {
      key: 'finance',
      name: 'Finance',
      route: '/finance',
      count: finance.length,
      score: financeScore,
      detail: `Balance: KSh ${financeBalance}.`,
    },
    {
      key: 'review',
      name: 'Review',
      route: '/review',
      count: reviews.length,
      score: reviewScore,
      detail: 'Weekly review rating converted to percentage.',
    },
    {
      key: 'notes',
      name: 'Notes',
      route: '/notes',
      count: notes.length,
      score: notesScore,
      detail: 'Journal and idea vault activity.',
    },
    {
      key: 'resources',
      name: 'Resources',
      route: '/resources',
      count: resources.length,
      score: resourcesScore,
      detail: 'Saved learning resources.',
    },
    {
      key: 'decisions',
      name: 'Decisions',
      route: '/decisions',
      count: decisions.length,
      score: decisionsScore,
      detail: 'Structured comparison logs.',
    },
    {
      key: 'launch',
      name: 'Launch',
      route: '/launch',
      count: launch.length,
      score: launchScore,
      detail: `${launchDone} launch checks completed.`,
    },
  ]

  const activeModules = extendedModules.filter((module) => module.count > 0)
  const totalExtendedItems = extendedModules.reduce((sum, module) => sum + module.count, 0)
  const systemScore = extendedModules.length
    ? Math.round(
        extendedModules.reduce((sum, module) => sum + Math.min(100, Number(module.score) || 0), 0) /
          extendedModules.length
      )
    : 0

  const strongest = [...extendedModules].sort((a, b) => b.score - a.score)[0]
  const weakest = [...extendedModules].sort((a, b) => a.score - b.score)[0]

  const recommendations = []

  if (weakest) {
    recommendations.push({
      title: `Improve ${weakest.name}`,
      text: `${weakest.name} is currently your weakest system area at ${weakest.score}%.`,
      route: weakest.route,
    })
  }

  if (!habits.length) {
    recommendations.push({
      title: 'Add daily habits',
      text: 'Habits are empty. Add at least three simple daily routines.',
      route: '/habits',
    })
  }

  if (!planner.length) {
    recommendations.push({
      title: 'Plan your week',
      text: 'Planner has no tasks. Add study, project, and workout blocks.',
      route: '/planner',
    })
  }

  if (!reviews.length) {
    recommendations.push({
      title: 'Write a weekly review',
      text: 'Weekly reviews help you improve the whole system.',
      route: '/review',
    })
  }

  if (!launch.length || launchScore < 100) {
    recommendations.push({
      title: 'Finish launch checks',
      text: 'Use the Launch page before deploying or presenting.',
      route: '/launch',
    })
  }

  return {
    core,
    systemScore,
    totalExtendedItems,
    activeModules: activeModules.length,
    strongest,
    weakest,
    extendedModules,
    recommendations: recommendations.slice(0, 5),
    raw: {
      habits,
      planner,
      notes,
      mood,
      projects,
      resources,
      reviews,
      finance,
      skills,
      decisions,
      launch,
      income,
      expenses,
      financeBalance,
    },
  }
}
