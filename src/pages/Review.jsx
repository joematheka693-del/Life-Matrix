import { useEffect, useMemo, useState } from 'react'
import { ClipboardCheck, Download, Plus, Sparkles, Star, Trash2, TrendingUp } from 'lucide-react'

const defaultReviews = [
  { id: 'review-1', week: 'Current Week', wins: 'Built new Life Matrix phases.', problems: 'Need to test routes carefully.', nextFocus: 'Polish UI and prepare backend sync.', rating: 8, createdAt: new Date().toISOString() },
]

function Review() {
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('life_matrix_reviews')
      return saved ? JSON.parse(saved) : defaultReviews
    } catch {
      return defaultReviews
    }
  })

  const [formData, setFormData] = useState({
    week: 'Current Week',
    wins: '',
    problems: '',
    nextFocus: '',
    rating: 7,
  })

  useEffect(() => {
    localStorage.setItem('life_matrix_reviews', JSON.stringify(reviews))
  }, [reviews])

  const averageRating = reviews.length
    ? Math.round(reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0) / reviews.length)
    : 0

  const latest = useMemo(() => reviews[0], [reviews])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addReview = (event) => {
    event.preventDefault()

    if (!formData.wins.trim() || !formData.nextFocus.trim()) {
      alert('Please enter wins and next focus')
      return
    }

    setReviews((prev) => [
      {
        id: String(Date.now()),
        ...formData,
        rating: Number(formData.rating),
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])

    setFormData({ week: 'Current Week', wins: '', problems: '', nextFocus: '', rating: 7 })
  }

  const deleteReview = (id) => {
    setReviews((prev) => prev.filter((item) => item.id !== id))
  }

  const downloadReviews = () => {
    const text = reviews.map((review) => {
      return `WEEKLY REVIEW: ${review.week}
Rating: ${review.rating}/10
Wins:
${review.wins}

Problems:
${review.problems}

Next Focus:
${review.nextFocus}

Created: ${new Date(review.createdAt).toLocaleString()}
-----------------------------`
    }).join('\n\n')

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'life-matrix-weekly-reviews.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="page-shell review-page premium-review-page">
      <div className="review-command-hero glass-card">
        <div>
          <p className="page-kicker">Weekly Review</p>
          <h1>Reflect, learn, and plan your next upgrade cycle.</h1>
          <p>
            Review what worked, what failed, what you learned, and what your
            next focus should be for the coming week.
          </p>

          <div className="review-hero-actions">
            <a href="#add-review-form" className="btn-life"><Plus size={18} /> Add Review</a>
            <button type="button" className="btn-soft-life" onClick={downloadReviews}><Download size={17} /> Export Reviews</button>
          </div>
        </div>

        <div className="review-rank-card">
          <ClipboardCheck size={42} />
          <span>Average Rating</span>
          <strong>{averageRating}/10</strong>
          <p>{reviews.length} saved reviews</p>
        </div>
      </div>

      <div className="page-action-grid section-gap">
        <article className="system-metric-card"><div className="system-metric-icon"><ClipboardCheck size={22} /></div><p>Reviews</p><h3>{reviews.length}</h3><span>Total logs</span></article>
        <article className="system-metric-card"><div className="system-metric-icon"><Star size={22} /></div><p>Average</p><h3>{averageRating}/10</h3><span>Weekly rating</span></article>
        <article className="system-metric-card"><div className="system-metric-icon"><Sparkles size={22} /></div><p>Latest Week</p><h3>{latest?.week || 'None'}</h3><span>Most recent</span></article>
        <article className="system-metric-card"><div className="system-metric-icon"><TrendingUp size={22} /></div><p>Status</p><h3>{averageRating >= 7 ? 'Strong' : 'Review'}</h3><span>Performance</span></article>
      </div>

      <article id="add-review-form" className="system-console-form glass-card section-gap">
        <div className="premium-form-header">
          <div><p className="page-kicker">Create Review</p><h2>Write your weekly reflection</h2><p>Use this to keep improving every week.</p></div>
          <span>Saved locally</span>
        </div>

        <form className="review-form-grid" onSubmit={addReview}>
          <label>Week<input name="week" value={formData.week} onChange={handleChange} placeholder="Example: Week 1 June" /></label>
          <label>Rating / 10<input type="number" name="rating" min="1" max="10" value={formData.rating} onChange={handleChange} /></label>
          <label className="review-wide-field">Wins<textarea name="wins" rows="4" value={formData.wins} onChange={handleChange} placeholder="What went well?"></textarea></label>
          <label className="review-wide-field">Problems<textarea name="problems" rows="4" value={formData.problems} onChange={handleChange} placeholder="What slowed you down?"></textarea></label>
          <label className="review-wide-field">Next Focus<textarea name="nextFocus" rows="4" value={formData.nextFocus} onChange={handleChange} placeholder="What should you do next week?"></textarea></label>
          <button className="btn-life" type="submit"><Plus size={18} /> Save Review</button>
        </form>
      </article>

      <div className="section-heading section-gap"><div><p className="page-kicker">Review History</p><h2>{reviews.length} weekly reviews</h2></div></div>

      <div className="system-card-grid">
        {reviews.map((review) => (
          <article className="system-card" key={review.id}>
            <div className="system-card-top">
              <div><p>{new Date(review.createdAt).toLocaleDateString()}</p><h3>{review.week}</h3></div>
              <span className="system-pill">{review.rating}/10</span>
            </div>
            <div className="review-block"><strong>Wins</strong><p>{review.wins}</p></div>
            <div className="review-block"><strong>Problems</strong><p>{review.problems || 'No problems recorded.'}</p></div>
            <div className="review-block"><strong>Next Focus</strong><p>{review.nextFocus}</p></div>
            <div className="system-card-actions">
              <button className="system-delete-btn" type="button" onClick={() => deleteReview(review.id)}><Trash2 size={16} /> Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Review
