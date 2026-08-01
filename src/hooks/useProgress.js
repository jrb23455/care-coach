import { useState, useCallback, useEffect } from 'react'

const KEY = 'carecoach_progress'

function today() { return new Date().toDateString() }
function yesterday() { return new Date(Date.now() - 86_400_000).toDateString() }

function defaultState() {
  return {
    completed: {},   // scenarioId -> { score, completedAt }
    xp: 0,
    streak: 0,
    lastActiveDate: null,
  }
}

function load() {
  try { return { ...defaultState(), ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
  catch { return defaultState() }
}

export function useProgress() {
  const [prog, setProg] = useState(load)

  const completeScenario = useCallback((scenarioId, score) => {
    setProg(prev => {
      const alreadyDone = !!prev.completed[scenarioId]
      const xpEarned = alreadyDone ? 10 : (score >= 90 ? 50 : 25)

      const td = today()
      let streak = prev.streak
      if (prev.lastActiveDate !== td) {
        streak = prev.lastActiveDate === yesterday() ? streak + 1 : 1
      }

      const next = {
        ...prev,
        completed: { ...prev.completed, [scenarioId]: { score, completedAt: Date.now() } },
        xp: prev.xp + xpEarned,
        streak,
        lastActiveDate: td,
      }
      localStorage.setItem(KEY, JSON.stringify(next))
      window.dispatchEvent(new StorageEvent('storage', { key: KEY }))
      return next
    })
  }, [])

  useEffect(() => {
    function onStorage(e) {
      if (e.key === KEY) setProg(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // pillar progress: count completed scenarios per pillar (5 per pillar)
  function pillarProgress(pillar, scenarios) {
    const ids = scenarios.filter(s => s.pillar === pillar).map(s => s.id)
    const done = ids.filter(id => prog.completed[id]).length
    return { done, total: ids.length }
  }

  const xpLevel = Math.floor(prog.xp / 100) + 1
  const xpInLevel = prog.xp % 100

  return { prog, completeScenario, pillarProgress, xpLevel, xpInLevel }
}
