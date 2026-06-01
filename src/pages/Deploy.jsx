import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  ClipboardCheck,
  CloudUpload,
  Copy,
  ExternalLink,
  Globe,
  Rocket,
  Server,
  ShieldCheck,
  Terminal,
} from 'lucide-react'

const defaultDeploymentChecks = [
  {
    id: 'deploy-1',
    category: 'Build',
    title: 'Run npm run build without errors',
    done: false,
  },
  {
    id: 'deploy-2',
    category: 'Preview',
    title: 'Run npm run preview and test the production build',
    done: false,
  },
  {
    id: 'deploy-3',
    category: 'Routes',
    title: 'Open every sidebar route and confirm no blank page',
    done: false,
  },
  {
    id: 'deploy-4',
    category: 'Data',
    title: 'Export a full backup from Data Hub',
    done: false,
  },
  {
    id: 'deploy-5',
    category: 'PWA',
    title: 'Confirm manifest.webmanifest and sw.js exist in public folder',
    done: false,
  },
  {
    id: 'deploy-6',
    category: 'Responsive',
    title: 'Test mobile sidebar, cards, forms, and dashboard layout',
    done: false,
  },
  {
    id: 'deploy-7',
    category: 'Hosting',
    title: 'Set framework preset to Vite/React on hosting platform',
    done: false,
  },
  {
    id: 'deploy-8',
    category: 'Hosting',
    title: 'Set build command to npm run build and output folder to dist',
    done: false,
  },
]

const commandBlocks = [
  {
    title: 'Install dependencies',
    command: 'npm install',
  },
  {
    title: 'Run development server',
    command: 'npm run dev',
  },
  {
    title: 'Create production build',
    command: 'npm run build',
  },
  {
    title: 'Preview production build',
    command: 'npm run preview',
  },
]

const hostingSteps = [
  {
    title: 'Frontend hosting',
    text: 'Use Vercel, Netlify, Render Static Site, or any static hosting that supports Vite builds.',
  },
  {
    title: 'Build command',
    text: 'Use npm run build.',
  },
  {
    title: 'Output directory',
    text: 'Use dist.',
  },
  {
    title: 'SPA routing',
    text: 'Add a fallback rewrite to index.html so refresh works on /dashboard, /settings, /analytics, and other routes.',
  },
  {
    title: 'Backend later',
    text: 'When Flask sync is ready, set the backend URL in the Sync page and later move it to an environment variable.',
  },
]

