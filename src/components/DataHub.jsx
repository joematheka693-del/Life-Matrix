import { Download, FileJson, RefreshCcw, ShieldCheck, Trash2, Upload } from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'

function DataHub() {
  const { lifeData, resetLifeData } = useLifeData()

  const habits = (() => {
    try {
      return JSON.parse(localStorage.getItem('life_matrix_habits')) || []
    } catch {
      return []
    }
  })()

  const focusSessions = Number(localStorage.getItem('life_matrix_focus_sessions')) || 0

  const fullBackup = {
    lifeData,
    habits,
    focusSessions,
    exportedAt: new Date().toISOString(),
    version: 'Life Matrix Phase 7.1',
  }

  const exportFullBackup = () => {
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'life-matrix-full-backup.json'
    link.click()

    URL.revokeObjectURL(url)
  }

  const exportLifeDataOnly = () => {
    const blob = new Blob([JSON.stringify(lifeData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'life-matrix-data-only.json'
    link.click()

    URL.revokeObjectURL(url)
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

        if (payload.lifeData) {
          localStorage.setItem('life_matrix_data', JSON.stringify(payload.lifeData))
        } else {
          localStorage.setItem('life_matrix_data', JSON.stringify(payload))
        }

        if (payload.habits) {
          localStorage.setItem('life_matrix_habits', JSON.stringify(payload.habits))
        }

        if (payload.focusSessions !== undefined) {
          localStorage.setItem('life_matrix_focus_sessions', String(payload.focusSessions))
        }

        window.location.reload()
      } catch {
        alert('Invalid backup file')
      }
    }

    reader.readAsText(file)
  }

  const clearFocusSessions = () => {
    localStorage.removeItem('life_matrix_focus_sessions')
    window.location.reload()
  }

  const clearHabits = () => {
    const confirmed = window.confirm('Clear all saved habits?')

    if (confirmed) {
      localStorage.removeItem('life_matrix_habits')
      window.location.reload()
    }
  }

  return (
    <section className="data-hub-section section-gap">
      <div className="data-hub-hero glass-card">
        <div>
          <p className="page-kicker">Data Hub</p>
          <h2>Backup, restore, and manage local data</h2>
          <p>
            Export your full Life Matrix, import a backup, or reset selected
            localStorage data safely from one panel.
          </p>
        </div>

        <div className="data-hub-score">
          <ShieldCheck size={34} />
          <span>Storage</span>
          <strong>Local</strong>
        </div>
      </div>

      <div className="data-hub-grid">
        <article className="data-hub-card glass-card">
          <div className="data-hub-card-icon">
            <Download size={24} />
          </div>

          <h3>Full Backup</h3>
          <p>
            Exports LifeData, Habits, Focus Sessions, version, and export date.
          </p>

          <button type="button" className="btn-life" onClick={exportFullBackup}>
            <Download size={18} />
            Export Full Backup
          </button>
        </article>

        <article className="data-hub-card glass-card">
          <div className="data-hub-card-icon">
            <FileJson size={24} />
          </div>

          <h3>Data Only</h3>
          <p>
            Exports the main LifeDataContext data only: goals, workouts, reading,
            settings, profile, and watchlist.
          </p>

          <button type="button" className="btn-life" onClick={exportLifeDataOnly}>
            <FileJson size={18} />
            Export Data Only
          </button>
        </article>

        <article className="data-hub-card glass-card">
          <div className="data-hub-card-icon">
            <Upload size={24} />
          </div>

          <h3>Import Backup</h3>
          <p>
            Import either a full backup or a data-only backup.
          </p>

          <label className="data-hub-upload-btn">
            <Upload size={18} />
            Import Backup
            <input type="file" accept="application/json" onChange={importBackup} />
          </label>
        </article>
      </div>

      <article className="data-danger-zone glass-card">
        <div>
          <p className="page-kicker">Danger Zone</p>
          <h2>Reset local data</h2>
          <p>
            These actions affect browser localStorage. Export a backup before
            resetting.
          </p>
        </div>

        <div className="data-danger-actions">
          <button type="button" onClick={clearFocusSessions}>
            <RefreshCcw size={17} />
            Clear Focus Sessions
          </button>

          <button type="button" onClick={clearHabits}>
            <Trash2 size={17} />
            Clear Habits
          </button>

          <button
            type="button"
            onClick={() => {
              const confirmed = window.confirm(
                'Reset all Life Matrix data? This cannot be undone.'
              )

              if (confirmed) {
                resetLifeData()
              }
            }}
          >
            <Trash2 size={17} />
            Reset Main Data
          </button>
        </div>
      </article>
    </section>
  )
}

export default DataHub
