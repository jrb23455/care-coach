import { useState, useRef, useEffect, useMemo } from 'react'
import { practiceScenarios } from '../data/practiceScenarios'
import { useProgress } from '../hooks/useProgress'
import ProgressRing from '../components/ProgressRing'
import CoraRobot from '../components/CoraRobot'

const PILLAR_LABELS = { understand: 'Understand', deescalate: 'De-escalate', respond: 'Respond', resolve: 'Resolve & Close' }
const PILLAR_COLORS = { understand: '#6B4EF3', deescalate: '#EC4899', respond: '#F59E0B', resolve: '#10B981' }
const PILLAR_BG    = { understand: 'rgba(107,78,243,0.12)', deescalate: 'rgba(236,72,153,0.12)', respond: 'rgba(245,158,11,0.12)', resolve: 'rgba(16,185,129,0.12)' }
const DIFFICULTY_LABEL = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
const DIFFICULTY_COLOR = { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' }
const DIFFICULTY_BG    = { beginner: 'rgba(16,185,129,0.12)', intermediate: 'rgba(245,158,11,0.12)', advanced: 'rgba(239,68,68,0.12)' }

/* ── Scenario browser ── */
function ScenarioBrowser({ prog, onStart, initialFilter = 'all' }) {
  const [filter, setFilter] = useState(initialFilter)
  const [search, setSearch] = useState('')
  const pillars = ['all', 'understand', 'deescalate', 'respond', 'resolve']
  const shown = practiceScenarios
    .filter(s => filter === 'all' || s.pillar === filter)
    .filter(s => !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.customerLine.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search scenarios…"
        className="w-full rounded-2xl px-4 py-2.5 text-sm font-semibold focus:outline-none transition-all mb-3"
        style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text)' }}
      />
      <div className="flex gap-2 flex-wrap mb-6">
        {pillars.map(p => {
          const active = filter === p
          const col = p === 'all' ? '#7B3FF2' : PILLAR_COLORS[p]
          return (
            <button key={p} onClick={() => setFilter(p)}
              className="px-4 py-1.5 rounded-2xl text-sm font-black transition-all hover:scale-105"
              style={{ background: active ? col : PILLAR_BG[p] ?? 'rgba(123,63,242,0.09)', color: active ? '#fff' : col, boxShadow: active ? `0 4px 12px ${col}40` : 'none' }}>
              {p === 'all' ? 'All Scenarios' : PILLAR_LABELS[p]}
            </button>
          )
        })}
      </div>

      {shown.length === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--text-3)' }}>
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm font-semibold">No scenarios match "{search}"</p>
        </div>
      )}

      <div className="grid gap-3">
        {shown.map(s => {
          const done = prog.completed[s.id]
          const pc = PILLAR_COLORS[s.pillar]
          const history = done?.history
          return (
            <div key={s.id} onClick={() => onStart(s)}
              className="rounded-2xl p-4 flex items-start justify-between gap-4 hover:shadow-md transition-all cursor-pointer hover:scale-[1.01]"
              style={{ background: 'var(--card)', border: `1.5px solid var(--border)`, borderLeft: `4px solid ${pc}` }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full" style={{ background: PILLAR_BG[s.pillar], color: pc }}>{PILLAR_LABELS[s.pillar]}</span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full" style={{ background: DIFFICULTY_BG[s.difficulty], color: DIFFICULTY_COLOR[s.difficulty] }}>{DIFFICULTY_LABEL[s.difficulty]}</span>
                  {done && (
                    <span className="text-xs font-black text-green-500 flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.10)' }}>
                      <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor"><path d="M13.5 2.5l-7 7-3-3L2 8l4.5 4.5 8.5-8.5z"/></svg>
                      Best: {done.score}pts
                    </span>
                  )}
                </div>
                <div className="font-black" style={{ color: 'var(--text)' }}>{s.title}</div>
                <div className="text-sm mt-0.5 line-clamp-1 font-semibold" style={{ color: 'var(--text-2)' }}>"{s.customerLine.length > 80 ? s.customerLine.slice(0, 80) + '…' : s.customerLine}"</div>
                {history && history.length > 1 && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-[9px] font-bold mr-0.5" style={{ color: 'var(--text-3)' }}>Attempts:</span>
                    {history.slice(-5).map((h, j) => (
                      <span key={j} className="text-[9px] font-black px-1.5 py-0.5 rounded-md"
                        style={{
                          background: h.score >= 80 ? 'rgba(16,185,129,0.15)' : h.score >= 50 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                          color: h.score >= 80 ? '#10B981' : h.score >= 50 ? '#F59E0B' : '#EF4444',
                        }}>
                        {h.score}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-black mb-2" style={{ color: pc }}>{done ? '+0–5 XP' : `+${s.xp} XP`}</div>
                <button className="text-xs px-3 py-1.5 rounded-xl font-black text-white transition-all hover:scale-105"
                  style={{ background: done ? 'linear-gradient(135deg,#7B3FF2,#a855f7)' : `linear-gradient(135deg,${pc},${pc}cc)`, boxShadow: `0 3px 10px ${pc}40` }}>
                  {done ? 'Retry' : 'Start'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Scenario player ── */
const TIMER_SECONDS = 60

function ScenarioPlayer({ scenario, prevBest, onComplete, onBack }) {
  const [phase, setPhase] = useState('intro')
  const [chosen, setChosen] = useState(null)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [timedOut, setTimedOut] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (phase !== 'question') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setTimedOut(true); setPhase('result'); setChosen({ score: 0, text: '(no response)', feedback: "You didn't respond in time. On a real call the customer is still waiting — speed is part of the skill." }); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  function pick(opt) { clearInterval(timerRef.current); setChosen(opt); setPhase('result') }
  function nextPhase() {
    if (phase === 'intro') { setPhase('question'); setTimeLeft(TIMER_SECONDS) }
    else if (phase === 'result') setPhase('expert')
    else onComplete(chosen?.score ?? 0)
  }

  const isRetry = prevBest !== null && prevBest !== undefined
  function calcXP(score) {
    if (!isRetry) return score >= 90 ? scenario.xp : Math.floor(scenario.xp / 2)
    return score > prevBest ? 5 : 0
  }

  const timerColor = timeLeft > 30 ? '#10B981' : timeLeft > 10 ? '#F59E0B' : '#EF4444'
  const pc = PILLAR_COLORS[scenario.pillar]

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold mb-6 hover:underline" style={{ color: 'var(--text-2)' }}>
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 12L6 8l4-4"/></svg>
        Back to scenarios
      </button>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ background: PILLAR_BG[scenario.pillar], color: pc }}>{PILLAR_LABELS[scenario.pillar]}</span>
        <span className="font-black" style={{ color: 'var(--text)' }}>{scenario.title}</span>
        <span className="ml-auto text-xs font-black" style={{ color: pc }}>+{scenario.xp} XP</span>
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div className="rounded-2xl p-6 text-center" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4" style={{ background: PILLAR_BG[scenario.pillar] }}>🎭</div>
          <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text)' }}>{scenario.title}</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>A customer calls in. Choose the best response within 60 seconds.</p>
          <div className="rounded-2xl p-4 mb-6 text-left" style={{ background: 'rgba(245,158,11,0.10)', border: '1.5px solid rgba(245,158,11,0.25)' }}>
            <div className="text-xs font-black text-amber-500 mb-1">CUSTOMER SAYS:</div>
            <div className="font-semibold italic" style={{ color: 'var(--text)' }}>"{scenario.customerLine}"</div>
          </div>
          <button onClick={nextPhase} className="px-8 py-3 rounded-2xl font-black text-white transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg,${pc},${pc}cc)`, boxShadow: `0 4px 14px ${pc}40` }}>
            Start Scenario
          </button>
        </div>
      )}

      {/* QUESTION */}
      {phase === 'question' && (
        <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-bold" style={{ color: 'var(--text-2)' }}>What do you say?</div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" width="14" height="14" fill={timerColor}><circle cx="8" cy="8" r="7" fill="none" stroke={timerColor} strokeWidth="2"/><path d="M8 4v4l3 2" stroke={timerColor} strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
              <span className="text-sm font-black" style={{ color: timerColor }} aria-live="polite" aria-atomic="true">{timeLeft}s</span>
            </div>
          </div>
          <div className="rounded-2xl p-4 mb-5 italic font-semibold" style={{ color: 'var(--text)', background: 'rgba(245,158,11,0.10)', border: '1.5px solid rgba(245,158,11,0.20)' }}>
            "{scenario.customerLine}"
          </div>
          <div className="grid gap-3">
            {scenario.options.map((opt, i) => (
              <button key={i} onClick={() => pick(opt)}
                className="text-left p-4 rounded-2xl font-semibold transition-all text-sm hover:scale-[1.01]"
                style={{ background: 'var(--bg)', border: '2px solid var(--border)', color: 'var(--text)' }}>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && chosen && (
        <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          {timedOut && (
            <div className="rounded-xl p-3 mb-4 text-sm font-bold" style={{ background: 'rgba(239,68,68,0.10)', border: '1.5px solid rgba(239,68,68,0.20)', color: '#EF4444' }}>
              Time's up! The customer is still waiting — speed matters.
            </div>
          )}
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-black" style={{ color: chosen.score >= 80 ? '#10B981' : chosen.score >= 50 ? '#F59E0B' : '#EF4444' }}>{chosen.score}</div>
            <div>
              <div className="font-black" style={{ color: 'var(--text)' }}>
                {chosen.score >= 90 ? 'Excellent!' : chosen.score >= 75 ? 'Good response' : chosen.score >= 50 ? 'Needs work' : 'Avoid this'}
              </div>
              <div className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>out of 100</div>
            </div>
          </div>
          <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(107,78,243,0.08)', border: '1.5px solid rgba(107,78,243,0.18)' }}>
            <div className="text-xs font-black text-indigo-400 mb-1">YOU CHOSE:</div>
            <div className="text-sm italic mb-2" style={{ color: 'var(--text)' }}>"{chosen.text}"</div>
            <div className="text-sm" style={{ color: 'var(--text-2)' }}>{chosen.feedback}</div>
          </div>
          <button onClick={nextPhase} className="w-full py-3 rounded-2xl font-black text-white"
            style={{ background: 'linear-gradient(135deg,#7B3FF2,#a855f7)' }}>
            See Expert Response
          </button>
        </div>
      )}

      {/* EXPERT */}
      {phase === 'expert' && (
        <div className="rounded-2xl p-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg" style={{ background: 'rgba(107,78,243,0.12)' }}>🤖</div>
            <div className="font-black" style={{ color: 'var(--text)' }}>Expert Response (Cora)</div>
          </div>
          <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1.5px solid rgba(16,185,129,0.20)' }}>
            <div className="text-xs font-black text-green-500 mb-2">BEST ANSWER:</div>
            <div className="italic" style={{ color: 'var(--text)' }}>"{scenario.expertResponse}"</div>
          </div>
          {(() => {
            const bestOpt = scenario.options.reduce((a, b) => a.score > b.score ? a : b)
            return bestOpt?.feedback ? (
              <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(123,63,242,0.07)', border: '1.5px solid rgba(123,63,242,0.15)' }}>
                <div className="text-xs font-black text-purple-400 mb-1.5">WHY IT WORKS:</div>
                <div className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{bestOpt.feedback}</div>
              </div>
            ) : null
          })()}
          <div className="flex gap-3">
            <button onClick={onBack} className="flex-1 py-3 rounded-2xl font-black transition-all hover:scale-[1.01]"
              style={{ background: 'var(--bg)', border: '2px solid var(--border)', color: 'var(--text)' }}>
              Back to List
            </button>
            <button onClick={() => onComplete(chosen?.score ?? 0)} className="flex-1 py-3 rounded-2xl font-black text-white"
              style={{ background: 'linear-gradient(135deg,#7B3FF2,#a855f7)' }}>
              {(() => { const xp = calcXP(chosen?.score ?? 0); return xp > 0 ? `Finish (+${xp} XP)` : 'Finish (no new XP)' })()}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Pillar summary ── */
function PillarSummary({ prog, onStart }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {['understand', 'deescalate', 'respond', 'resolve'].map(p => {
        const ids = practiceScenarios.filter(s => s.pillar === p).map(s => s.id)
        const done = ids.filter(id => prog.completed[id]).length
        const total = ids.length
        const nextUp = practiceScenarios.find(s => s.pillar === p && !prog.completed[s.id])
        return (
          <div key={p} className="rounded-2xl p-4 flex flex-col items-center text-center hover:scale-[1.03] transition-all cursor-pointer"
            style={{ background: 'var(--card)', border: `1.5px solid var(--border)`, borderTop: `4px solid ${PILLAR_COLORS[p]}` }}>
            <ProgressRing value={done} max={total} size={72} stroke={7} color={PILLAR_COLORS[p]}>
              <span className="text-xs font-black" style={{ color: PILLAR_COLORS[p] }}>{done}/{total}</span>
            </ProgressRing>
            <div className="text-xs font-black mt-2" style={{ color: 'var(--text)' }}>{PILLAR_LABELS[p]}</div>
            {nextUp && (
              <button onClick={() => onStart(nextUp)} className="mt-2 text-xs px-2.5 py-0.5 rounded-xl font-black text-white hover:scale-105 transition-all"
                style={{ background: PILLAR_COLORS[p] }}>Next →</button>
            )}
            {done === total && (
              <span className="mt-2 text-xs font-black text-green-500 px-2 py-0.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.10)' }}>✓ Done!</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Page ── */
export default function Training() {
  const { prog, completeScenario, xpLevel, xpInLevel } = useProgress()
  const [activeScenario, setActiveScenario] = useState(null)
  const [lastResult, setLastResult] = useState(null)

  const initialFilter = useMemo(() => {
    const f = sessionStorage.getItem('training_filter')
    if (f) sessionStorage.removeItem('training_filter')
    return f || 'all'
  }, [])

  useEffect(() => {
    const autoId = sessionStorage.getItem('training_auto_scenario')
    if (autoId) {
      sessionStorage.removeItem('training_auto_scenario')
      const scenario = practiceScenarios.find(s => s.id === autoId)
      if (scenario) setActiveScenario(scenario)
    }
  }, [])

  function handleComplete(score) {
    if (activeScenario) {
      const prevBest = prog.completed[activeScenario.id]?.score ?? null
      const isRetry = prevBest !== null
      const maxXp = activeScenario.xp
      let xpEarned = 0
      if (!isRetry) xpEarned = score >= 90 ? maxXp : Math.floor(maxXp / 2)
      else if (score > prevBest) xpEarned = 5
      completeScenario(activeScenario.id, score, maxXp)
      setLastResult({ scenario: activeScenario, score, xpEarned })
    }
    setActiveScenario(null)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <CoraRobot size={64} pose="present" />
          <div>
            <h1 className="text-2xl font-black" style={{ color: 'var(--text)' }}>Training Center</h1>
            <p className="text-sm mt-0.5 font-semibold" style={{ color: 'var(--text-2)' }}>Practice real customer scenarios with scored feedback</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold" style={{ color: 'var(--text-2)' }}>Level {xpLevel}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-24 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(123,63,242,0.15)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${xpInLevel}%`, background: 'linear-gradient(90deg,#7B3FF2,#c084fc,#f472b6)' }} />
            </div>
            <span className="text-xs font-black" style={{ color: '#7B3FF2' }}>{xpInLevel} XP</span>
          </div>
        </div>
      </div>

      {lastResult && !activeScenario && (
        <div className="mb-6 p-4 rounded-2xl flex items-center gap-3"
          style={{ background: lastResult.score >= 80 ? 'rgba(16,185,129,0.10)' : 'rgba(245,158,11,0.10)', border: `1.5px solid ${lastResult.score >= 80 ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}` }}>
          <div className="text-2xl font-black" style={{ color: lastResult.score >= 80 ? '#10B981' : '#F59E0B' }}>{lastResult.score}</div>
          <div>
            <div className="font-black" style={{ color: 'var(--text)' }}>{lastResult.scenario.title} — complete!</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>
              {lastResult.xpEarned > 0 ? `+${lastResult.xpEarned} XP earned!` : 'No new XP — beat your best score to earn more.'}
            </div>
          </div>
          <button onClick={() => setLastResult(null)} className="ml-auto font-bold" style={{ color: 'var(--text-3)' }}>✕</button>
        </div>
      )}

      {activeScenario ? (
        <ScenarioPlayer scenario={activeScenario} prevBest={prog.completed[activeScenario.id]?.score ?? null}
          onComplete={handleComplete} onBack={() => setActiveScenario(null)} />
      ) : (
        <>
          <PillarSummary prog={prog} onStart={setActiveScenario} />
          <ScenarioBrowser prog={prog} onStart={setActiveScenario} initialFilter={initialFilter} />
        </>
      )}
    </div>
  )
}
