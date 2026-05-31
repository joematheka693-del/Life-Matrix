import { useEffect } from 'react'

import { useLifeData } from '../context/LifeDataContext.jsx'

const themeMap = {
  'Light Matrix': 'light-matrix',
  'Soft Blue': 'soft-blue',
  'Anime Clean': 'anime-clean',
  'Focus Mode': 'focus-mode',
  'Shadow System': 'shadow-system',
}

function ThemeController() {
  const { lifeData } = useLifeData()

  const selectedTheme = lifeData.settings?.theme || 'Light Matrix'
  const themeKey = themeMap[selectedTheme] || 'light-matrix'

  useEffect(() => {
    document.documentElement.dataset.lifeTheme = themeKey
  }, [themeKey])

  return null
}

export default ThemeController
