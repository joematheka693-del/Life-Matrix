import { useEffect, useState } from 'react'
import { Download, Smartphone, X } from 'lucide-react'

function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem('life_matrix_pwa_prompt_dismissed')

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setInstallEvent(event)

      if (!dismissed) {
        setVisible(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const installApp = async () => {
    if (!installEvent) {
      return
    }

    installEvent.prompt()
    await installEvent.userChoice
    setVisible(false)
    setInstallEvent(null)
  }

  const dismissPrompt = () => {
    localStorage.setItem('life_matrix_pwa_prompt_dismissed', 'true')
    setVisible(false)
  }

  if (!visible || !installEvent) {
    return null
  }

  return (
    <div className="pwa-install-card">
      <div className="pwa-install-icon">
        <Smartphone size={22} />
      </div>

      <div>
        <strong>Install Life Matrix</strong>
        <p>Add it to your device for a cleaner app-like experience.</p>
      </div>

      <button type="button" className="pwa-install-action" onClick={installApp}>
        <Download size={16} />
        Install
      </button>

      <button type="button" className="pwa-install-close" onClick={dismissPrompt}>
        <X size={16} />
      </button>
    </div>
  )
}

export default PwaInstallPrompt
