import { useState } from 'react'
import { useProgress } from '../hooks/useProgress'
import { practiceScenarios } from '../data/practiceScenarios'
import CoraRobot from '../components/CoraRobot'

const PILLAR_META = [
  { key: 'understand',  icon: '🎧', title: 'Understand',     barColor: '#6B4EF3', bg: 'bg-purple-50' },
  { key: 'deescalate', icon: '🛡️', title: 'De-escalate',    barColor: '#EC4899', bg: 'bg-pink-50'   },
  { key: 'respond',    icon: '👥', title: 'Respond',         barColor: '#10B981', bg: 'bg-teal-50'   },
  { key: 'resolve',    icon: '🏆', title: 'Resolve & Close', barColor: '#F59E0B', bg: 'bg-yellow-50' },
]

const CORA_TIPS = [
  { icon: '🎯', tip: 'Lower your voice when a customer raises theirs — calm is contagious.', tag: 'De-escalation' },
  { icon: '🗣️', tip: '"I understand" alone won\'t cut it. Follow it with why you understand.', tag: 'Empathy' },
  { icon: '⏸️', tip: 'A brief pause before responding signals confidence, not confusion.', tag: 'Tone & Pacing' },
  { icon: '🔄', tip: 'Reframe objections as questions: "What would make this feel right for you?"', tag: 'Objections' },
  { icon: '💬', tip: 'Mirror the customer\'s own words back — it shows you were truly listening.', tag: 'Active Listening' },
]

const RECOMMENDED = [
  { type: 'SCENARIO', typeColor: 'text-blue-600', title: 'Handling Objections That Turn Rude', icon: '🎧', meta: '8 min', page: 'training' },
  { type: 'TOOL', typeColor: 'text-teal-600', title: 'De-escalation Phrase Bank', icon: '📝', meta: 'Reference', page: 'help' },
  { type: 'VIDEO', typeColor: 'text-orange-500', title: "Staying Calm When They Aren't", icon: '▶️', meta: '6 min', page: 'training' },
  { type: 'QUICK TIP', typeColor: 'text-purple-600', title: '3 Things to Never Say', icon: '💡', meta: '2 min read', page: 'help' },
]

