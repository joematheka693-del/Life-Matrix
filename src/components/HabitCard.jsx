function HabitCard({ title, category, progress, target, status }) {
  return (
    <article className="habit-card">
      <div className="habit-card-top">
        <div>
          <p>{category}</p>
          <h3>{title}</h3>
        </div>
        <span>{status}</span>
      </div>
      <p className="habit-target">{target}</p>
      <div className="habit-progress-info">
        <span>Progress</span>
        <strong>{progress}%</strong>
      </div>
      <div className="habit-progress-bar">
        <div className="habit-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
    </article>
  )
}

export default HabitCard
