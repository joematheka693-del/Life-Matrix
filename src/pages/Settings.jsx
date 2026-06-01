import { useEffect, useState } from 'react'

import {
  Bell,
  ImagePlus,
  Palette,
  Save,
  Shield,
  SlidersHorizontal,
  User,
  X,
} from 'lucide-react'

import DataHub from '../components/DataHub.jsx'
import ReminderSettings from '../components/ReminderSettings.jsx'
import { useLifeData } from '../context/LifeDataContext'

const themeOptions = [
  {
    name: 'Light Matrix',
    text: 'Clean white and blue default interface.',
  },
  {
    name: 'Soft Blue',
    text: 'Cool calm blue productivity theme.',
  },
  {
    name: 'Anime Clean',
    text: 'Soft pink and violet anime-inspired theme.',
  },
  {
    name: 'Focus Mode',
    text: 'Minimal muted colors for deep work.',
  },
  {
    name: 'Shadow System',
    text: 'Dark tech theme with blue neon energy.',
  },
]

function Settings() {
  const {
    lifeData,
    updateUser,
    updateSettings,
  } = useLifeData()

  const [userForm, setUserForm] = useState({
    name: '',
    username: '',
    rank: '',
    level: 1,
    xp: 0,
    nextRankXp: 700,
    streak: 0,
    avatarUrl: '',
  })

  const [settingsForm, setSettingsForm] = useState({
    dailyReminder: true,
    weeklyReport: true,
    goalDeadlines: false,
    theme: 'Light Matrix',
  })

  useEffect(() => {
    const user = lifeData.user || {}
    const settings = lifeData.settings || {}

    setUserForm({
      name: user.name || '',
      username: user.username || '',
      rank: user.rank || 'Rank C',
      level: Number(user.level) || 1,
      xp: Number(user.xp) || 0,
      nextRankXp: Number(user.nextRankXp) || 700,
      streak: Number(user.streak) || 0,
      avatarUrl: user.avatarUrl || '',
    })

    setSettingsForm({
      dailyReminder: Boolean(settings.dailyReminder),
      weeklyReport: Boolean(settings.weeklyReport),
      goalDeadlines: Boolean(settings.goalDeadlines),
      theme: settings.theme || 'Light Matrix',
    })
  }, [lifeData.user, lifeData.settings])

  const handleUserChange = (event) => {
    const { name, value } = event.target

    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSettingsChange = (event) => {
    const { name, type, checked, value } = event.target

    setSettingsForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setUserForm((prev) => ({
        ...prev,
        avatarUrl: reader.result,
      }))
    }

    reader.readAsDataURL(file)
  }

  const handleSave = (event) => {
    event.preventDefault()

    updateUser({
      ...userForm,
      level: Number(userForm.level) || 1,
      xp: Number(userForm.xp) || 0,
      nextRankXp: Number(userForm.nextRankXp) || 700,
      streak: Number(userForm.streak) || 0,
    })

    updateSettings(settingsForm)

    alert('Settings saved successfully')
  }

  return (
    <section className="page-shell settings-page premium-settings-page">
      <div className="settings-command-hero glass-card">
        <div>
          <p className="page-kicker">System Control</p>
          <h1>Customize your Life Matrix operating system.</h1>
          <p>
            Manage identity, avatar, rank, XP, reminders, browser notification
            permission, theme, backup, restore, and localStorage data from one
            premium control panel.
          </p>
        </div>

        <div className="settings-security-card">
          <Shield size={40} />
          <span>Storage Mode</span>
          <strong>Local Browser</strong>
          <p>Your data stays in this device&apos;s browser storage.</p>
        </div>
      </div>

      <form className="settings-console-grid section-gap" onSubmit={handleSave}>
        <article className="settings-console-card identity-card glass-card">
          <div className="settings-card-header">
            <div>
              <p className="page-kicker">Identity Core</p>
              <h2>Player profile</h2>
            </div>

            <User size={22} />
          </div>

          <div className="settings-avatar-console">
            <div className="settings-avatar-preview">
              {userForm.avatarUrl ? (
                <img src={userForm.avatarUrl} alt={userForm.username} />
              ) : (
                <User size={48} />
              )}
            </div>

            <div className="settings-avatar-copy">
              <h3>Profile avatar</h3>
              <p>
                Use a square image for best results. This avatar appears in the
                Navbar, Sidebar, and Profile page.
              </p>

              <label>
                Avatar Image URL
                <input
                  type="text"
                  name="avatarUrl"
                  placeholder="Paste avatar image URL"
                  value={userForm.avatarUrl}
                  onChange={handleUserChange}
                />
              </label>

              <div className="settings-avatar-actions">
                <label className="settings-upload-btn">
                  <ImagePlus size={18} />
                  Upload Avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                  />
                </label>

                {userForm.avatarUrl && (
                  <button
                    type="button"
                    className="settings-remove-btn"
                    onClick={() =>
                      setUserForm((prev) => ({
                        ...prev,
                        avatarUrl: '',
                      }))
                    }
                  >
                    <X size={17} />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="settings-form-grid premium-settings-form-grid">
            <label>
              Full Name
              <input
                type="text"
                name="name"
                value={userForm.name}
                onChange={handleUserChange}
              />
            </label>

            <label>
              Username
              <input
                type="text"
                name="username"
                value={userForm.username}
                onChange={handleUserChange}
              />
            </label>

            <label>
              Rank
              <select name="rank" value={userForm.rank} onChange={handleUserChange}>
                <option>Rank E</option>
                <option>Rank D</option>
                <option>Rank C</option>
                <option>Rank B</option>
                <option>Rank A</option>
                <option>Rank S</option>
                <option>Shadow Monarch</option>
              </select>
            </label>

            <label>
              Level
              <input
                type="number"
                name="level"
                min="1"
                value={userForm.level}
                onChange={handleUserChange}
              />
            </label>

            <label>
              Current XP
              <input
                type="number"
                name="xp"
                min="0"
                value={userForm.xp}
                onChange={handleUserChange}
              />
            </label>

            <label>
              Next Rank XP
              <input
                type="number"
                name="nextRankXp"
                min="1"
                value={userForm.nextRankXp}
                onChange={handleUserChange}
              />
            </label>

            <label>
              Streak Days
              <input
                type="number"
                name="streak"
                min="0"
                value={userForm.streak}
                onChange={handleUserChange}
              />
            </label>
          </div>
        </article>

        <div className="settings-side-stack">
          <article className="settings-console-card glass-card">
            <div className="settings-card-header">
              <div>
                <p className="page-kicker">Preferences</p>
                <h2>Theme engine</h2>
              </div>

              <SlidersHorizontal size={22} />
            </div>

            <label className="settings-theme-field">
              Theme Preference
              <select
                name="theme"
                value={settingsForm.theme}
                onChange={handleSettingsChange}
              >
                {themeOptions.map((theme) => (
                  <option key={theme.name}>{theme.name}</option>
                ))}
              </select>
            </label>

            <div className="theme-preview-grid">
              {themeOptions.map((theme) => (
                <button
                  type="button"
                  key={theme.name}
                  className={
                    settingsForm.theme === theme.name
                      ? 'theme-preview-card active'
                      : 'theme-preview-card'
                  }
                  onClick={() =>
                    setSettingsForm((prev) => ({
                      ...prev,
                      theme: theme.name,
                    }))
                  }
                >
                  <span>{theme.name}</span>
                  <p>{theme.text}</p>
                </button>
              ))}
            </div>

            <div className="premium-toggle-list">
              <label className="premium-toggle-row">
                <div>
                  <Bell size={18} />
                  <div>
                    <strong>Daily Reminder</strong>
                    <span>Update your Life Matrix daily.</span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name="dailyReminder"
                  checked={settingsForm.dailyReminder}
                  onChange={handleSettingsChange}
                />
              </label>

              <label className="premium-toggle-row">
                <div>
                  <Bell size={18} />
                  <div>
                    <strong>Weekly Report</strong>
                    <span>Summarize weekly performance.</span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name="weeklyReport"
                  checked={settingsForm.weeklyReport}
                  onChange={handleSettingsChange}
                />
              </label>

              <label className="premium-toggle-row">
                <div>
                  <Bell size={18} />
                  <div>
                    <strong>Deadline Alerts</strong>
                    <span>Warn when goals are close.</span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  name="goalDeadlines"
                  checked={settingsForm.goalDeadlines}
                  onChange={handleSettingsChange}
                />
              </label>
            </div>
          </article>

          <article className="settings-console-card glass-card">
            <div className="settings-card-header">
              <div>
                <p className="page-kicker">System Palette</p>
                <h2>Theme status</h2>
              </div>

              <Palette size={22} />
            </div>

            <p className="settings-theme-note">
              Current selected theme: <strong>{settingsForm.theme}</strong>.
              Click Save Settings to apply it permanently.
            </p>
          </article>
        </div>

        <article className="settings-save-console glass-card">
          <div>
            <p className="page-kicker">Apply Changes</p>
            <h2>Save profile and theme settings</h2>
            <p>
              Your saved changes update the Navbar, Sidebar, Profile, Dashboard,
              Analytics, and the global theme engine.
            </p>
          </div>

          <button className="btn-life" type="submit">
            <Save size={18} />
            Save Settings
          </button>
        </article>
      </form>

      <ReminderSettings />

      <DataHub />
    </section>
  )
}

export default Settings
