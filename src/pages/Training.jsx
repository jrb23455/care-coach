import { useState, useRef, useEffect } from 'react'
import { practiceScenarios } from '../data/practiceScenarios'
import { useProgress } from '../hooks/useProgress'
import ProgressRing from '../components/ProgressRing'
import CoraRobot from '../components/CoraRobot'

const PILLAR_LABELS = {
  understand: 'Understand',
  deescalate: 'De-escalate',
  respond: 'Respond',
  resolve: 'Resolve & Close',
}
const PILLAR_COLORS = {
  understand: '#6B4EF3',
  deescalate: '#EC4899',
  respond: '#F59E0B',
  resolve: '#10B981',
}
const PILLAR_BG = {
  understand: '#F3F0FF',
  deescalate: '#FDF2F8',
  respond: '#FFFBEB',
  resolve: '#ECFDF5',
}
const DIFFICULTY_LABEL = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }
const DIFFICULTY_COLOR = { beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444' }
const DIFFICULTY_BG = { beginner: 'rgba(16,185,129,0.12)', intermediate: 'rgba(245,158,11,0.12)', advanced: 'rgba(239,68,68,0.12)' }

function ScenarioBrowser({ prog, onStart }) {
  const [filter, setFilter] = useState('all')
  const pillars = ['all', 'understand', 'deescalate', 'respond', 'resolve']
  const shown = filter === 'all' ? practiceScenarios : practiceScenarios.filter(s => s.pillar === filter)

  return (
    <div>
      {/* filter bar */}
      <div className="flex gap-2 flex-wrap mb-6">
        {pillars.map(p => {
          const active = filter === p
          const col = p === 'all' ? '#7B3FF2' : PILLAR_COLORS[p]
          return (
            <button key={p}
              onClick={() => setFilter(p)}
              className="px-4 py-1.5 rounded-2xl text-sm font-black transition-all hover:scale-105"
              style={{
                background: active ? col : p === 'all' ? 'rgba(123,63,242,0.09)' : PILLAR_BG[p],
                color: active ? '#fff' : col,
                boxShadow: active ? `0 4px 12px ${col}40` : 'none',
              }}>
              {p === 'all' ? 'All Scenarios' : PILLAR_LABELS[p]}
            </button>
          )
        })}
      </div>

      <div className="grid gap-3">
        {shown.map(s => {
          const done = prog.completed[s.id]
          const pillarColor = PILLAR_COLORS[s.pillar]
          return (
            <div key={s.id}
              className="rounded-2xl p-4 flex items-start justify-between gap-4 hover:shadow-md transition-all cursor-pointer bg-white hover:scale-[1.01]"
              style={{ border: `1.5px solid #ede9fe`, borderLeft: `4px solid ${pillarColor}` }}
              onClick={() => onStart(s)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full"
                    style={{ background: PILLAR_BG[s.pillar], color: pillarColor }}>
                    {PILLAR_LABELS[s.pillar]}
                  </span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full"
                    style={{ background: DIFFICULTY_BG[s.difficulty], color: DIFFICULTY_COLOR[s.difficulty] }}>
                    {DIFFICULTY_LABEL[s.difficulty]}
                  </span>
                  {done && (
                    <span className="text-xs font-black text-green-600 flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.10)' }}>
                      <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor"><path d="M13.5 2.5l-7 7-3-3L2 8l4.5 4.5 8.5-8.5z"/></svg>
                      {done.score}pts
                    </span>
                  )}
                </div>
                <div className="font-black text-[#0f0b30]">{s.title}</div>
                <div className="text-sm text-gray-500 mt-0.5 line-clamp-1 font-semibold">"{s.customerLine.slice(0, 80)}…"</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-black mb-2" style={{ color: pillarColor }}>
                  {done ? '+0–5 XP' : `+${s.xp} XP`}
                </div>
                <button className="text-xs px-3 py-1.5 rounded-xl font-black text-white transition-all hover:scale-105"
                  style={{ background: done ? 'linear-gradient(135deg, #7B3FF2, #a855f7)' : `linear-gradient(135deg, ${pillarColor}, ${pillarColor}cc)`, boxShadow: `0 3px 10px ${pillarColor}40` }}>
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

const TIMER_SECONDS = 60

function ScenarioPlayer({ scenario, prevBest, onComplete, onBack }) {
  const [phase, setPhase] = useState('intro')  // intro | question | result | expert
  const [chosen, setChosen] = useState(null)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [timedOut, setTimedOut] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (phase !== 'question') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setTimedOut(true)
          setPhase('result')
          setChosen(scenario.options[0])  // show worst-case
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [phase])

  function pick(opt) {
    clearInterval(timerRef.current)
    setChosen(opt)
    setPhase('result')
  }

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

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10 12L6 8l4-4"/>
        </svg>
        Back to scenarios
      </button>

      {/* header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-semibold px-2 py-1 rounded-full"
          style={{ background: PILLAR_BG[scenario.pillar], color: PILLAR_COLORS[scenario.pillar] }}>
          {PILLAR_LABELS[scenario.pillar]}
        </span>
        <span className="font-semibold text-gray-800">{scenario.title}</span>
        <span className="ml-auto text-xs text-indigo-500 font-semibold">+{scenario.xp} XP</span>
      </div>

      {/* INTRO */}
      {phase === 'intro' && (
        <div className="bg-white rounded-2xl border p-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4"
            style={{ background: PILLAR_BG[scenario.pillar] }}>
            🎭
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{scenario.title}</h2>
          <p className="text-gray-500 mb-6">A customer calls in. Choose the best response within 60 seconds.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
            <div className="text-xs font-semibold text-amber-600 mb-1">CUSTOMER SAYS:</div>
            <div className="text-gray-800 font-medium italic">"{scenario.customerLine}"</div>
          </div>
          <button onClick={nextPhase}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-transform hover:scale-105"
            style={{ background: '#6B4EF3' }}>
            Start Scenario
          </button>
        </div>
      )}

      {/* QUESTION */}
      {phase === 'question' && (
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-500">What do you say?</div>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 16 16" width="14" height="14" fill={timerColor}><circle cx="8" cy="8" r="7" fill="none" stroke={timerColor} strokeWidth="2"/><path d="M8 4v4l3 2" stroke={timerColor} strokeWidth="1.5" strokeLinecap="round" fill="none"/></svg>
              <span className="text-sm font-bold" style={{ color: timerColor }}>{timeLeft}s</span>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 italic text-gray-800">
            "{scenario.customerLine}"
          </div>
          <div className="grid gap-3">
            {scenario.options.map((opt, i) => (
              <button key={i} onClick={() => pick(opt)}
                className="text-left p-4 rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-gray-800 text-sm">
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESULT */}
      {phase === 'result' && chosen && (
        <div className="bg-white rounded-2xl border p-6">
          {timedOut && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700 font-medium">
              Time's up! The customer is still waiting — speed matters.
            </div>
          )}
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-black" style={{ color: chosen.score >= 80 ? '#10B981' : chosen.score >= 50 ? '#F59E0B' : '#EF4444' }}>
              {chosen.score}
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {chosen.score >= 90 ? 'Excellent!' : chosen.score >= 75 ? 'Good response' : chosen.score >= 50 ? 'Needs work' : 'Avoid this'}
              </div>
              <div className="text-xs text-gray-500">out of 100</div>
            </div>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-4">
            <div className="text-xs font-semibold text-indigo-600 mb-1">YOU CHOSE:</div>
            <div className="text-gray-800 text-sm italic mb-2">"{chosen.text}"</div>
            <div className="text-gray-700 text-sm">{chosen.feedback}</div>
          </div>
          <button onClick={nextPhase}
            className="w-full py-3 rounded-xl font-semibold text-white"
            style={{ background: '#6B4EF3' }}>
            See Expert Response
          </button>
        </div>
      )}

      {/* EXPERT */}
      {phase === 'expert' && (
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-lg">🤖</div>
            <div className="font-semibold text-gray-800">Expert Response (Cora)</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="text-xs font-semibold text-green-700 mb-2">BEST ANSWER:</div>
            <div className="text-gray-800 italic">"{scenario.expertResponse}"</div>
          </div>
          <div className="text-sm text-gray-600 mb-6">
            Notice how this response validates the emotion, names the specific issue, and moves immediately toward a concrete next step — without apologizing unnecessarily.
          </div>
          <div className="flex gap-3">
            <button onClick={onBack}
              className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:border-gray-300">
              Back to List
            </button>
            <button onClick={() => onComplete(chosen?.score ?? 0)}
              className="flex-1 py-3 rounded-xl font-semibold text-white"
              style={{ background: '#6B4EF3' }}>
              {(() => {
                const xp = calcXP(chosen?.score ?? 0)
                return xp > 0 ? `Finish (+${xp} XP)` : 'Finish (no new XP)'
              })()}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PillarSummary({ prog, onStart }) {
  const pillars = ['understand', 'deescalate', 'respond', 'resolve']
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {pillars.map(p => {
        const ids = practiceScenarios.filter(s => s.pillar === p).map(s => s.id)
        const done = ids.filter(id => prog.completed[id]).length
        const total = ids.length
        const nextUp = practiceScenarios.find(s => s.pillar === p && !prog.completed[s.id])
        return (
          <div key={p} className="rounded-2xl p-4 flex flex-col items-center text-center hover:scale-[1.03] transition-all cursor-pointer"
            style={{ background: 'white', border: `1.5px solid #ede9fe`, borderTop: `4px solid ${PILLAR_COLORS[p]}` }}>
            <ProgressRing value={done} max={total} size={72} stroke={7} color={PILLAR_COLORS[p]}>
              <span className="text-xs font-black" style={{ color: PILLAR_COLORS[p] }}>{done}/{total}</span>
            </ProgressRing>
            <div className="text-xs font-black text-[#0f0b30] mt-2">{PILLAR_LABELS[p]}</div>
            {nextUp && (
              <button onClick={() => onStart(nextUp)}
                className="mt-2 text-xs px-2.5 py-0.5 rounded-xl font-black text-white hover:scale-105 transition-all"
                style={{ background: PILLAR_COLORS[p] }}>
                Next →
              </button>
            )}
            {done === total && (
              <span className="mt-2 text-xs font-black text-green-600 px-2 py-0.5 rounded-xl" style={{ background: 'rgba(16,185,129,0.10)' }}>✓ Done!</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Training() {
  const { prog, completeScenario, xpLevel, xpInLevel } = useProgress()
  const [activeScenario, setActiveScenario] = useState(null)
  const [lastResult, setLastResult] = useState(null)

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
      {/* top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <CoraRobot size={64} pose="think" />
          <div>
            <h1 className="text-2xl font-black text-[#0f0b30]">Training Center</h1>
            <p className="text-gray-500 text-sm mt-0.5 font-semibold">Practice real customer scenarios with scored feedback</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-bold">Level {xpLevel}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-24 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(123,63,242,0.12)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${xpInLevel}%`, background: 'linear-gradient(90deg, #7B3FF2, #c084fc, #f472b6)' }} />
            </div>
            <span className="text-xs font-black" style={{ color: '#7B3FF2' }}>{xpInLevel} XP</span>
          </div>
        </div>
      </div>

      {/* last result toast */}
      {lastResult && !activeScenario && (
        <div className="mb-6 p-4 rounded-xl border flex items-center gap-3"
          style={{ background: lastResult.score >= 80 ? '#ECFDF5' : '#FFFBEB', borderColor: lastResult.score >= 80 ? '#A7F3D0' : '#FDE68A' }}>
          <div className="text-2xl font-black" style={{ color: lastResult.score >= 80 ? '#10B981' : '#F59E0B' }}>
            {lastResult.score}
          </div>
          <div>
            <div className="font-semibold text-gray-800">{lastResult.scenario.title} — complete!</div>
            <div className="text-sm text-gray-600">
              {lastResult.xpEarned > 0
                ? `+${lastResult.xpEarned} XP earned!`
                : 'No new XP — beat your best score to earn more.'}
            </div>
          </div>
          <button onClick={() => setLastResult(null)} className="ml-auto text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}

      {activeScenario ? (
        <ScenarioPlayer
          scenario={activeScenario}
          prevBest={prog.completed[activeScenario.id]?.score ?? null}
          onComplete={handleComplete}
          onBack={() => setActiveScenario(null)}
        />
      ) : (
        <>
          <PillarSummary prog={prog} onStart={setActiveScenario} />
          <ScenarioBrowser prog={prog} onStart={setActiveScenario} />
        </>
      )}
    </div>
  )
}
