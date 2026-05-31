function StatCard({ title, value, change, description, type }) {
  return (
    <article className={`stat-card ${type || 'primary'}`}>
      <div className="stat-card-top">
        <p>{title}</p>
        <span>{change}</span>
      </div>
      <h3>{value}</h3>
      <small>{description}</small>
    </article>
  )
}

export default StatCard
