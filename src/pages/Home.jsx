import CoraRobot from '../components/CoraRobot'
import { useProgress } from '../hooks/useProgress'
import { practiceScenarios } from '../data/practiceScenarios'

const PILLAR_META = [
  { key: 'understand',  icon: '🎧', iconBg: 'bg-purple-100', title: 'Understand',      desc: 'Learn why customers get upset and how to stay in control.',       barColor: '#6B4EF3' },
  { key: 'deescalate', icon: '🛡️', iconBg: 'bg-red-100',    title: 'De-escalate',     desc: 'Use proven techniques to calm the situation and build rapport.',  barColor: '#EC4899' },
  { key: 'respond',    icon: '👥', iconBg: 'bg-teal-100',   title: 'Respond',          desc: 'Use the right words and tone for any difficult customer.',        barColor: '#10B981' },
  { key: 'resolve',    icon: '🏆', iconBg: 'bg-yellow-100', title: 'Resolve & Close',  desc: 'Turn the conversation around and move toward the close.',         barColor: '#F59E0B' },
]

const recommended = [
  { type: 'SCENARIO', typeColor: 'text-blue-600', title: 'Handling Objections That Turn Rude', icon: '🎧', iconBg: 'bg-blue-100', meta: '8 min' },
  { type: 'TOOL', typeColor: 'text-teal-600', title: 'De-escalation Phrase Bank', icon: '📝', iconBg: 'bg-teal-100', meta: 'Use tool' },
  { type: 'VIDEO', typeColor: 'text-orange-500', title: "Staying Calm When They Aren't", icon: '▶️', iconBg: 'bg-orange-100', meta: '6 min' },
  { type: 'QUICK TIP', typeColor: 'text-purple-600', title: '3 Things to Never Say to an Upset Customer', icon: '💡', iconBg: 'bg-purple-100', meta: '2 min read' },
]

export default function Home({ setCurrentPage }) {
  const { prog, pillarProgress } = useProgress()
  const totalDone = Object.keys(prog.completed).length
  const totalScenarios = practiceScenarios.length

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-[#EAE7FF] px-6 py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-2 items-center gap-8">
          <div>
            <h1 className="text-4xl font-bold text-[#13105A] leading-tight mb-4">
              Handle tough conversations<br/>with confidence.
            </h1>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-8 max-w-md">
              CARE Coach helps insurance professionals manage rude or difficult customers,
              protect the relationship, and close with confidence.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setCurrentPage('training')}
                className="bg-[#6B4EF3] hover:bg-[#5A3EE0] text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md shadow-[#6B4EF3]/30"
              >
                {totalDone > 0 ? 'Continue My Training' : 'Start Training'}
              </button>
              <button
                onClick={() => setCurrentPage('training')}
                className="flex items-center gap-2 border-2 border-[#6B4EF3] text-[#6B4EF3] font-semibold px-5 py-3 rounded-xl hover:bg-[#6B4EF3]/5 transition-colors"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="8" r="6"/><path d="M8 4v4l2.5 2.5" strokeLinecap="round"/>
                </svg>
                Quick Practice
              </button>
            </div>
          </div>

          <div className="relative flex justify-end items-end">
            {/* Speech bubble */}
            <div className="absolute top-0 left-0 bg-white rounded-2xl rounded-bl-none shadow-lg px-4 py-3 max-w-[210px] z-10">
              <p className="text-sm text-[#13105A] leading-snug">
                <span className="font-bold">Hi! I'm Cora.</span><br/>
                I'll help you handle difficult customers and turn tough calls into success.
              </p>
              {/* Decorative star */}
              <span className="absolute -top-3 -right-3 text-xl">✦</span>
            </div>
            <CoraRobot size={230} />
            <span className="absolute bottom-4 right-4 text-2xl opacity-30">✦</span>
          </div>
        </div>
      </section>

      {/* ── Progress ── */}
      <section className="bg-white px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-[#13105A]">Your Progress</h2>
            <button onClick={() => setCurrentPage('training')} className="text-sm text-[#6B4EF3] font-medium hover:underline">View all</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {PILLAR_META.map((m) => {
              const { done, total } = pillarProgress(m.key, practiceScenarios)
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <button
                  key={m.key}
                  onClick={() => setCurrentPage('training')}
                  className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm hover:border-[#6B4EF3]/30 transition-all text-left"
                >
                  <div className={`w-11 h-11 rounded-xl ${m.iconBg} flex items-center justify-center text-xl mb-3`}>
                    {m.icon}
                  </div>
                  <h3 className="font-semibold text-[#13105A] text-sm mb-1">{m.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">{m.desc}</p>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-400">{done} / {total}</span>
                    <span className="text-xs font-semibold" style={{ color: m.barColor }}>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: m.barColor }}
                    />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Practice banner ── */}
      <section className="bg-[#F0EEFF] px-6 py-6">
        <div className="max-w-7xl mx-auto bg-[#EAE7FF] rounded-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center text-3xl shrink-0">🤖</div>
            <div>
              <h3 className="font-bold text-[#13105A]">Practice makes progress.</h3>
              <p className="text-sm text-gray-500">
                {totalDone > 0
                  ? `${totalDone} of ${totalScenarios} scenarios completed. Keep going!`
                  : 'Use real-life call simulations and get feedback from Cora to strengthen your skills.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('training')}
            className="bg-[#6B4EF3] hover:bg-[#5A3EE0] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shrink-0 ml-6"
          >
            {totalDone > 0 ? 'Continue Practice' : 'Start a Practice'}
          </button>
        </div>
      </section>

      {/* ── Recommended ── */}
      <section className="bg-white px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-[#13105A]">Recommended for You</h2>
            <button onClick={() => setCurrentPage('help')} className="text-sm text-[#6B4EF3] font-medium hover:underline">View all resources</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {recommended.map((r, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage('help')}
                className="border border-gray-100 rounded-2xl p-5 text-left hover:border-[#6B4EF3] hover:shadow-sm transition-all"
              >
                <p className={`text-xs font-semibold ${r.typeColor} mb-3`}>{r.type}</p>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${r.iconBg} flex items-center justify-center text-xl shrink-0`}>
                    {r.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-[#13105A] leading-snug">{r.title}</h3>
                </div>
                <p className="text-xs text-gray-400 mt-4">⏱ {r.meta}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Advice CTA banner ── */}
      <section className="bg-[#0B0934] px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative text-4xl">
              🤖
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#0B0934] animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                On a tough call right now?
                <span className="text-xs font-semibold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">LIVE</span>
              </h3>
              <p className="text-sm text-gray-400">Get the exact words from Cora's AI brain — in real time.</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPage('live')}
            className="bg-[#6B4EF3] hover:bg-[#5A3EE0] text-white font-semibold px-6 py-2.5 rounded-xl transition-colors shadow-md shadow-[#6B4EF3]/30"
          >
            Open Live Coach
          </button>
        </div>
      </section>
    </div>
  )
}
