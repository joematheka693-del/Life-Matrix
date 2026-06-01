import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import './styles/global.css'
import './styles/theme.css'
import './styles/layout.css'
import './styles/navbar.css'
import './styles/sidebar.css'
import './styles/cards.css'
import './styles/pages.css'
import './styles/forms.css'
import './styles/home.css'
import './styles/watchlist.css'
import './styles/reading.css'
import './styles/workouts.css'
import './styles/studying.css'
import './styles/goals.css'
import './styles/habits.css'
import './styles/planner.css'
import './styles/notes.css'
import './styles/achievements.css'
import './styles/mood.css'
import './styles/projects.css'
import './styles/resources.css'
import './styles/review.css'
import './styles/finance.css'
import './styles/skills.css'
import './styles/decisions.css'
import './styles/score.css'
import './styles/launch.css'
import './styles/profile.css'
import './styles/settings.css'
import './styles/settings-theme-preview.css'
import './styles/dashboard.css'
import './styles/analytics.css'
import './styles/system-analytics.css'
import './styles/quickadd.css'
import './styles/globalsearch.css'
import './styles/notifications.css'
import './styles/reminders.css'
import './styles/reminder-settings.css'
import './styles/xp.css'
import './styles/insights.css'
import './styles/dailyfocus.css'
import './styles/report.css'
import './styles/focustimer.css'
import './styles/datahub.css'
import './styles/datahub-expanded.css'
import './styles/ui-cleanup.css'
import './styles/pwa.css'
import './styles/sync.css'
import './styles/testing.css'
import './styles/deploy.css'
import './styles/auth.css'
import './styles/auth-backend.css'
import './styles/autosync.css'
import './styles/navbar-click-fix.css'
import './styles/sidebar-scroll-dropdown-force.css'
import './styles/navbar-safe-fix.css'
import './styles/responsive.css'

import App from './App.jsx'
import ThemeController from './components/ThemeController.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LifeDataProvider } from './context/LifeDataContext.jsx'
import { registerServiceWorker } from './utils/registerServiceWorker.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LifeDataProvider>
          <ThemeController />
          <App />
        </LifeDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

registerServiceWorker()
