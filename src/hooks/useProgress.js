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

let _store = load()
const _listeners = new Set()
function subscribe(listener) { _listeners.add(listener); return () => _listeners.delete(listener) }
function getSnapshot() { return _store }
function setStore(updater) {
  _store = typeof updater === 'function' ? updater(_store) : updater
  localStorage.setItem(KEY, JSON.stringify(_store))
  _listeners.forEach(fn => fn())
}

export const BADGES = [
  { id: 'first',        icon: '🎯', label: 'First Step',    desc: 'Complete your first scenario' },
  { id: 'perfect',      icon: '💯', label: 'Perfect Score',  desc: 'Score 100 on any scenario' },
  { id: 'five',         icon: '🎩', label: 'Getting There',  desc: 'Complete 5 scenarios' },
  { id: 'all_done',     icon: '🎓', label: 'Graduated',      desc: 'Complete all scenarios' },
  { id: 'all_pillars',  icon: '🌟', label: 'Well Rounded',   desc: 'Complete at least one in each pillar' },
  { id: 'streak_3',     icon: '🔥', label: 'On Fire',        desc: '3-day streak' },
  { id: 'streak_7',     icon: '⚡', label: 'Unstoppable',    desc: '7-day streak' },
  { id: 'xp_100',       icon: '💎', label: 'Centurion',      desc: 'Earn 100 XP' },
  { id: 'xp_300',       icon: '🚀', label: 'Elite',          desc: 'Earn 300 XP' },
  { id: 'improver',     icon: '📈', label: 'Improver',       desc: 'Beat your best score on a retry' },
]

export function computeBadges(prog, scenarios) {
  const done = Object.keys(prog.completed)
  const pillars = [...new Set(scenarios.map(s => s.pillar))]
  const allPillarsDone = pillars.every(p => scenarios.some(s => s.pillar === p && prog.completed[s.id]))
  const hasPerfect = Object.values(prog.completed).some(e => e.score >= 100)
  const hasImproved = Object.values(prog.completed).some(e =>
    (e.history?.length ?? 0) > 1 && e.score > (e.history[0]?.score ?? 0)
  )

  const earned = new Set()
  if (done.length >= 1) earned.add('first')
  if (hasPerfect) earned.add('perfect')
  if (done.length >= 5) earned.add('five')
  if (done.length >= scenarios.length && scenarios.length > 0) earned.add('all_done')
  if (allPillarsDone) earned.add('all_pillars')
  if (prog.streak >= 3) earned.add('streak_3')
  if (prog.streak >= 7) earned.add('streak_7')
  if (prog.xp >= 100) earned.add('xp_100')
  if (prog.xp >= 300) earned.add('xp_300')
  if (hasImproved) earned.add('improver')

  return BADGES.map(b => ({ ...b, earned: earned.has(b.id) }))
}

export function useProgress() {
  const prog = useSyncExternalStore(subscribe, getSnapshot)

  const completeScenario = useCallback((scenarioId, score, maxXp = 50) => {
    setStore(prev => {
      const prevEntry = prev.completed[scenarioId]
      const prevBest = prevEntry?.score ?? -1
      const existingHistory = prevEntry?.history
        || (prevEntry ? [{ score: prevEntry.score, completedAt: prevEntry.completedAt }] : [])

      let xpEarned = 0
      if (!prevEntry) xpEarned = score >= 90 ? maxXp : Math.floor(maxXp / 2)
      else if (score > prevBest) xpEarned = 5

      const td = today()
      let streak = prev.streak
      if (prev.lastActiveDate !== td) {
        streak = prev.lastActiveDate === yesterday() ? streak + 1 : 1
      }

      return {
        ...prev,
        completed: {
          ...prev.completed,
          [scenarioId]: {
            score: Math.max(score, prevBest < 0 ? score : prevBest),
            completedAt: Date.now(),
            history: [...existingHistory, { score, completedAt: Date.now() }],
          },
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
