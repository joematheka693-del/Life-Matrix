import { useState } from 'react'
import {
  Cloud,
  CloudOff,
  Database,
  Download,
  RefreshCcw,
  Server,
  ShieldCheck,
  Upload,
} from 'lucide-react'

import AutoSyncPanel from '../components/AutoSyncPanel.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { buildFullBackupPayload, restoreFullBackupPayload } from '../utils/storageKeys.js'
import { authApi, getApiBaseUrl } from '../services/authApi.js'
import { syncApi } from '../services/syncApi.js'

function Sync() {
  const { authToken, authUser, isAuthenticated } = useAuth()
  const [backendUrl, setBackendUrl] = useState(() => getApiBaseUrl())
  const [status, setStatus] = useState('Not tested yet')

  const saveConfig = () => {
    localStorage.setItem('life_matrix_backend_url', backendUrl)
    setStatus('Backend URL saved locally.')
  }

  const testConnection = async () => {
    setStatus('Testing backend...')

    try {
      const data = await authApi.health()
      setStatus(data.message || 'Backend health check passed.')
    } catch (error) {
      setStatus(error.message || 'Backend connection failed.')
    }
  }

  const exportPayload = () => {
    const payload = buildFullBackupPayload()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'life-matrix-sync-payload.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  const pushBackup = async () => {
    if (!isAuthenticated || !authToken) {
      setStatus('Login first before pushing backup.')
      return
    }

    setStatus('Pushing backup...')

    try {
      const data = await syncApi.pushBackup(authToken, buildFullBackupPayload())
      setStatus(data.message || 'Backup pushed successfully.')
    } catch (error) {
      setStatus(error.message || 'Push failed.')
    }
  }

  const pullBackup = async () => {
    if (!isAuthenticated || !authToken) {
      setStatus('Login first before pulling backup.')
      return
    }

    setStatus('Pulling backup...')

    try {
      const payload = await syncApi.pullBackup(authToken)

      restoreFullBackupPayload(payload)

      setStatus('Backup pulled and restored. Reloading...')
      setTimeout(() => window.location.reload(), 900)
    } catch (error) {
      setStatus(error.message || 'Pull failed.')
    }
  }

  return (
    <section className="page-shell sync-page">
      <div className="system-hero glass-card">
        <div>
          <p className="page-kicker">Backend Sync</p>
          <h1>Sync Life Matrix data with your Flask backend.</h1>
          <p>
            Manual sync and auto cloud sync now share the same protected JWT
            backend routes. Login first, confirm backend health, then push,
            pull, or enable auto-sync.
          </p>
        </div>

        <div className="system-hero-card">
          <Server size={42} />
          <span>Sync Status</span>
          <strong>{isAuthenticated ? 'Ready' : 'Login'}</strong>
          <p>{status}</p>
        </div>
      </div>

      <AutoSyncPanel />

      <div className="sync-grid section-gap">
        <article className="sync-card glass-card">
          <Database size={24} />
          <h3>Backend Config</h3>
          <p>Save your Flask backend URL. Current user: {authUser?.username || 'Not logged in'}.</p>

          <label>
            Backend URL
            <input value={backendUrl} onChange={(event) => setBackendUrl(event.target.value)} />
          </label>

          <button className="btn-life" type="button" onClick={saveConfig}>
            <ShieldCheck size={18} />
            Save Config
          </button>
        </article>

        <article className="sync-card glass-card">
          <Cloud size={24} />
          <h3>Manual Sync Tools</h3>
          <p>Use these after Flask is running and you are logged in.</p>

          <div className="sync-actions">
            <button type="button" className="btn-life" onClick={testConnection}>
              <RefreshCcw size={18} />
              Test Health
            </button>

            <button type="button" className="btn-soft-life" onClick={pushBackup}>
              <Upload size={18} />
              Push Backup
            </button>

            <button type="button" className="btn-soft-life" onClick={pullBackup}>
              <Download size={18} />
              Pull Backup
            </button>
          </div>
        </article>

        <article className="sync-card glass-card">
          <CloudOff size={24} />
          <h3>Offline Export</h3>
          <p>Export the same JSON payload that the backend sync endpoint receives.</p>

          <button type="button" className="btn-life" onClick={exportPayload}>
            <Download size={18} />
            Export Sync Payload
          </button>
        </article>
      </div>

      <article className="sync-blueprint glass-card section-gap">
        <p className="page-kicker">Protected Backend Routes</p>
        <h2>Connected routes</h2>

        <pre>{`GET  /api/health
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/sync/backup
GET  /api/sync/backup

Authorization header used:
Bearer <JWT_TOKEN>`}</pre>
      </article>
    </section>
  )
}

export default Sync
