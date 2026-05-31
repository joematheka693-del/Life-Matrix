import { PlusCircle } from 'lucide-react'

function EmptyState({ title, text, actionText, targetId }) {
  return (
    <article className="empty-state-card glass-card">
      <div className="empty-state-icon">
        <PlusCircle size={30} />
      </div>

      <h3>{title}</h3>
      <p>{text}</p>

      {targetId && (
        <a href={`#${targetId}`} className="btn-life">
          {actionText || 'Add Item'}
        </a>
      )}
    </article>
  )
}

export default EmptyState