function Deploy() {
  const [checks, setChecks] = useState(() => {
    try {
      const saved = localStorage.getItem('life_matrix_deploy_checks')
      return saved ? JSON.parse(saved) : defaultDeploymentChecks
    } catch {
      return defaultDeploymentChecks
    }
  })

  const [copied, setCopied] = useState('')

  useEffect(() => {
    localStorage.setItem('life_matrix_deploy_checks', JSON.stringify(checks))
  }, [checks])

  const completed = checks.filter((item) => item.done).length
  const deployScore = checks.length ? Math.round((completed / checks.length) * 100) : 0

  const categorySummary = useMemo(() => {
    return checks.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          total: 0,
          done: 0,
        }
      }

      acc[item.category].total += 1

      if (item.done) {
        acc[item.category].done += 1
      }

      return acc
    }, {})
  }, [checks])

  const toggleCheck = (id) => {
    setChecks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              done: !item.done,
            }
          : item
      )
    )
  }

  const resetChecks = () => {
    setChecks(defaultDeploymentChecks)
  }

  const copyCommand = async (command) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(command)

      setTimeout(() => {
        setCopied('')
      }, 1500)
    } catch {
      alert(command)
    }
  }

  const exportDeploymentReport = () => {
    const report = `LIFE MATRIX DEPLOYMENT REPORT

Deployment Score: ${deployScore}%
Completed: ${completed}/${checks.length}

CHECKLIST:
${checks.map((item) => `- [${item.done ? 'x' : ' '}] ${item.category}: ${item.title}`).join('\n')}

COMMANDS:
npm install
npm run dev
npm run build
npm run preview

HOSTING SETTINGS:
Framework: Vite / React
Build command: npm run build
Output directory: dist
SPA fallback: rewrite all routes to /index.html
`

    const blob = new Blob([report], {
      type: 'text/plain',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'life-matrix-deployment-report.txt'
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <section className="page-shell deploy-page">
      <div className="system-hero glass-card">
        <div>
          <p className="page-kicker">Production Deployment</p>
          <h1>Prepare Life Matrix for hosting and final launch.</h1>
          <p>
            This center guides you through build commands, static hosting
            settings, SPA routing, PWA requirements, backup safety, and final
            deployment checks.
          </p>

          <div className="system-hero-actions">
            <button type="button" className="btn-life" onClick={exportDeploymentReport}>
              <CloudUpload size={18} />
              Export Deployment Report
            </button>

            <button type="button" className="btn-soft-life" onClick={resetChecks}>
              <ClipboardCheck size={18} />
              Reset Checks
            </button>
          </div>
        </div>

        <div className="system-hero-card">
          <Rocket size={42} />
          <span>Launch Score</span>
          <strong>{deployScore}%</strong>
          <p>{completed} / {checks.length} deployment checks done</p>
        </div>
      </div>

      <div className="deploy-stat-grid section-gap">
        <article>
          <Terminal size={22} />
          <p>Build Command</p>
          <h3>npm run build</h3>
          <span>Creates dist folder</span>
        </article>

        <article>
          <Server size={22} />
          <p>Output Folder</p>
          <h3>dist</h3>
          <span>Upload this build</span>
        </article>

        <article>
          <Globe size={22} />
          <p>Hosting Type</p>
          <h3>Static</h3>
          <span>Vite React app</span>
        </article>

        <article>
          <ShieldCheck size={22} />
          <p>SPA Fallback</p>
          <h3>index.html</h3>
          <span>Fix refresh routing</span>
        </article>
      </div>

      <div className="deploy-grid section-gap">
        <article className="deploy-command-panel glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Terminal Commands</p>
              <h2>Run these before hosting</h2>
            </div>

            <Terminal size={22} />
          </div>

          <div className="deploy-command-list">
            {commandBlocks.map((block) => (
              <button
                type="button"
                className="deploy-command-card"
                key={block.command}
                onClick={() => copyCommand(block.command)}
              >
                <div>
                  <span>{block.title}</span>
                  <code>{block.command}</code>
                </div>

                <Copy size={17} />
              </button>
            ))}
          </div>

          {copied && (
            <p className="deploy-copy-note">
              Copied: <strong>{copied}</strong>
            </p>
          )}
        </article>

        <article className="deploy-hosting-panel glass-card">
          <div className="dashboard-card-header">
            <div>
              <p className="page-kicker">Hosting Setup</p>
              <h2>Recommended config</h2>
            </div>

            <Globe size={22} />
          </div>

          <div className="deploy-hosting-list">
            {hostingSteps.map((step) => (
              <div key={step.title}>
                <CheckCircle2 size={18} />
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="section-heading section-gap">
        <div>
          <p className="page-kicker">Deployment Checklist</p>
          <h2>Final launch checks</h2>
        </div>
      </div>

      <div className="deploy-check-grid">
        {checks.map((item) => (
          <article className={item.done ? 'deploy-check-card done' : 'deploy-check-card'} key={item.id}>
            <div>
              <span>{item.category}</span>
              <h3>{item.title}</h3>
            </div>

            <button type="button" onClick={() => toggleCheck(item.id)}>
              <CheckCircle2 size={17} />
              {item.done ? 'Undo' : 'Done'}
            </button>
          </article>
        ))}
      </div>

      <article className="deploy-summary-panel glass-card section-gap">
        <div>
          <p className="page-kicker">Category Summary</p>
          <h2>Deployment readiness by area</h2>
        </div>

        <div className="deploy-summary-grid">
          {Object.entries(categorySummary).map(([category, value]) => {
            const percent = value.total ? Math.round((value.done / value.total) * 100) : 0

            return (
              <div key={category}>
                <div className="habit-progress-info">
                  <span>{category}</span>
                  <strong>{percent}%</strong>
                </div>

                <div className="habit-progress-bar">
                  <div className="habit-progress-fill" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            )
          })}
        </div>
      </article>

      <article className="deploy-note-panel glass-card section-gap">
        <ExternalLink size={24} />
        <div>
          <h2>Important for React Router refresh</h2>
          <p>
            Because Life Matrix uses React Router, hosted routes like /dashboard
            or /settings can show 404 after refresh unless your hosting platform
            rewrites all routes back to index.html.
          </p>
        </div>
      </article>
    </section>
  )
}

export default Deploy
