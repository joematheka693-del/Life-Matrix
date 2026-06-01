import { Route, Routes, useLocation } from 'react-router-dom'
import { useState } from 'react'

import Achievements from './pages/Achievements.jsx'
import Analytics from './pages/Analytics.jsx'
import Auth from './pages/Auth.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Decisions from './pages/Decisions.jsx'
import Deploy from './pages/Deploy.jsx'
import Finance from './pages/Finance.jsx'
import Goals from './pages/Goals.jsx'
import Habits from './pages/Habits.jsx'
import Home from './pages/Home.jsx'
import Launch from './pages/Launch.jsx'
import Mood from './pages/Mood.jsx'
import Notes from './pages/Notes.jsx'
import Planner from './pages/Planner.jsx'
import Profile from './pages/Profile.jsx'
import Projects from './pages/Projects.jsx'
import Reading from './pages/Reading.jsx'
import Resources from './pages/Resources.jsx'
import Review from './pages/Review.jsx'
import Score from './pages/Score.jsx'
import Settings from './pages/Settings.jsx'
import Skills from './pages/Skills.jsx'
import Studying from './pages/Studying.jsx'
import Sync from './pages/Sync.jsx'
import Testing from './pages/Testing.jsx'
import Watchlist from './pages/Watchlist.jsx'
import Workouts from './pages/Workouts.jsx'

import AuthUserBridge from './components/AuthUserBridge.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PwaInstallPrompt from './components/PwaInstallPrompt.jsx'
import Sidebar from './components/Sidebar.jsx'

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AuthUserBridge />
      {children}
    </ProtectedRoute>
  )
}

function App() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isAuthPage = location.pathname === '/auth'

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = () => setSidebarOpen(false)

  if (isAuthPage) {
    return (
      <div className="auth-only-app">
        <Routes>
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className={sidebarOpen ? 'life-app sidebar-open' : 'life-app sidebar-closed'}>
      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

      {sidebarOpen && (
        <button className="sidebar-overlay" onClick={closeSidebar} aria-label="Close sidebar overlay"></button>
      )}

      <main className="life-main">
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="life-content">
          <Routes>
            <Route path="/" element={<ProtectedPage><Home /></ProtectedPage>} />
            <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
            <Route path="/planner" element={<ProtectedPage><Planner /></ProtectedPage>} />
            <Route path="/habits" element={<ProtectedPage><Habits /></ProtectedPage>} />
            <Route path="/notes" element={<ProtectedPage><Notes /></ProtectedPage>} />
            <Route path="/achievements" element={<ProtectedPage><Achievements /></ProtectedPage>} />
            <Route path="/mood" element={<ProtectedPage><Mood /></ProtectedPage>} />
            <Route path="/projects" element={<ProtectedPage><Projects /></ProtectedPage>} />
            <Route path="/resources" element={<ProtectedPage><Resources /></ProtectedPage>} />
            <Route path="/review" element={<ProtectedPage><Review /></ProtectedPage>} />
            <Route path="/finance" element={<ProtectedPage><Finance /></ProtectedPage>} />
            <Route path="/skills" element={<ProtectedPage><Skills /></ProtectedPage>} />
            <Route path="/decisions" element={<ProtectedPage><Decisions /></ProtectedPage>} />
            <Route path="/score" element={<ProtectedPage><Score /></ProtectedPage>} />
            <Route path="/launch" element={<ProtectedPage><Launch /></ProtectedPage>} />
            <Route path="/sync" element={<ProtectedPage><Sync /></ProtectedPage>} />
            <Route path="/testing" element={<ProtectedPage><Testing /></ProtectedPage>} />
            <Route path="/deploy" element={<ProtectedPage><Deploy /></ProtectedPage>} />
            <Route path="/workouts" element={<ProtectedPage><Workouts /></ProtectedPage>} />
            <Route path="/reading" element={<ProtectedPage><Reading /></ProtectedPage>} />
            <Route path="/studying" element={<ProtectedPage><Studying /></ProtectedPage>} />
            <Route path="/watchlist" element={<ProtectedPage><Watchlist /></ProtectedPage>} />
            <Route path="/goals" element={<ProtectedPage><Goals /></ProtectedPage>} />
            <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
            <Route path="/analytics" element={<ProtectedPage><Analytics /></ProtectedPage>} />
            <Route path="/settings" element={<ProtectedPage><Settings /></ProtectedPage>} />
          </Routes>
        </div>
      </main>

      <PwaInstallPrompt />
    </div>
  )
}

export default App
