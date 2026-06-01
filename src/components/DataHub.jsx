import {
  Archive,
  CheckCircle2,
  DatabaseBackup,
  Download,
  FileJson,
  RefreshCcw,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'
import {
  LIFE_MATRIX_STORAGE_KEYS,
  buildFullBackupPayload,
  getStorageSnapshot,
  restoreFullBackupPayload,
} from '../utils/storageKeys.js'

function DataHub() {
  const { lifeData, resetLifeData } = useLifeData()
  const snapshot = getStorageSnapshot()

  const totalStoredModules = snapshot.filter((item) => item.exists).length
  const totalRecords = snapshot.reduce((sum, item) => sum + item.count, 0)
  const totalSize = snapshot.reduce((sum, item) => sum + item.size, 0)

  const downloadJson = (filename, payload) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = filename
    link.click()

    URL.revokeObjectURL(url)
  }

  const exportFullBackup = () => {
    downloadJson('life-matrix-full-system-backup.json', buildFullBackupPayload())
  }

  const exportLifeDataOnly = () => {
    downloadJson('life-matrix-main-data-only.json', {
      app: 'Life Matrix',
      version: 'Phase 8.6',
      exportedAt: new Date().toISOString(),
      modules: {
        life_matrix_data: lifeData,
      },
    })
  }

  const exportStorageMap = () => {
    downloadJson('life-matrix-storage-map.json', {
      app: 'Life Matrix',
      version: 'Phase 8.6',
      exportedAt: new Date().toISOString(),
      snapshot,
    })
  }

  const importBackup = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      try {
        const payload = JSON.parse(reader.result)

        restoreFullBackupPayload(payload)

        alert('Backup restored successfully. The app will reload now.')
        window.location.reload()
      } catch (error) {
        alert(error.message || 'Invalid backup file')
      }
    }

    reader.readAsText(file)
  }

  const clearModule = (key) => {
    const confirmed = window.confirm(`Clear ${key}?`)

    if (!confirmed) {
      return
    }

    localStorage.removeItem(key)
    window.location.reload()
  }

  const clearAllExtraModules = () => {
    const confirmed = window.confirm(
      'Clear all extra modules except the main LifeData? Export a backup first.'
    )

    if (!confirmed) {
      return
    }

    LIFE_MATRIX_STORAGE_KEYS.filter((item) => item.key !== 'life_matrix_data').forEach((item) => {
      localStorage.removeItem(item.key)
    })

    window.location.reload()
  }

  const resetMainData = () => {
    const confirmed = window.confirm(
      'Reset main Life Matrix data? This affects goals, workouts, studying, reading, watchlist, profile, and settings.'
    )

    if (confirmed) {
      resetLifeData()
    }
  }

  return (
    <section className="data-hub-section expanded-data-hub section-gap">
      <div className="data-hub-hero glass-card">
        <div>
          <p className="page-kicker">Data Hub 8.6</p>
          <h2>Full backup and restore expansion</h2>
          <p>
            Export and restore every Life Matrix storage module: main LifeData,
            habits, planner, notes, mood, projects, resources, reviews, finance,
            skills, decisions, launch checklist, and focus sessions.
          </p>
        </div>

        <div className="data-hub-score">
          <DatabaseBackup size={34} />
          <span>Stored Modules</span>
          <strong>{totalStoredModules}</strong>
        </div>
      </div>

      <div className="data-hub-grid">
        <article className="data-hub-card glass-card">
          <div className="data-hub-card-icon">
            <Download size={24} />
          </div>

          <h3>Full System Backup</h3>
          <p>
            Exports all known localStorage keys into one structured backup file.
          </p>

          <button type="button" className="btn-life" onClick={exportFullBackup}>
            <Download size={18} />
            Export Everything
          </button>
        </article>

        <article className="data-hub-card glass-card">
          <div className="data-hub-card-icon">
            <FileJson size={24} />
          </div>

          <h3>Main Data Only</h3>
          <p>
            Exports only the core LifeDataContext data for safer small backups.
          </p>

          <button type="button" className="btn-life" onClick={exportLifeDataOnly}>
            <FileJson size={18} />
            Export Main Data
          </button>
        </article>

        <article className="data-hub-card glass-card">
          <div className="data-hub-card-icon">
            <Archive size={24} />
          </div>

          <h3>Storage Map</h3>
          <p>
            Exports a quick report showing which modules currently have data.
          </p>

          <button type="button" className="btn-life" onClick={exportStorageMap}>
            <Archive size={18} />
            Export Storage Map
          </button>
        </article>

        <article className="data-hub-card glass-card">
          <div className="data-hub-card-icon">
            <Upload size={24} />
          </div>

          <h3>Restore Backup</h3>
          <p>
            Import a full backup or main-data-only backup. The app reloads after
            restore.
          </p>

          <label className="data-hub-upload-btn">
            <Upload size={18} />
            Import Backup
            <input type="file" accept="application/json" onChange={importBackup} />
          </label>
        </article>
      </div>

      <div className="data-summary-grid section-gap">
        <article className="data-summary-card">
          <ShieldCheck size={22} />
          <p>Modules Stored</p>
          <h3>{totalStoredModules}</h3>
          <span>Out of {LIFE_MATRIX_STORAGE_KEYS.length}</span>
        </article>

        <article className="data-summary-card">
          <CheckCircle2 size={22} />
          <p>Total Records</p>
          <h3>{totalRecords}</h3>
          <span>Across local modules</span>
        </article>

        <article className="data-summary-card">
          <DatabaseBackup size={22} />
          <p>Storage Size</p>
          <h3>{totalSize}</h3>
          <span>Approx. characters</span>
        </article>

        <article className="data-summary-card">
          <RefreshCcw size={22} />
          <p>Restore Mode</p>
          <h3>JSON</h3>
          <span>Local import/export</span>
        </article>
      </div>

      <article className="storage-module-table glass-card section-gap">
        <div className="dashboard-card-header">
          <div>
            <p className="page-kicker">Storage Modules</p>
            <h2>Backup coverage map</h2>
          </div>

          <DatabaseBackup size={22} />
        </div>

        <div className="storage-module-list">
          {snapshot.map((item) => (
            <div className={item.exists ? 'storage-module-row active' : 'storage-module-row'} key={item.key}>
              <div>
                <span>{item.label}</span>
                <small>{item.key}</small>
              </div>

              <strong>{item.exists ? `${item.count} records` : 'Empty'}</strong>

              <a href={item.route}>Open</a>

              <button type="button" onClick={() => clearModule(item.key)}>
                <Trash2 size={15} />
                Clear
              </button>
            </div>
          ))}
        </div>
      </article>

      <article className="data-danger-zone glass-card">
        <div>
          <p className="page-kicker">Danger Zone</p>
          <h2>Reset local data</h2>
          <p>
            Export a full backup before clearing anything. These actions affect
            browser localStorage on this device only.
          </p>
        </div>

        <div className="data-danger-actions">
          <button type="button" onClick={clearAllExtraModules}>
            <Trash2 size={17} />
            Clear Extra Modules
          </button>

          <button type="button" onClick={resetMainData}>
            <Trash2 size={17} />
            Reset Main Data
          </button>
        </div>
      </article>
    </section>
  )
}

export default DataHub
