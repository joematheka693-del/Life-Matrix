const STORAGE_KEY = 'life_matrix_data'

export function getStoredLifeData(defaultData) {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY)

    if (!storedData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData))
      return defaultData
    }

    const parsedData = JSON.parse(storedData)

    return {
      ...defaultData,
      ...parsedData,
      user: { ...defaultData.user, ...parsedData.user },
      stats: { ...defaultData.stats, ...parsedData.stats },
      settings: { ...defaultData.settings, ...parsedData.settings },
      goals: parsedData.goals || defaultData.goals,
      workouts: parsedData.workouts || defaultData.workouts,
      studying: parsedData.studying || defaultData.studying,
      reading: parsedData.reading || defaultData.reading,
      watchlist: parsedData.watchlist || defaultData.watchlist,
    }
  } catch (error) {
    console.error('Failed to load Life Matrix data:', error)
    return defaultData
  }
}

export function saveLifeData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save Life Matrix data:', error)
  }
}

export function clearLifeData() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear Life Matrix data:', error)
  }
}
