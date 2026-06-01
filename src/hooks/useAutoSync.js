import { useEffect, useRef, useState } from 'react'

import { useAuth } from '../context/AuthContext.jsx'
import { buildFullBackupPayload } from '../utils/storageKeys.js'
import {
  getAutoSyncPreferences,
  getLastSyncMeta,
  saveAutoSyncPreferences,
  saveLastSyncMeta,
} from '../utils/autoSyncPreferences.js'
import { syncApi } from '../services/syncApi.js'

function getTrackedStorageSignature() {
  const keys = [
    'life_matrix_data',
    'life_matrix_habits',
    'life_matrix_planner',
    'life_matrix_notes',
    'life_matrix_mood',
    'life_matrix_projects',
    'life_matrix_resources',
    'life_matrix_reviews',
    'life_matrix_finance',
    'life_matrix_skills',
    'life_matrix_decisions',
    'life_matrix_launch',
    'life_matrix_focus_sessions',
  ]

  return keys.map((key) => `${key}:${localStorage.getItem(key) || ''}`).join('|')
}

export function useAutoSync() {
  const { authToken, isAuthenticated } = useAuth()
  const [preferences, setPreferences] = useState(() => getAutoSyncPreferences())
  const [syncMeta, setSyncMeta] = useState(() => getLastSyncMeta())
  const [syncing, setSyncing] = useState(false)
  const signatureRef = useRef(getTrackedStorageSignature())
  const timerRef = useRef(null)

  const updatePreferences = (updates) => {
    setPreferences((prev) => {
      const next = {
        ...prev,
        ...updates,
      }

      saveAutoSyncPreferences(next)
      return next
    })
  }

  const runCloudPush = async (reason = 'Manual sync') => {
    if (!isAuthenticated || !authToken) {
      const meta = {
        status: 'Blocked',
        lastSyncedAt: syncMeta.lastSyncedAt,
        message: 'Login first before cloud syncing.',
      }

      setSyncMeta(meta)
      saveLastSyncMeta(meta)
      return meta
    }

    setSyncing(true)

    try {
      await syncApi.pushBackup(authToken, {
        ...buildFullBackupPayload(),
        syncReason: reason,
      })

      const meta = {
        status: 'Synced',
        lastSyncedAt: new Date().toISOString(),
        message: `${reason} completed successfully.`,
      }

      setSyncMeta(meta)
      saveLastSyncMeta(meta)
      signatureRef.current = getTrackedStorageSignature()

      return meta
    } catch (error) {
      const meta = {
        status: 'Failed',
        lastSyncedAt: syncMeta.lastSyncedAt,
        message: error.message || 'Cloud sync failed.',
      }

      setSyncMeta(meta)
      saveLastSyncMeta(meta)
      return meta
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    if (!preferences.enabled || !preferences.syncOnLoad) {
      return
    }

    runCloudPush('Auto sync on load')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferences.enabled, preferences.syncOnLoad])

  useEffect(() => {
    if (!preferences.enabled || !preferences.syncAfterChanges) {
      return undefined
    }

    const checkForChanges = () => {
      const currentSignature = getTrackedStorageSignature()

      if (currentSignature !== signatureRef.current) {
        runCloudPush('Auto sync after local changes')
      }
    }

    const interval = window.setInterval(checkForChanges, Math.max(1, preferences.intervalMinutes) * 60 * 1000)
    timerRef.current = interval

    return () => {
      window.clearInterval(interval)
      timerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    preferences.enabled,
    preferences.syncAfterChanges,
    preferences.intervalMinutes,
    authToken,
    isAuthenticated,
  ])

  return {
    preferences,
    syncMeta,
    syncing,
    updatePreferences,
    runCloudPush,
  }
}
