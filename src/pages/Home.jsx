import { useState } from 'react'
import { useProgress } from '../hooks/useProgress'
import { practiceScenarios } from '../data/practiceScenarios'
import CoraRobot from '../components/CoraRobot'

const PILLAR_META = [
  { key: 'understand',  icon: '🎧', title: 'Understand',     color: '#7B3FF2', bg: 'rgba(123,63,242,0.10)' },
  { key: 'deescalate', icon: '🛡️', title: 'De-escalate',    color: '#ec4899', bg: 'rgba(236,72,153,0.10)'  },
  { key: 'respond',    icon: '👥', title: 'Respond',         color: '#f59e0b', bg: 'rgba(245,158,11,0.10)'  },
  { key: 'resolve',    icon: '🏆', title: 'Resolve & Close', color: '#10b981', bg: 'rgba(16,185,129,0.10)'  },
]

const STAT_CARDS = [
  { label: 'Scenarios', sub: 'completed',      icon: '🎯', grad: 'linear-gradient(135deg, #7B3FF2, #a855f7)', shadow: 'rgba(123,63,242,0.35)' },
  { label: 'XP Earned', sub: 'experience pts', icon: '⚡', grad: 'linear-gradient(135deg, #f59e0b, #fb923c)', shadow: 'rgba(245,158,11,0.35)' },
  { label: 'Level',     sub: 'current rank',   icon: '🏅', grad: 'linear-gradient(135deg, #06b6d4, #10b981)', shadow: 'rgba(16,185,129,0.35)' },
  { label: 'Streak',    sub: 'days in a row',  icon: '🔥', grad: 'linear-gradient(135deg, #f43f5e, #ec4899)', shadow: 'rgba(244,63,94,0.35)' },
]

const CORA_TIPS = [
  { icon: '🎯', tip: 'Lower your voice when a customer raises theirs — calm is contagious.', tag: 'De-escalation' },
  { icon: '🗣️', tip: '"I understand" alone won\'t cut it. Follow it with why you understand.', tag: 'Empathy' },
  { icon: '⏸️', tip: 'A brief pause before responding signals confidence, not confusion.', tag: 'Tone & Pacing' },
  { icon: '🔄', tip: 'Reframe objections as questions: "What would make this feel right for you?"', tag: 'Objections' },
  { icon: '💬', tip: 'Mirror the customer\'s own words back — it shows you were truly listening.', tag: 'Active Listening' },
]

const RECOMMENDED = [
  { type: 'SCENARIO',  typeColor: '#7B3FF2', bg: 'rgba(123,63,242,0.08)', title: 'Handling Objections That Turn Rude', icon: '🎧', meta: '8 min',      page: 'training' },
  { type: 'TOOL',      typeColor: '#06b6d4', bg: 'rgba(6,182,212,0.08)',   title: 'De-escalation Phrase Bank',          icon: '📝', meta: 'Reference',  page: 'help' },
  { type: 'VIDEO',     typeColor: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  title: "Staying Calm When They Aren't",       icon: '▶️', meta: '6 min',      page: 'training' },
  { type: 'QUICK TIP', typeColor: '#ec4899', bg: 'rgba(236,72,153,0.08)', title: '3 Things to Never Say',              icon: '💡', meta: '2 min read', page: 'help' },
]

