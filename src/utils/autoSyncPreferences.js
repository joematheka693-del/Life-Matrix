export const defaultAutoSyncPreferences = {
  enabled: false,
  intervalMinutes: 5,
  syncOnLoad: false,
  syncAfterChanges: true,
}

export function getAutoSyncPreferences() {
  try {
    const saved = localStorage.getItem('life_matrix_auto_sync_preferences')
    return saved
      ? {
          ...defaultAutoSyncPreferences,
          ...JSON.parse(saved),
        }
      : defaultAutoSyncPreferences
  } catch {
    return defaultAutoSyncPreferences
  }
}

export function saveAutoSyncPreferences(preferences) {
  localStorage.setItem(
    'life_matrix_auto_sync_preferences',
    JSON.stringify({
      ...defaultAutoSyncPreferences,
      ...preferences,
    })
  )
}

export function getLastSyncMeta() {
  try {
    const saved = localStorage.getItem('life_matrix_last_sync_meta')
    return saved
      ? JSON.parse(saved)
      : {
          status: 'Never synced',
          lastSyncedAt: '',
          message: 'No cloud sync has been completed yet.',
        }
  } catch {
    return {
      status: 'Unknown',
      lastSyncedAt: '',
      message: 'Unable to read sync status.',
    }
  }
}

export function saveLastSyncMeta(meta) {
  localStorage.setItem(
    'life_matrix_last_sync_meta',
    JSON.stringify({
      status: meta.status || 'Unknown',
      lastSyncedAt: meta.lastSyncedAt || '',
      message: meta.message || '',
    })
  )
}

export function formatSyncTime(value) {
  if (!value) {
    return 'Not yet'
  }

  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}
