import { readLocalArray } from './extendedSystemStats.js'
import { getReminderPreferences, isReminderTypeEnabled } from './reminderPreferences.js'

function todayLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function parseNumber(value) {
  return Number(value) || 0
}

function addReminder(reminders, reminder) {
  const preferences = getReminderPreferences()

  if (preferences.quietMode) {
    return
  }

  if (!isReminderTypeEnabled(reminder.type)) {
    return
  }

  reminders.push(reminder)
}

export function getReminderEngineData() {
  const planner = readLocalArray('life_matrix_planner')
  const habits = readLocalArray('life_matrix_habits')
  const projects = readLocalArray('life_matrix_projects')
  const skills = readLocalArray('life_matrix_skills')
  const finance = readLocalArray('life_matrix_finance')
  const reviews = readLocalArray('life_matrix_reviews')
  const launch = readLocalArray('life_matrix_launch')
  const focusSessions = parseNumber(localStorage.getItem('life_matrix_focus_sessions'))

  const reminders = []

  const activePlans = planner.filter((item) => !item.completed)
  const highPriorityPlans = activePlans.filter((item) => item.priority === 'High')

  if (highPriorityPlans.length) {
    addReminder(reminders, {
      id: 'planner-high',
      type: 'Planner',
      priority: 'High',
      title: `${highPriorityPlans.length} high-priority plans waiting`,
      text: 'Open Planner and finish the most urgent tasks first.',
      route: '/planner',
    })
  } else if (activePlans.length) {
    addReminder(reminders, {
      id: 'planner-active',
      type: 'Planner',
      priority: 'Medium',
      title: `${activePlans.length} active plans pending`,
      text: 'Review today’s schedule and mark completed tasks.',
      route: '/planner',
    })
  }

  const pendingHabits = habits.filter((item) => !item.completedToday)

  if (pendingHabits.length) {
    addReminder(reminders, {
      id: 'habits-pending',
      type: 'Habits',
      priority: 'High',
      title: `${pendingHabits.length} habits not completed today`,
      text: 'Complete your daily routines before the day ends.',
      route: '/habits',
    })
  }

  const weakProjects = projects.filter((item) => parseNumber(item.progress) < 50)

  if (weakProjects.length) {
    addReminder(reminders, {
      id: 'projects-weak',
      type: 'Projects',
      priority: 'Medium',
      title: `${weakProjects.length} projects below 50% progress`,
      text: 'Move one important project forward by at least 10%.',
      route: '/projects',
    })
  }

  const weakSkills = skills.filter((item) => parseNumber(item.level) < 50)

  if (weakSkills.length) {
    addReminder(reminders, {
      id: 'skills-weak',
      type: 'Skills',
      priority: 'Medium',
      title: `${weakSkills.length} skills need more practice`,
      text: 'Choose one skill and schedule a focused learning block.',
      route: '/skills',
    })
  }

  const income = finance
    .filter((item) => item.type === 'Income')
    .reduce((sum, item) => sum + parseNumber(item.amount), 0)

  const expenses = finance
    .filter((item) => item.type === 'Expense')
    .reduce((sum, item) => sum + parseNumber(item.amount), 0)

  if (expenses > income && finance.length) {
    addReminder(reminders, {
      id: 'finance-negative',
      type: 'Finance',
      priority: 'High',
      title: 'Expenses are above income',
      text: 'Check Finance and reduce spending or add an income target.',
      route: '/finance',
    })
  } else if (!finance.length) {
    addReminder(reminders, {
      id: 'finance-empty',
      type: 'Finance',
      priority: 'Low',
      title: 'Finance tracker is empty',
      text: 'Add your first income or expense record.',
      route: '/finance',
    })
  }

  if (!reviews.length) {
    addReminder(reminders, {
      id: 'review-empty',
      type: 'Review',
      priority: 'Medium',
      title: 'No weekly review written yet',
      text: 'Write one weekly reflection to track your growth.',
      route: '/review',
    })
  }

  const pendingLaunch = launch.filter((item) => !item.done)

  if (pendingLaunch.length) {
    addReminder(reminders, {
      id: 'launch-pending',
      type: 'Launch',
      priority: 'Medium',
      title: `${pendingLaunch.length} launch checks still pending`,
      text: 'Complete launch checks before hosting or presenting.',
      route: '/launch',
    })
  }

  if (focusSessions < 1) {
    addReminder(reminders, {
      id: 'focus-zero',
      type: 'Focus',
      priority: 'Low',
      title: 'No focus sessions completed',
      text: 'Start one Pomodoro session from the Dashboard.',
      route: '/dashboard',
    })
  }

  const priorityWeight = {
    High: 3,
    Medium: 2,
    Low: 1,
  }

  const sortedReminders = reminders.sort(
    (a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]
  )

  return {
    today: todayLabel(),
    reminders: sortedReminders,
    high: sortedReminders.filter((item) => item.priority === 'High').length,
    medium: sortedReminders.filter((item) => item.priority === 'Medium').length,
    low: sortedReminders.filter((item) => item.priority === 'Low').length,
    planner,
    habits,
    projects,
    skills,
    finance,
    reviews,
    launch,
    focusSessions,
    preferences: getReminderPreferences(),
  }
}
