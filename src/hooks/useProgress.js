import { useSyncExternalStore, useCallback } from 'react'

const KEY = 'carecoach_progress'

function today() { return new Date().toDateString() }
function yesterday() { return new Date(Date.now() - 86_400_000).toDateString() }

function defaultState() {
  return { completed: {}, xp: 0, streak: 0, lastActiveDate: null }
}

function load() {
  try { return { ...defaultState(), ...JSON.parse(localStorage.getItem(KEY) || '{}') } }
  catch { return defaultState() }
}

// Module-level singleton store — all hook instances share one state
let _store = load()
const _listeners = new Set()

function subscribe(listener) {
  _listeners.add(listener)
  return () => _listeners.delete(listener)
}

function getSnapshot() { return _store }

function setStore(updater) {
  _store = typeof updater === 'function' ? updater(_store) : updater
  localStorage.setItem(KEY, JSON.stringify(_store))
  _listeners.forEach(fn => fn())
}

export function useProgress() {
  const prog = useSyncExternalStore(subscribe, getSnapshot)

  const completeScenario = useCallback((scenarioId, score, maxXp = 50) => {
    setStore(prev => {
      const prevEntry = prev.completed[scenarioId]
      const prevBest = prevEntry?.score ?? -1

      let xpEarned = 0
      if (!prevEntry) {
        xpEarned = score >= 90 ? maxXp : Math.floor(maxXp / 2)
      } else if (score > prevBest) {
        xpEarned = 5
      }

      const td = today()
      let streak = prev.streak
      if (prev.lastActiveDate !== td) {
        streak = prev.lastActiveDate === yesterday() ? streak + 1 : 1
      }

      return {
        ...prev,
        completed: {
          ...prev.completed,
          [scenarioId]: { score: Math.max(score, prevBest < 0 ? score : prevBest), completedAt: Date.now() },
        },
        xp: prev.xp + xpEarned,
        streak,
        lastActiveDate: td,
      }
    })
  }, [])

  function pillarProgress(pillar, scenarios) {
    const ids = scenarios.filter(s => s.pillar === pillar).map(s => s.id)
    const done = ids.filter(id => prog.completed[id]).length
    return { done, total: ids.length }
  }

  const xpLevel = Math.floor(prog.xp / 100) + 1
  const xpInLevel = prog.xp % 100

  return { prog, completeScenario, pillarProgress, xpLevel, xpInLevel }
}
