export const defaultReminderPreferences = {
  browserNotifications: false,
  planner: true,
  habits: true,
  projects: true,
  skills: true,
  finance: true,
  review: true,
  launch: true,
  focus: true,
  quietMode: false,
}

export function getReminderPreferences() {
  try {
    const saved = localStorage.getItem('life_matrix_reminder_preferences')
    return saved
      ? {
          ...defaultReminderPreferences,
          ...JSON.parse(saved),
        }
      : defaultReminderPreferences
  } catch {
    return defaultReminderPreferences
  }
}

export function saveReminderPreferences(preferences) {
  localStorage.setItem(
    'life_matrix_reminder_preferences',
    JSON.stringify({
      ...defaultReminderPreferences,
      ...preferences,
    })
  )
}

export function isReminderTypeEnabled(type) {
  const preferences = getReminderPreferences()

  const map = {
    Planner: 'planner',
    Habits: 'habits',
    Projects: 'projects',
    Skills: 'skills',
    Finance: 'finance',
    Review: 'review',
    Launch: 'launch',
    Focus: 'focus',
  }

  const key = map[type]

  if (!key) {
    return true
  }

  return Boolean(preferences[key])
}

export function getNotificationPermissionState() {
  if (!('Notification' in window)) {
    return 'unsupported'
  }

  return Notification.permission
}

export async function requestBrowserNotificationPermission() {
  if (!('Notification' in window)) {
    return 'unsupported'
  }

  const result = await Notification.requestPermission()
  return result
}

export function sendTestNotification() {
  if (!('Notification' in window)) {
    alert('This browser does not support notifications.')
    return
  }

  if (Notification.permission !== 'granted') {
    alert('Allow notifications first.')
    return
  }

  new Notification('Life Matrix Reminder Test', {
    body: 'Your reminder system is ready.',
  })
}
