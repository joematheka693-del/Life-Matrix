import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react'

import { useToast } from '../context/ToastContext'

function ToastContainer() {
  const { toasts, removeToast } = useToast()

  const getIcon = (type) => {
    if (type === 'error') {
      return <AlertCircle size={18} />
    }

    if (type === 'info') {
      return <Info size={18} />
    }

    return <CheckCircle2 size={18} />
  }

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div className={`life-toast ${toast.type}`} key={toast.id}>
          <div className="toast-icon">{getIcon(toast.type)}</div>

          <p>{toast.message}</p>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer