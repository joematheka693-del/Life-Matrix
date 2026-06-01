import { useEffect, useState } from 'react'
import { CheckCircle2, ClipboardCheck, Download, PlayCircle, RefreshCcw, Trash2 } from 'lucide-react'

const defaultTests = [
  { id: 'test-1', title: 'Run npm run dev', category: 'Dev Server', done: false },
  { id: 'test-2', title: 'Open every sidebar route', category: 'Routing', done: false },
  { id: 'test-3', title: 'Test forms on new modules', category: 'Forms', done: false },
  { id: 'test-4', title: 'Export full backup', category: 'Data Hub', done: false },
  { id: 'test-5', title: 'Import backup safely', category: 'Data Hub', done: false },
  { id: 'test-6', title: 'Run npm run build', category: 'Production', done: false },
  { id: 'test-7', title: 'Run npm run preview', category: 'Production', done: false },
  { id: 'test-8', title: 'Check mobile sidebar', category: 'Responsive', done: false },
]

function Testing() {
  const [tests, setTests] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('life_matrix_testing')) || defaultTests
    } catch {
      return defaultTests
    }
  })

  useEffect(() => {
    localStorage.setItem('life_matrix_testing', JSON.stringify(tests))
  }, [tests])

  const done = tests.filter((test) => test.done).length
  const progress = tests.length ? Math.round((done / tests.length) * 100) : 0

  const toggleTest = (id) => {
    setTests((prev) => prev.map((test) => test.id === id ? { ...test, done: !test.done } : test))
  }

  const resetTests = () => {
    setTests(defaultTests)
  }

  const exportReport = () => {
    const report = `LIFE MATRIX QA REPORT

Progress: ${progress}%
Passed: ${done}/${tests.length}

${tests.map((test) => `- [${test.done ? 'x' : ' '}] ${test.category}: ${test.title}`).join('\n')}

Commands:
npm run dev
npm run build
npm run preview
`

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'life-matrix-qa-report.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="page-shell testing-page">
      <div className="system-hero glass-card">
        <div>
          <p className="page-kicker">QA Testing Lab</p>
          <h1>Test Life Matrix before build, hosting, or presentation.</h1>
          <p>
            Use this lab to check routes, forms, backups, responsive behavior,
            PWA install, and production build commands.
          </p>

          <div className="system-hero-actions">
            <button type="button" className="btn-life" onClick={exportReport}>
              <Download size={18} />
              Export QA Report
            </button>

            <button type="button" className="btn-soft-life" onClick={resetTests}>
              <RefreshCcw size={18} />
              Reset Tests
            </button>
          </div>
        </div>

        <div className="system-hero-card">
          <ClipboardCheck size={42} />
          <span>QA Progress</span>
          <strong>{progress}%</strong>
          <p>{done} / {tests.length} checks passed</p>
        </div>
      </div>

      <div className="testing-command-grid section-gap">
        <article>
          <PlayCircle size={22} />
          <p>Development</p>
          <pre>npm run dev</pre>
        </article>

        <article>
          <CheckCircle2 size={22} />
          <p>Production Build</p>
          <pre>npm run build</pre>
        </article>

        <article>
          <ClipboardCheck size={22} />
          <p>Preview Build</p>
          <pre>npm run preview</pre>
        </article>
      </div>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Test Checklist</p>
          <h2>Project readiness checks</h2>
        </div>
      </div>

      <div className="testing-list">
        {tests.map((test) => (
          <article className={test.done ? 'testing-item done' : 'testing-item'} key={test.id}>
            <div>
              <span>{test.category}</span>
              <h3>{test.title}</h3>
            </div>

            <button type="button" className="btn-life" onClick={() => toggleTest(test.id)}>
              <CheckCircle2 size={17} />
              {test.done ? 'Undo' : 'Pass'}
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Testing
