import {
  Cloud,
  CloudOff,
  RefreshCcw,
  Save,
  ShieldCheck,
  Timer,
  Zap,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext.jsx'
import { formatSyncTime } from '../utils/autoSyncPreferences.js'
import { useAutoSync } from '../hooks/useAutoSync.js'

function AutoSyncPanel() {
  const { isAuthenticated, authUser } = useAuth()
  const {
    preferences,
    syncMeta,
    syncing,
    updatePreferences,
    runCloudPush,
  } = useAutoSync()

  return (
    <section className="auto-sync-panel section-gap">
      <div className="auto-sync-hero glass-card">
        <div>
          <p className="page-kicker">Auto Cloud Sync</p>
          <h2>Keep Life Matrix backed up to your Flask backend.</h2>
          <p>
            Auto-sync watches your local modules and pushes a full backup to the
            protected backend route. It only works after login because it uses
            your JWT token.
          </p>
        </div>

        <div className={isAuthenticated ? 'auto-sync-status ready' : 'auto-sync-status blocked'}>
          {isAuthenticated ? <Cloud size={34} /> : <CloudOff size={34} />}
          <span>{isAuthenticated ? 'Authenticated' : 'Login Required'}</span>
          <strong>{authUser?.username || 'No User'}</strong>
        </div>
      </div>

      <div className="auto-sync-grid">
        <article className="auto-sync-card glass-card">
          <ShieldCheck size={24} />
          <h3>Sync Status</h3>
          <p>{syncMeta.message}</p>

          <div className="auto-sync-meta">
            <span>Status</span>
            <strong>{syncMeta.status}</strong>
          </div>

          <div className="auto-sync-meta">
            <span>Last Synced</span>
            <strong>{formatSyncTime(syncMeta.lastSyncedAt)}</strong>
          </div>

          <button
            type="button"
            className="btn-life"
            onClick={() => runCloudPush('Manual cloud sync')}
            disabled={syncing}
          >
            <RefreshCcw size={18} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </article>

        <article className="auto-sync-card glass-card">
          <Zap size={24} />
          <h3>Auto Sync Controls</h3>
          <p>
            Enable this only after your backend is stable. The app checks for
            local changes at your selected interval.
          </p>

          <label className="auto-sync-toggle">
            <div>
              <strong>Enable Auto Sync</strong>
              <span>{preferences.enabled ? 'Cloud auto-sync active' : 'Cloud auto-sync off'}</span>
            </div>

            <input
              type="checkbox"
              checked={preferences.enabled}
              onChange={() => updatePreferences({ enabled: !preferences.enabled })}
            />
          </label>

          <label className="auto-sync-toggle">
            <div>
              <strong>Sync On Load</strong>
              <span>Push backup when the app opens.</span>
            </div>

            <input
              type="checkbox"
              checked={preferences.syncOnLoad}
              onChange={() => updatePreferences({ syncOnLoad: !preferences.syncOnLoad })}
            />
          </label>

          <label className="auto-sync-toggle">
            <div>
              <strong>Sync After Changes</strong>
              <span>Check localStorage and push changes.</span>
            </div>

            <input
              type="checkbox"
              checked={preferences.syncAfterChanges}
              onChange={() =>
                updatePreferences({ syncAfterChanges: !preferences.syncAfterChanges })
              }
            />
          </label>
        </article>

        <article className="auto-sync-card glass-card">
          <Timer size={24} />
          <h3>Sync Interval</h3>
          <p>
            Lower interval means faster backups but more backend requests.
          </p>

          <label className="auto-sync-field">
            Interval in minutes
            <input
              type="number"
              min="1"
              max="60"
              value={preferences.intervalMinutes}
              onChange={(event) =>
                updatePreferences({
                  intervalMinutes: Number(event.target.value) || 5,
                })
              }
            />
          </label>

          <div className="auto-sync-note">
            <Save size={18} />
            <span>Preferences save automatically to localStorage.</span>
          </div>
        </article>
      </div>
    </section>
  )
}

export default AutoSyncPanel