export default function Home({ setCurrentPage }) {
  const { prog, pillarProgress, xpLevel } = useProgress()
  const totalDone = Object.keys(prog.completed).length
  const totalScenarios = practiceScenarios.length
  const [tipIdx, setTipIdx] = useState(0)
  const tip = CORA_TIPS[tipIdx]

  const statValues = [
    `${totalDone}/${totalScenarios}`,
    prog.xp,
    xpLevel,
    prog.streak > 0 ? `${prog.streak}` : '—',
  ]

  return (
    <div className="p-6 max-w-[1200px] mx-auto" style={{ background: 'var(--bg)', minHeight: '100%' }}>

      {/* Welcome row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black" style={{ color: 'var(--text)' }}>Welcome back 👋</h1>
          <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-2)' }}>Here's where you stand today.</p>
        </div>
        <button
          onClick={() => setCurrentPage('live')}
          className="flex items-center gap-2 text-white text-sm font-black px-5 py-2.5 rounded-2xl transition-all hover:scale-105 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0f0b30, #1a0850)', boxShadow: '0 4px 16px rgba(15,11,48,0.35)' }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Open Live Coach
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map((s, i) => (
          <div key={s.label}
            className="rounded-3xl px-5 py-4 flex items-center gap-3 transition-transform hover:scale-[1.02]"
            style={{ background: s.grad, boxShadow: `0 8px 24px ${s.shadow}` }}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <div className="text-2xl font-black text-white leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {statValues[i]}
              </div>
              <div className="text-xs text-white/70 font-bold mt-1 uppercase tracking-wide">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-5">

        {/* Left col */}
        <div className="col-span-2 space-y-5">

          {/* Progress pillars */}
          <div className="rounded-3xl shadow-sm p-5" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-sm" style={{ color: 'var(--text)' }}>Training Progress</h2>
              <button onClick={() => setCurrentPage('training')} className="text-xs font-black hover:underline" style={{ color: '#7B3FF2' }}>Continue →</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {PILLAR_META.map(m => {
                const { done, total } = pillarProgress(m.key, practiceScenarios)
                const pct = total > 0 ? Math.round((done / total) * 100) : 0
                return (
                  <button key={m.key} onClick={() => setCurrentPage('training')}
                    className="rounded-2xl p-3 text-left hover:scale-[1.03] transition-all"
                    style={{ background: m.bg }}>
                    <div className="text-xl mb-2">{m.icon}</div>
                    <div className="text-xs font-black mb-2 leading-snug" style={{ color: 'var(--text)' }}>{m.title}</div>
                    <div className="flex justify-between text-[10px] font-bold mb-1" style={{ color: m.color }}>
                      <span>{done}/{total}</span><span>{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.40)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: m.color }} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Today's mission */}
          <div className="rounded-3xl p-5 flex items-center justify-between cursor-pointer group transition-all hover:scale-[1.01]"
            onClick={() => setCurrentPage('training')}
            style={{ background: 'linear-gradient(135deg, #7B3FF2 0%, #a855f7 60%, #c084fc 100%)', boxShadow: '0 8px 28px rgba(123,63,242,0.30)' }}>
            <div>
              <div className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Today's Mission</div>
              <h3 className="text-white font-black text-base leading-snug">
                {totalDone === 0 ? 'Complete your first training scenario'
                  : totalDone < totalScenarios ? `Keep going — ${totalScenarios - totalDone} scenarios left`
                  : 'You completed all scenarios! 🎉'}
              </h3>
              <p className="text-white/70 text-xs font-semibold mt-1">
                {totalDone === 0 ? 'Start with Understand: 5 scenarios'
                  : totalDone < totalScenarios ? 'Pick up where you left off'
                  : 'Try replaying for a higher score'}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <CoraRobot size={80} pose="thumbs" shadow={false} />
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <span className="text-white text-lg font-black">→</span>
              </div>
            </div>
          </div>

          {/* Recommended */}
          <div className="rounded-3xl shadow-sm p-5" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-sm" style={{ color: 'var(--text)' }}>Recommended for You</h2>
              <button onClick={() => setCurrentPage('help')} className="text-xs font-black hover:underline" style={{ color: '#7B3FF2' }}>All resources →</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {RECOMMENDED.map((r, i) => (
                <button key={i} onClick={() => setCurrentPage(r.page)}
                  className="rounded-2xl p-4 text-left hover:scale-[1.02] transition-all flex items-start gap-3"
                  style={{ background: r.bg }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm" style={{ background: 'var(--card)' }}>{r.icon}</div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black mb-0.5 uppercase tracking-wide" style={{ color: r.typeColor }}>{r.type}</div>
                    <div className="text-xs font-bold leading-snug" style={{ color: 'var(--text)' }}>{r.title}</div>
                    <div className="text-[10px] font-semibold mt-1" style={{ color: 'var(--text-3)' }}>{r.meta}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right col — Cora */}
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(165deg, #0f0b30 0%, #1a0850 100%)' }}>
            <div className="flex justify-center pt-5 pb-2">
              <CoraRobot size={100} pose="yawn" />
            </div>
            <div className="px-4 pb-4">
              <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Cora's Tip</div>
              <div className="rounded-2xl px-3 py-3 mb-3" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <span className="text-lg">{tip.icon}</span>
                <p className="text-xs text-white/80 font-semibold leading-relaxed mt-1">{tip.tip}</p>
                <span className="inline-block mt-2 text-[10px] font-black px-2 py-0.5 rounded-full" style={{ color: '#c084fc', background: 'rgba(192,132,252,0.15)' }}>{tip.tag}</span>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={() => setTipIdx(i => (i - 1 + CORA_TIPS.length) % CORA_TIPS.length)}
                  className="text-gray-500 hover:text-white text-sm px-2 py-1 rounded-xl hover:bg-white/10 transition-colors font-bold">←</button>
                <div className="flex gap-1">
                  {CORA_TIPS.map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{ background: i === tipIdx ? '#a855f7' : 'rgba(255,255,255,0.2)' }} />
                  ))}
                </div>
                <button onClick={() => setTipIdx(i => (i + 1) % CORA_TIPS.length)}
                  className="text-gray-500 hover:text-white text-sm px-2 py-1 rounded-xl hover:bg-white/10 transition-colors font-bold">→</button>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-3xl shadow-sm p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <h3 className="text-xs font-black mb-3 uppercase tracking-wide" style={{ color: 'var(--text)' }}>Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Practice a scenario', icon: '🎯', page: 'training', color: '#7B3FF2', bg: 'rgba(123,63,242,0.08)' },
                { label: 'Browse resources',    icon: '📚', page: 'help',     color: '#06b6d4', bg: 'rgba(6,182,212,0.08)' },
                { label: 'Get live coaching',   icon: '⚡', page: 'live',     color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
              ].map(a => (
                <button key={a.label} onClick={() => setCurrentPage(a.page)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all text-sm font-bold text-left hover:scale-[1.02]"
                  style={{ background: a.bg, color: a.color }}>
                  <span className="text-base">{a.icon}</span>
                  {a.label}
                  <span className="ml-auto text-xs opacity-50">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
