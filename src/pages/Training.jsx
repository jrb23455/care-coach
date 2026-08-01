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

function ScenarioBrowser({ prog, onStart }) {
  const [filter, setFilter] = useState('all')
  const pillars = ['all', 'understand', 'deescalate', 'respond', 'resolve']
  const shown = filter === 'all' ? practiceScenarios : practiceScenarios.filter(s => s.pillar === filter)

  return (
    <div>
      {/* filter bar */}
      <div className="flex gap-2 flex-wrap mb-6">
        {pillars.map(p => (
          <button key={p}
            onClick={() => setFilter(p)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={{
              background: filter === p ? '#0B0934' : '#F3F4F6',
              color: filter === p ? '#fff' : '#374151',
            }}>
            {p === 'all' ? 'All Scenarios' : PILLAR_LABELS[p]}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {shown.map(s => {
          const done = prog.completed[s.id]
          return (
            <div key={s.id}
              className="border rounded-xl p-4 flex items-start justify-between gap-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
              onClick={() => onStart(s)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: PILLAR_BG[s.pillar], color: PILLAR_COLORS[s.pillar] }}>
                    {PILLAR_LABELS[s.pillar]}
                  </span>
                  <span className="text-xs font-medium" style={{ color: DIFFICULTY_COLOR[s.difficulty] }}>
                    {DIFFICULTY_LABEL[s.difficulty]}
                  </span>
                  {done && (
                    <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M13.5 2.5l-7 7-3-3L2 8l4.5 4.5 8.5-8.5z"/></svg>
                      {done.score}pts
                    </span>
                  )}
                </div>
                <div className="font-semibold text-gray-800">{s.title}</div>
                <div className="text-sm text-gray-500 mt-0.5 line-clamp-1">"{s.customerLine.slice(0, 80)}…"</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-indigo-500 font-semibold mb-1">+{s.xp} XP</div>
                <button className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
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

function ScenarioPlayer({ scenario, onComplete, onBack }) {
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
              Finish (+{chosen?.score >= 90 ? scenario.xp : Math.floor(scenario.xp / 2)} XP)
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
          <div key={p} className="bg-white rounded-xl border p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
            <ProgressRing value={done} max={total} size={72} stroke={7} color={PILLAR_COLORS[p]}>
              <span className="text-xs font-black" style={{ color: PILLAR_COLORS[p] }}>{done}/{total}</span>
            </ProgressRing>
            <div className="text-xs font-semibold text-gray-700 mt-2">{PILLAR_LABELS[p]}</div>
            {nextUp && (
              <button onClick={() => onStart(nextUp)}
                className="mt-2 text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium hover:bg-indigo-100 transition-colors">
                Next →
              </button>
            )}
            {done === total && (
              <span className="mt-2 text-xs font-bold text-green-600">✓ Complete</span>
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
      completeScenario(activeScenario.id, score)
      setLastResult({ scenario: activeScenario, score })
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
            <h1 className="text-2xl font-black text-gray-900">Training Center</h1>
            <p className="text-gray-500 text-sm mt-0.5">Practice real customer scenarios with scored feedback</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-medium">Level {xpLevel}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-24 h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${xpInLevel}%` }} />
            </div>
            <span className="text-xs font-bold text-indigo-600">{xpInLevel}/100 XP</span>
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
              {lastResult.score >= 90 ? `Perfect — you earned ${lastResult.scenario.xp} XP!` : `Good practice — keep going.`}
            </div>
          </div>
          <button onClick={() => setLastResult(null)} className="ml-auto text-gray-400 hover:text-gray-600">✕</button>
        </div>
      )}

      {activeScenario ? (
        <ScenarioPlayer
          scenario={activeScenario}
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
