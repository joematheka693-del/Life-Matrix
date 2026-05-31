import { useMemo, useState } from 'react'

import {
  BookOpen,
  Brain,
  CalendarDays,
  Code2,
  GraduationCap,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'

function Studying() {
  const { lifeData, addStudyItem, updateStudyProgress, deleteStudyItem } = useLifeData()

  const [formData, setFormData] = useState({
    title: '',
    category: 'Web Development',
    lesson: '',
    status: 'Active',
    progress: 0,
  })

  const studying = lifeData.studying || []
  const averageProgress = studying.length
    ? Math.round(
        studying.reduce((sum, item) => sum + (Number(item.progress) || 0), 0) /
          studying.length
      )
    : 0

  const completedStudy = studying.filter((item) => Number(item.progress) >= 100).length

  const studyStats = [
    {
      icon: GraduationCap,
      title: 'Study Paths',
      value: studying.length,
      label: 'Saved learning items',
    },
    {
      icon: Brain,
      title: 'Average',
      value: `${averageProgress}%`,
      label: 'Learning progress',
    },
    {
      icon: Code2,
      title: 'Completed',
      value: completedStudy,
      label: 'Finished paths',
    },
    {
      icon: Layers,
      title: 'Categories',
      value: new Set(studying.map((item) => item.category)).size || 0,
      label: 'Knowledge areas',
    },
  ]

  const sortedCourses = useMemo(
    () => [...studying].sort((a, b) => (b.progress || 0) - (a.progress || 0)),
    [studying]
  )

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formData.title.trim()) {
      alert('Please enter a course or study title')
      return
    }

    addStudyItem({
      title: formData.title,
      category: formData.category,
      lesson: formData.lesson || 'General study session',
      status: formData.status,
      progress: Number(formData.progress),
    })

    setFormData({
      title: '',
      category: 'Web Development',
      lesson: '',
      status: 'Active',
      progress: 0,
    })
  }

  return (
    <section className="page-shell studying-page premium-studying-page">
      <div className="studying-command-hero glass-card">
        <div>
          <p className="page-kicker">Learning Matrix</p>
          <h1>Track courses, coding practice, and study growth.</h1>
          <p>
            Organize lessons, coding sessions, revision plans, project practice,
            and skill growth with a cleaner learning console.
          </p>

          <div className="studying-hero-actions">
            <a href="#add-study-form" className="btn-life">
              <Plus size={18} />
              Add Study Path
            </a>

            <button className="btn-soft-life" type="button">
              <CalendarDays size={17} />
              Weekly Study Plan
            </button>
          </div>
        </div>

        <div className="studying-rank-card">
          <GraduationCap size={40} />
          <span>Learning Progress</span>
          <strong>{averageProgress}%</strong>
          <p>{studying.length} saved paths</p>

          <div className="studying-mini-progress">
            <div style={{ width: `${averageProgress}%` }}></div>
          </div>
        </div>
      </div>

      <div className="study-stat-grid section-gap">
        {studyStats.map((stat) => {
          const Icon = stat.icon

          return (
            <article className="study-metric-card" key={stat.title}>
              <div className="study-metric-icon">
                <Icon size={22} />
              </div>

              <div>
                <p>{stat.title}</p>
                <h3>{stat.value}</h3>
                <span>{stat.label}</span>
              </div>
            </article>
          )
        })}
      </div>

      <article id="add-study-form" className="study-console-form glass-card section-gap">
        <div className="premium-form-header">
          <div>
            <p className="page-kicker">Create Study Item</p>
            <h2>Add a course or learning path</h2>
            <p>Use sections and wider inputs so the form does not feel cramped.</p>
          </div>

          <span>Saved locally</span>
        </div>

        <form className="study-premium-form-grid" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              name="title"
              placeholder="Example: React Hooks Practice"
              value={formData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Category
            <select name="category" value={formData.category} onChange={handleChange}>
              <option>Web Development</option>
              <option>Python Backend</option>
              <option>Mobile Apps</option>
              <option>Database</option>
              <option>Cybersecurity</option>
              <option>School Revision</option>
              <option>AI / Machine Learning</option>
            </select>
          </label>

          <label>
            Current Lesson
            <input
              type="text"
              name="lesson"
              placeholder="Example: JWT Auth"
              value={formData.lesson}
              onChange={handleChange}
            />
          </label>

          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange}>
              <option>Active</option>
              <option>In Progress</option>
              <option>Practice</option>
              <option>Paused</option>
              <option>Completed</option>
            </select>
          </label>

          <label>
            Progress %
            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
            />
          </label>

          <button className="btn-life" type="submit">
            <Plus size={18} />
            Save Study Path
          </button>
        </form>
      </article>

      <div className="study-deep-grid section-gap">
        <article className="study-focus-console glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Learning Focus</p>
              <h2>Recommended flow</h2>
            </div>

            <BookOpen size={22} />
          </div>

          <div className="study-focus-list">
            <div>
              <Brain size={19} />
              <p>Choose one skill and push it above 80% before adding many more.</p>
            </div>

            <div>
              <Code2 size={19} />
              <p>Practice with a real project after every study session.</p>
            </div>

            <div>
              <Layers size={19} />
              <p>Keep categories clean so Analytics gives better insight later.</p>
            </div>
          </div>
        </article>

        <article className="study-feature-card glass-card">
          <p className="page-kicker">Top Path</p>
          <h2>{sortedCourses[0]?.title || 'No study path yet'}</h2>
          <p>
            {sortedCourses[0]
              ? `${sortedCourses[0].category} · ${sortedCourses[0].lesson}`
              : 'Add your first learning path and it will appear here.'}
          </p>

          <div className="habit-progress-info">
            <span>Skill Progress</span>
            <strong>{sortedCourses[0]?.progress || 0}%</strong>
          </div>

          <div className="habit-progress-bar">
            <div
              className="habit-progress-fill"
              style={{ width: `${sortedCourses[0]?.progress || 0}%` }}
            ></div>
          </div>
        </article>
      </div>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Course Tracker</p>
          <h2>Saved Learning Paths</h2>
        </div>
      </div>

      <div className="study-grid-premium">
        {sortedCourses.map((course) => (
          <article className="study-path-card" key={course.id}>
            <div className="study-card-top">
              <div>
                <p>{course.category}</p>
                <h3>{course.title}</h3>
              </div>

              <span>{course.status}</span>
            </div>

            <p className="study-lesson">{course.lesson}</p>

            <div className="habit-progress-info">
              <span>Skill Progress</span>
              <strong>{course.progress}%</strong>
            </div>

            <div className="habit-progress-bar">
              <div
                className="habit-progress-fill"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>

            <div className="study-card-actions">
              <label>
                Update Progress
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={course.progress}
                  onChange={(event) =>
                    updateStudyProgress(course.id, event.target.value)
                  }
                />
              </label>

              <button type="button" onClick={() => deleteStudyItem(course.id)}>
                <Trash2 size={17} />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Studying
