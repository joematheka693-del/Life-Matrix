import { createContext, useContext, useEffect, useState } from 'react'

import { defaultLifeData } from '../data/defaultLifeData'
import {
  clearLifeData,
  getStoredLifeData,
  saveLifeData,
} from '../utils/storage'

const LifeDataContext = createContext(null)

function clampProgress(progress) {
  return Math.min(100, Math.max(0, Number(progress) || 0))
}

function calculateUnitProgress(currentUnit, totalUnits) {
  const current = Number(currentUnit) || 0
  const total = Number(totalUnits) || 0

  if (total <= 0) {
    return 0
  }

  return Math.min(100, Math.round((current / total) * 100))
}

function calculateEpisodeProgress(watchedEpisodes, totalEpisodes) {
  return calculateUnitProgress(watchedEpisodes, totalEpisodes)
}

export function LifeDataProvider({ children }) {
  const [lifeData, setLifeData] = useState(() =>
    getStoredLifeData(defaultLifeData)
  )

  useEffect(() => {
    saveLifeData(lifeData)
  }, [lifeData])

  const addGoal = (goal) => {
    const progress = clampProgress(goal.progress)

    const newGoal = {
      id: Date.now(),
      completed: progress === 100,
      ...goal,
      progress,
    }

    setLifeData((prev) => ({
      ...prev,
      goals: [newGoal, ...prev.goals],
    }))
  }

  const updateGoalProgress = (goalId, progress) => {
    const fixedProgress = clampProgress(progress)

    setLifeData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              progress: fixedProgress,
              completed: fixedProgress === 100,
            }
          : goal
      ),
    }))
  }

  const deleteGoal = (goalId) => {
    setLifeData((prev) => ({
      ...prev,
      goals: prev.goals.filter((goal) => goal.id !== goalId),
    }))
  }

  const addWorkout = (workout) => {
    const progress = clampProgress(workout.progress)

    const newWorkout = {
      id: Date.now(),
      completed: progress === 100,
      ...workout,
      progress,
    }

    setLifeData((prev) => ({
      ...prev,
      workouts: [newWorkout, ...prev.workouts],
    }))
  }

  const updateWorkoutProgress = (workoutId, progress) => {
    const fixedProgress = clampProgress(progress)

    setLifeData((prev) => ({
      ...prev,
      workouts: prev.workouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              progress: fixedProgress,
              completed: fixedProgress === 100,
            }
          : workout
      ),
    }))
  }

  const deleteWorkout = (workoutId) => {
    setLifeData((prev) => ({
      ...prev,
      workouts: prev.workouts.filter((workout) => workout.id !== workoutId),
    }))
  }

  const addStudyItem = (studyItem) => {
    const progress = clampProgress(studyItem.progress)

    const newStudyItem = {
      id: Date.now(),
      ...studyItem,
      progress,
    }

    setLifeData((prev) => ({
      ...prev,
      studying: [newStudyItem, ...prev.studying],
    }))
  }

  const updateStudyProgress = (studyId, progress) => {
    const fixedProgress = clampProgress(progress)

    setLifeData((prev) => ({
      ...prev,
      studying: prev.studying.map((item) =>
        item.id === studyId ? { ...item, progress: fixedProgress } : item
      ),
    }))
  }

  const deleteStudyItem = (studyId) => {
    setLifeData((prev) => ({
      ...prev,
      studying: prev.studying.filter((item) => item.id !== studyId),
    }))
  }

  const addReadingItem = (readingItem) => {
    const totalUnits = Number(readingItem.totalUnits) || 1
    const currentUnit = Math.min(
      totalUnits,
      Math.max(0, Number(readingItem.currentUnit) || 0)
    )
    const progress = calculateUnitProgress(currentUnit, totalUnits)

    const newReadingItem = {
      id: Date.now(),
      ...readingItem,
      totalUnits,
      currentUnit,
      progress,
    }

    setLifeData((prev) => ({
      ...prev,
      reading: [newReadingItem, ...prev.reading],
    }))
  }

  const updateReadingProgress = (readingId, progress) => {
    const fixedProgress = clampProgress(progress)

    setLifeData((prev) => ({
      ...prev,
      reading: prev.reading.map((item) =>
        item.id === readingId ? { ...item, progress: fixedProgress } : item
      ),
    }))
  }

  const updateReadingUnits = (readingId, currentUnit) => {
    setLifeData((prev) => ({
      ...prev,
      reading: prev.reading.map((item) => {
        if (item.id !== readingId) {
          return item
        }

        const totalUnits = Number(item.totalUnits) || 1
        const fixedCurrentUnit = Math.min(
          totalUnits,
          Math.max(0, Number(currentUnit) || 0)
        )

        return {
          ...item,
          currentUnit: fixedCurrentUnit,
          chapter: `${item.unitLabel || 'Chapter'} ${fixedCurrentUnit}`,
          progress: calculateUnitProgress(fixedCurrentUnit, totalUnits),
          status: fixedCurrentUnit === totalUnits ? 'Completed' : item.status,
        }
      }),
    }))
  }

  const deleteReadingItem = (readingId) => {
    setLifeData((prev) => ({
      ...prev,
      reading: prev.reading.filter((item) => item.id !== readingId),
    }))
  }

  const addWatchItem = (watchItem) => {
    const totalEpisodes = Number(watchItem.totalEpisodes) || 1
    const watchedEpisodes = Math.min(
      totalEpisodes,
      Math.max(0, Number(watchItem.watchedEpisodes) || 0)
    )
    const progress = calculateEpisodeProgress(watchedEpisodes, totalEpisodes)

    const newWatchItem = {
      id: Date.now(),
      ...watchItem,
      totalEpisodes,
      watchedEpisodes,
      progress,
    }

    setLifeData((prev) => ({
      ...prev,
      watchlist: [newWatchItem, ...prev.watchlist],
    }))
  }

  const updateWatchEpisodes = (watchId, watchedEpisodes) => {
    setLifeData((prev) => ({
      ...prev,
      watchlist: prev.watchlist.map((item) => {
        if (item.id !== watchId) {
          return item
        }

        const totalEpisodes = Number(item.totalEpisodes) || 1
        const fixedWatchedEpisodes = Math.min(
          totalEpisodes,
          Math.max(0, Number(watchedEpisodes) || 0)
        )

        return {
          ...item,
          watchedEpisodes: fixedWatchedEpisodes,
          progress: calculateEpisodeProgress(
            fixedWatchedEpisodes,
            totalEpisodes
          ),
          status:
            fixedWatchedEpisodes === totalEpisodes ? 'Completed' : item.status,
        }
      }),
    }))
  }

  const deleteWatchItem = (watchId) => {
    setLifeData((prev) => ({
      ...prev,
      watchlist: prev.watchlist.filter((item) => item.id !== watchId),
    }))
  }

  const updateSettings = (newSettings) => {
    setLifeData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }))
  }

  const updateUser = (newUserData) => {
    setLifeData((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        ...newUserData,
      },
    }))
  }

  const importLifeData = (importedData) => {
    setLifeData(importedData)
  }

  const resetLifeData = () => {
    clearLifeData()
    setLifeData(defaultLifeData)
  }

  const value = {
    lifeData,

    addGoal,
    updateGoalProgress,
    deleteGoal,

    addWorkout,
    updateWorkoutProgress,
    deleteWorkout,

    addStudyItem,
    updateStudyProgress,
    deleteStudyItem,

    addReadingItem,
    updateReadingProgress,
    updateReadingUnits,
    deleteReadingItem,

    addWatchItem,
    updateWatchEpisodes,
    deleteWatchItem,

    updateSettings,
    updateUser,
    importLifeData,
    resetLifeData,
  }

  return (
    <LifeDataContext.Provider value={value}>
      {children}
    </LifeDataContext.Provider>
  )
}

export function useLifeData() {
  const context = useContext(LifeDataContext)

  if (!context) {
    throw new Error('useLifeData must be used inside LifeDataProvider')
  }

  return context
}
