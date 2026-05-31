import { getMatrixInsights } from './matrixInsights.js'

export function buildMatrixReport(lifeData = {}) {
  const insights = getMatrixInsights(lifeData)
  const stats = insights.stats

  const user = lifeData.user || {}
  const name = user.name || user.username || 'User'

  const date = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const moduleLines = insights.modules
    .map(
      (module) =>
        `- ${module.name}: ${module.progress}% progress, ${module.count} items, health: ${module.health}`
    )
    .join('\n')

  const recommendationLines = insights.recommendations
    .map((item) => `- ${item.title}: ${item.text}`)
    .join('\n')

  const badgeLines = stats.badges
    .map((badge) => `- ${badge.title}: ${badge.unlocked ? 'Unlocked' : 'Locked'}`)
    .join('\n')

  return `LIFE MATRIX REPORT
Generated: ${date}
Player: ${name}

SYSTEM SUMMARY
Rank: ${stats.calculatedRank}
Level: ${stats.level}
XP: ${stats.calculatedXp}
Overall Progress: ${stats.overallProgress}%
Tracked Items: ${stats.totalItems}
Completed Items: ${stats.completedItems}
Unlocked Badges: ${stats.unlockedBadges.length}/${stats.badges.length}

MODULE HEALTH
${moduleLines}

RECOMMENDATIONS
${recommendationLines}

BADGES
${badgeLines}

NEXT FOCUS
Weakest Module: ${insights.weakestModule.name} (${insights.weakestModule.progress}%)
Strongest Module: ${insights.strongestModule.name} (${insights.strongestModule.progress}%)
`
}

export function downloadTextReport(lifeData = {}) {
  const report = buildMatrixReport(lifeData)
  const blob = new Blob([report], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'life-matrix-report.txt'
  link.click()

  URL.revokeObjectURL(url)
}

export function downloadJsonReport(lifeData = {}) {
  const insights = getMatrixInsights(lifeData)

  const payload = {
    generatedAt: new Date().toISOString(),
    stats: insights.stats,
    modules: insights.modules,
    weakestModule: insights.weakestModule,
    strongestModule: insights.strongestModule,
    recommendations: insights.recommendations,
    timeline: insights.timeline,
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'life-matrix-report.json'
  link.click()

  URL.revokeObjectURL(url)
}
