import {
  Download,
  FileJson,
  FileText,
  Printer,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

import { useLifeData } from '../context/LifeDataContext.jsx'
import { getMatrixInsights } from '../utils/matrixInsights.js'
import {
  buildMatrixReport,
  downloadJsonReport,
  downloadTextReport,
} from '../utils/matrixReport.js'

function MatrixReportPanel() {
  const { lifeData } = useLifeData()
  const insights = getMatrixInsights(lifeData)
  const report = buildMatrixReport(lifeData)

  const printReport = () => {
    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      alert('Please allow popups to print the report.')
      return
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Life Matrix Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 32px;
              line-height: 1.6;
              color: #0f172a;
            }

            pre {
              white-space: pre-wrap;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <pre>${report.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <section className="matrix-report-section section-gap">
      <div className="matrix-report-hero glass-card">
        <div>
          <p className="page-kicker">Matrix Report Engine</p>
          <h2>Generate a full progress report</h2>
          <p>
            Export your Life Matrix score, rank, module health, recommendations,
            timeline, badges, and next focus as a TXT or JSON file.
          </p>
        </div>

        <div className="matrix-report-score">
          <Sparkles size={34} />
          <span>Report Score</span>
          <strong>{insights.stats.overallProgress}%</strong>
        </div>
      </div>

      <div className="matrix-report-grid">
        <article className="matrix-report-card glass-card">
          <div className="matrix-report-card-icon">
            <FileText size={24} />
          </div>

          <h3>Text Report</h3>
          <p>
            Best for documentation, project defense notes, printing, or quick
            review.
          </p>

          <button type="button" className="btn-life" onClick={() => downloadTextReport(lifeData)}>
            <Download size={18} />
            Download TXT
          </button>
        </article>

        <article className="matrix-report-card glass-card">
          <div className="matrix-report-card-icon">
            <FileJson size={24} />
          </div>

          <h3>JSON Report</h3>
          <p>
            Best for future backend sync, analytics records, or developer
            debugging.
          </p>

          <button type="button" className="btn-life" onClick={() => downloadJsonReport(lifeData)}>
            <Download size={18} />
            Download JSON
          </button>
        </article>

        <article className="matrix-report-card glass-card">
          <div className="matrix-report-card-icon">
            <Printer size={24} />
          </div>

          <h3>Printable Report</h3>
          <p>
            Opens a printable page with the generated Life Matrix report.
          </p>

          <button type="button" className="btn-life" onClick={printReport}>
            <Printer size={18} />
            Print Report
          </button>
        </article>
      </div>

      <article className="matrix-report-preview glass-card">
        <div className="dashboard-card-header">
          <div>
            <p className="page-kicker">Live Preview</p>
            <h2>Generated report content</h2>
          </div>

          <ShieldCheck size={22} />
        </div>

        <pre>{report}</pre>
      </article>
    </section>
  )
}

export default MatrixReportPanel