export default function Home({ setCurrentPage }) {
  const { prog, pillarProgress, xpLevel } = useProgress()
  const totalDone = Object.keys(prog.completed).length
  const totalScenarios = practiceScenarios.length
  const [tipIdx, setTipIdx] = useState(0)
  const tip = CORA_TIPS[tipIdx]

  return (
    <div className="p-6 max-w-[1200px] mx-auto">

      {/* ── Welcome row ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#13105A]">Welcome back 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's where you stand today.</p>
        </div>
        <button
          onClick={() => setCurrentPage('live')}
          className="flex items-center gap-2 bg-[#0B0934] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1a1660] transition-colors shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Open Live Coach
        </button>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Scenarios', value: `${totalDone}/${totalScenarios}`, icon: '🎯', sub: 'completed' },
          { label: 'XP Earned', value: prog.xp, icon: '⚡', sub: 'experience points' },
          { label: 'Level', value: xpLevel, icon: '🏅', sub: 'current rank' },
          { label: 'Streak', value: prog.streak > 0 ? `${prog.streak} days` : '—', icon: '🔥', sub: prog.streak > 0 ? 'keep it up!' : 'start today' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center gap-3 shadow-sm">
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className="text-lg font-bold text-[#13105A] leading-none">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label} · {s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-3 gap-5">

        {/* Left column (2/3) */}
        <div className="col-span-2 space-y-5">

          {/* Progress pillars */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#13105A] text-sm">Training Progress</h2>
              <button onClick={() => setCurrentPage('training')} className="text-xs text-[#6B4EF3] font-semibold hover:underline">Continue →</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {PILLAR_META.map(m => {
                const { done, total } = pillarProgress(m.key, practiceScenarios)
                const pct = total > 0 ? Math.round((done / total) * 100) : 0
                return (
                  <button
                    key={m.key}
                    onClick={() => setCurrentPage('training')}
                    className={`${m.bg} rounded-xl p-3 text-left hover:shadow-sm transition-all border border-transparent hover:border-gray-200`}
                  >
                    <div className="text-xl mb-2">{m.icon}</div>
                    <div className="text-xs font-bold text-[#13105A] mb-2 leading-snug">{m.title}</div>
                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                      <span>{done}/{total}</span>
                      <span style={{ color: m.barColor }}>{pct}%</span>
                    </div>
                    <div className="h-1 bg-white/70 rounded-full">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: m.barColor }} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Today's mission */}
          <div
            className="bg-gradient-to-r from-[#6B4EF3] to-[#9B7EFA] rounded-2xl p-5 flex items-center justify-between shadow-md shadow-[#6B4EF3]/20 cursor-pointer group"
            onClick={() => setCurrentPage('training')}
          >
            <div>
              <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Today's Mission</div>
              <h3 className="text-white font-bold text-base leading-snug">
                {totalDone === 0
                  ? 'Complete your first training scenario'
                  : totalDone < totalScenarios
                    ? `Keep going — ${totalScenarios - totalDone} scenarios left`
                    : 'You completed all scenarios! 🎉'}
              </h3>
              <p className="text-white/70 text-xs mt-1">
                {totalDone === 0 ? 'Start with Understand: 5 scenarios' : totalDone < totalScenarios ? 'Pick up where you left off' : 'Try replaying for a higher score'}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <CoraRobot size={80} pose="thumbs" shadow={false} />
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <span className="text-white text-lg">→</span>
              </div>
            </div>
          </div>

          {/* Recommended */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#13105A] text-sm">Recommended for You</h2>
              <button onClick={() => setCurrentPage('help')} className="text-xs text-[#6B4EF3] font-semibold hover:underline">All resources →</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {RECOMMENDED.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(r.page)}
                  className="border border-gray-100 rounded-xl p-4 text-left hover:border-[#6B4EF3]/30 hover:shadow-sm transition-all flex items-start gap-3"
                >
                  <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-lg shrink-0">{r.icon}</div>
                  <div className="min-w-0">
                    <div className={`text-[10px] font-bold ${r.typeColor} mb-0.5`}>{r.type}</div>
                    <div className="text-xs font-semibold text-[#13105A] leading-snug">{r.title}</div>
                    <div className="text-[10px] text-gray-400 mt-1">{r.meta}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column (1/3) — Cora tips */}
        <div className="space-y-4">
          {/* Cora card */}
          <div className="bg-[#0B0934] rounded-2xl overflow-hidden shadow-lg">
            <div className="flex justify-center pt-5 pb-2">
              <CoraRobot size={100} pose="think" />
            </div>
            <div className="px-4 pb-4">
              <div className="text-[10px] font-bold text-[#6B4EF3] uppercase tracking-widest mb-2">Cora's Tip</div>
              <div className="bg-white/8 rounded-xl px-3 py-3 mb-3">
                <span className="text-lg">{tip.icon}</span>
                <p className="text-xs text-white/80 leading-relaxed mt-1">{tip.tip}</p>
                <span className="inline-block mt-2 text-[10px] font-bold text-[#6B4EF3] bg-[#6B4EF3]/20 px-2 py-0.5 rounded-full">{tip.tag}</span>
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setTipIdx(i => (i - 1 + CORA_TIPS.length) % CORA_TIPS.length)}
                  className="text-gray-500 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                >←</button>
                <div className="flex gap-1">
                  {CORA_TIPS.map((_, i) => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === tipIdx ? 'bg-[#6B4EF3]' : 'bg-white/20'}`} />
                  ))}
                </div>
                <button
                  onClick={() => setTipIdx(i => (i + 1) % CORA_TIPS.length)}
                  className="text-gray-500 hover:text-white text-sm px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                >→</button>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-xs font-bold text-[#13105A] mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Practice a scenario', icon: '🎯', page: 'training' },
                { label: 'Browse resources', icon: '📚', page: 'help' },
                { label: 'Get live coaching', icon: '⚡', page: 'live' },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={() => setCurrentPage(a.page)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-[#6B4EF3]/30 hover:bg-[#F0EEFF] transition-all text-sm text-[#13105A] font-medium text-left"
                >
                  <span className="text-base">{a.icon}</span>
                  {a.label}
                  <span className="ml-auto text-gray-300 text-xs">›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
