import { Route, Routes } from 'react-router-dom'
import { useState } from 'react'

import Achievements from './pages/Achievements.jsx'
import Analytics from './pages/Analytics.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Goals from './pages/Goals.jsx'
import Habits from './pages/Habits.jsx'
import Home from './pages/Home.jsx'
import Notes from './pages/Notes.jsx'
import Planner from './pages/Planner.jsx'
import Profile from './pages/Profile.jsx'
import Reading from './pages/Reading.jsx'
import Settings from './pages/Settings.jsx'
import Studying from './pages/Studying.jsx'
import Watchlist from './pages/Watchlist.jsx'
import Workouts from './pages/Workouts.jsx'
import Mood from './pages/Mood.jsx'
import Projects from './pages/Projects.jsx'
import Resources from './pages/Resources.jsx'
import Review from './pages/Review.jsx'
import Finance from './pages/Finance.jsx'
import Skills from './pages/Skills.jsx'
import Decisions from './pages/Decisions.jsx'
import Score from './pages/Score.jsx'
import Launch from './pages/Launch.jsx'

import Navbar from './components/Navbar.jsx'
import Sidebar from './components/Sidebar.jsx'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className={sidebarOpen ? 'life-app sidebar-open' : 'life-app sidebar-closed'}>
      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close sidebar overlay"
        ></button>
      )}

      <main className="life-main">
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="life-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/habits" element={<Habits />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/mood" element={<Mood />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/review" element={<Review />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/decisions" element={<Decisions />} />
            <Route path="/score" element={<Score />} />
            <Route path="/launch" element={<Launch />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/reading" element={<Reading />} />
            <Route path="/studying" element={<Studying />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
