import { useEffect, useState } from 'react'
import {
  BellRing,
  CheckCircle2,
  Moon,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  Volume2,
} from 'lucide-react'

import {
  getNotificationPermissionState,
  getReminderPreferences,
  requestBrowserNotificationPermission,
  saveReminderPreferences,
  sendTestNotification,
} from '../utils/reminderPreferences.js'

const reminderOptions = [
  {
    key: 'planner',
    title: 'Planner reminders',
    text: 'Pending tasks and high-priority plans.',
  },
  {
    key: 'habits',
    title: 'Habit reminders',
    text: 'Daily habits not completed today.',
  },
  {
    key: 'projects',
    title: 'Project reminders',
    text: 'Projects below 50% progress.',
  },
  {
    key: 'skills',
    title: 'Skill reminders',
    text: 'Skills that need more practice.',
  },
  {
    key: 'finance',
    title: 'Finance reminders',
    text: 'Expenses, missing finance data, or weak balance.',
  },
  {
    key: 'review',
    title: 'Weekly review reminders',
    text: 'Missing weekly reflection entries.',
  },
  {
    key: 'launch',
    title: 'Launch reminders',
    text: 'Deployment checklist items still pending.',
  },
  {
    key: 'focus',
    title: 'Focus reminders',
    text: 'Pomodoro and focus-session reminders.',
  },
]

function ReminderSettings() {
  const [preferences, setPreferences] = useState(() => getReminderPreferences())
  const [permission, setPermission] = useState(() => getNotificationPermissionState())

  useEffect(() => {
    setPermission(getNotificationPermissionState())
  }, [])

  const togglePreference = (key) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const savePreferences = () => {
    saveReminderPreferences(preferences)
    alert('Reminder preferences saved.')
  }

  const allowNotifications = async () => {
    const result = await requestBrowserNotificationPermission()
    setPermission(result)

    if (result === 'granted') {
      const nextPreferences = {
        ...preferences,
        browserNotifications: true,
      }

      setPreferences(nextPreferences)
      saveReminderPreferences(nextPreferences)
    }
  }

  return (
    <section className="reminder-settings-section section-gap">
      <div className="reminder-settings-hero glass-card">
        <div>
          <p className="page-kicker">Reminder Preferences</p>
          <h2>Control your reminder system</h2>
          <p>
            Choose which reminders should appear on your Dashboard and set up
            browser notification permission for future alert upgrades.
          </p>
        </div>

        <div className="reminder-settings-status">
          <BellRing size={34} />
          <span>Browser Permission</span>
          <strong>{permission}</strong>
        </div>
      </div>

      <div className="reminder-settings-grid">
        <article className="reminder-settings-card glass-card">
          <div className="reminder-settings-card-header">
            <div>
              <p className="page-kicker">Notification Access</p>
              <h3>Browser notifications</h3>
            </div>

            <ShieldCheck size={22} />
          </div>

          <p>
            This allows Life Matrix to show notifications while the app is open.
            Full background notifications will come later when the app becomes a
            PWA.
          </p>

          <div className="reminder-settings-actions">
            <button type="button" className="btn-life" onClick={allowNotifications}>
              <BellRing size={18} />
              Allow Notifications
            </button>

            <button type="button" className="btn-soft-life" onClick={sendTestNotification}>
              <Volume2 size={18} />
              Test Notification
            </button>
          </div>
        </article>

        <article className="reminder-settings-card glass-card">
          <div className="reminder-settings-card-header">
            <div>
              <p className="page-kicker">Quiet Mode</p>
              <h3>Pause reminders</h3>
            </div>

            <Moon size={22} />
          </div>

          <p>
            Quiet Mode hides generated reminders from the Dashboard Reminder
            Center without deleting your data.
          </p>

          <label className="reminder-toggle-row">
            <div>
              <strong>Quiet Mode</strong>
              <span>{preferences.quietMode ? 'Reminders paused' : 'Reminders active'}</span>
            </div>

            <input
              type="checkbox"
              checked={preferences.quietMode}
              onChange={() => togglePreference('quietMode')}
            />
          </label>
        </article>
      </div>

      <article className="reminder-module-panel glass-card">
        <div className="dashboard-card-header">
          <div>
            <p className="page-kicker">Reminder Types</p>
            <h2>Choose active modules</h2>
          </div>

          <SlidersHorizontal size={22} />
        </div>

        <div className="reminder-module-list">
          {reminderOptions.map((option) => (
            <label className="reminder-toggle-row" key={option.key}>
              <div>
                <strong>{option.title}</strong>
                <span>{option.text}</span>
              </div>

              <input
                type="checkbox"
                checked={Boolean(preferences[option.key])}
                onChange={() => togglePreference(option.key)}
              />
            </label>
          ))}
        </div>

        <div className="reminder-save-bar">
          <div>
            <CheckCircle2 size={19} />
            <span>Changes are saved to localStorage.</span>
          </div>

          <button type="button" className="btn-life" onClick={savePreferences}>
            <Save size={18} />
            Save Reminder Settings
          </button>
        </div>
      </article>
    </section>
  )
}

export default ReminderSettings
