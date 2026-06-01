export const LIFE_MATRIX_STORAGE_KEYS = [
  {
    key: 'life_matrix_data',
    label: 'Main LifeData',
    route: '/dashboard',
  },
  {
    key: 'life_matrix_habits',
    label: 'Habits',
    route: '/habits',
  },
  {
    key: 'life_matrix_planner',
    label: 'Planner',
    route: '/planner',
  },
  {
    key: 'life_matrix_notes',
    label: 'Notes',
    route: '/notes',
  },
  {
    key: 'life_matrix_mood',
    label: 'Mood',
    route: '/mood',
  },
  {
    key: 'life_matrix_projects',
    label: 'Projects',
    route: '/projects',
  },
  {
    key: 'life_matrix_resources',
    label: 'Resources',
    route: '/resources',
  },
  {
    key: 'life_matrix_reviews',
    label: 'Weekly Reviews',
    route: '/review',
  },
  {
    key: 'life_matrix_finance',
    label: 'Finance',
    route: '/finance',
  },
  {
    key: 'life_matrix_skills',
    label: 'Skills',
    route: '/skills',
  },
  {
    key: 'life_matrix_decisions',
    label: 'Decisions',
    route: '/decisions',
  },
  {
    key: 'life_matrix_launch',
    label: 'Launch Checklist',
    route: '/launch',
  },
  {
    key: 'life_matrix_focus_sessions',
    label: 'Focus Sessions',
    route: '/dashboard',
  },
]

export function safeReadStorageValue(key) {
  try {
    const value = localStorage.getItem(key)

    if (value === null) {
      return null
    }

    return JSON.parse(value)
  } catch {
    return localStorage.getItem(key)
  }
}

export function safeWriteStorageValue(key, value) {
  if (value === undefined) {
    return
  }

  if (typeof value === 'string') {
    localStorage.setItem(key, value)
    return
  }

  localStorage.setItem(key, JSON.stringify(value))
}

export function getStorageSnapshot() {
  return LIFE_MATRIX_STORAGE_KEYS.map((item) => {
    const rawValue = localStorage.getItem(item.key)
    const parsedValue = safeReadStorageValue(item.key)

    let count = 0

    if (Array.isArray(parsedValue)) {
      count = parsedValue.length
    } else if (parsedValue && typeof parsedValue === 'object') {
      count = Object.keys(parsedValue).length
    } else if (parsedValue !== null) {
      count = 1
    }

    return {
      ...item,
      exists: rawValue !== null,
      count,
      size: rawValue ? rawValue.length : 0,
    }
  })
}

export function buildFullBackupPayload() {
  const modules = {}

  LIFE_MATRIX_STORAGE_KEYS.forEach((item) => {
    modules[item.key] = safeReadStorageValue(item.key)
  })

  return {
    app: 'Life Matrix',
    version: 'Phase 8.6',
    exportedAt: new Date().toISOString(),
    modules,
  }
}

export function restoreFullBackupPayload(payload) {
  if (!payload) {
    throw new Error('Backup file is empty.')
  }

  const modules = payload.modules || payload

  LIFE_MATRIX_STORAGE_KEYS.forEach((item) => {
    if (Object.prototype.hasOwnProperty.call(modules, item.key)) {
      safeWriteStorageValue(item.key, modules[item.key])
    }
  })
}
