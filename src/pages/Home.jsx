import { useState, useMemo } from 'react'
import { useProgress, computeBadges } from '../hooks/useProgress'
import { practiceScenarios } from '../data/practiceScenarios'
import CoraRobot from '../components/CoraRobot'

const PILLAR_META = [
  { key: 'understand',  icon: '🎧', title: 'Understand',     color: '#7B3FF2', bg: 'rgba(123,63,242,0.10)', label: 'Understand' },
  { key: 'deescalate', icon: '🛡️', title: 'De-escalate',    color: '#ec4899', bg: 'rgba(236,72,153,0.10)', label: 'De-escalate' },
  { key: 'respond',    icon: '👥', title: 'Respond',         color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', label: 'Respond' },
  { key: 'resolve',    icon: '🏆', title: 'Resolve & Close', color: '#10b981', bg: 'rgba(16,185,129,0.10)', label: 'Resolve' },
]

const DIFFICULTY_LABEL = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }

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

const NEVER_SAY_TIPS = [
  {
    phrase: 'Calm down',
    why: 'It invalidates their emotion and almost always escalates the situation. The customer hears: "Your reaction is wrong." It never works.',
    instead: '"I hear how frustrated you are — let me help you get this sorted out right now."',
  },
  {
    phrase: "That's our policy",
    why: 'Sounds like "tough luck." It closes the conversation and removes any empathy. Customers don\'t care about your policy — they care about their problem.',
    instead: '"Here\'s what I\'m able to do for you right now..." and lead with what you CAN do.',
  },
  {
    phrase: "There's nothing I can do",
    why: 'Almost never true, and it ends the conversation entirely. Even if something is outside your authority, you can always escalate or document.',
    instead: '"What I\'m not able to do is [X], but here\'s what I can do: [Y]. Let me also flag this to my market leader for you."',
  },
]

const DE_ESC_PHRASES = [
  { situation: "When they're yelling", phrase: '"I hear how frustrated you are, and I want to make sure I get this right for you."', why: 'Acknowledges without escalating. Lower your voice as you say it.' },
  { situation: 'To acknowledge the issue', phrase: '"That\'s not the experience we want you to have, and I\'m sorry it happened."', why: 'Takes ownership without admitting legal fault.' },
  { situation: 'To buy time', phrase: '"I want to make sure I fully understand — let me pull up your account."', why: 'Gives you 30 seconds and signals you\'re taking it seriously.' },
  { situation: 'To set limits firmly', phrase: '"I want to help you resolve this, and I also need us to be able to have that conversation."', why: 'Sets a boundary without being confrontational.' },
  { situation: 'On market leader requests', phrase: '"I can\'t bring my market leader onto the call, but I can commit to having them call you back by [time]."', why: 'Honest about the process. Specificity is the key.' },
  { situation: 'When they threaten to cancel', phrase: '"You\'ve been with us a long time — before you decide, I\'d like to understand what\'s driving this."', why: 'Leads with the relationship. Doesn\'t panic or immediately offer discounts.' },
]

const RECOMMENDED = [
  {
    type: 'SCENARIO', typeColor: '#7B3FF2', bg: 'rgba(123,63,242,0.08)',
    title: 'Handling Objections That Turn Rude', icon: '🎧', meta: '8 min',
    page: 'training',
  },
  {
    type: 'TOOL', typeColor: '#06b6d4', bg: 'rgba(6,182,212,0.08)',
    title: 'De-escalation Phrase Bank', icon: '📝', meta: 'Reference',
    modal: { title: 'De-escalation Phrase Bank', type: 'phrases', phrases: DE_ESC_PHRASES },
  },
  {
    type: 'VIDEO', typeColor: '#f59e0b', bg: 'rgba(245,158,11,0.08)',
    title: 'How to Handle Angry Customers', icon: '▶️', meta: '~10 min',
    modal: { title: 'How to Handle Angry Customers', type: 'video', videoUrl: 'https://www.youtube.com/embed/ZXH_HTEpqOU' },
  },
  {
    type: 'QUICK TIP', typeColor: '#ec4899', bg: 'rgba(236,72,153,0.08)',
    title: '3 Things to Never Say', icon: '💡', meta: '2 min read',
    modal: { title: '3 Things to Never Say to an Angry Customer', type: 'tips', tips: NEVER_SAY_TIPS },
  },
]

function getDailyChallenge() {
  const dayNum = Math.floor(Date.now() / 86_400_000)
  return practiceScenarios[dayNum % practiceScenarios.length]
}

function HomeContentModal({ item, onClose }) {
  if (!item?.modal) return null
  const { modal, type, typeColor } = item
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
        style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 shrink-0" style={{ borderBottom: '1.5px solid var(--border)' }}>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: typeColor }}>{type}</span>
            <h2 className="font-black text-base" style={{ color: 'var(--text)' }}>{modal.title}</h2>
          </div>
          <button onClick={onClose} className="text-2xl leading-none ml-4 hover:opacity-60 transition-opacity" style={{ color: 'var(--text-3)' }}>×</button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {modal.type === 'video' && (
            <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <iframe
                src={modal.videoUrl}
                className="w-full h-full"
                style={{ minHeight: 280 }}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}
          {modal.type === 'tips' && modal.tips.map((tip, i) => (
            <div key={i} className="mb-4 rounded-2xl p-4" style={{ background: 'var(--bg)', border: '1.5px solid var(--border)' }}>
              <div className="flex items-start gap-2 mb-2">
                <span className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#ec4899' }}>✕</span>
                <span className="font-black text-sm leading-snug" style={{ color: '#ec4899' }}>"{tip.phrase}"</span>
              </div>
              <p className="text-sm leading-relaxed pl-8" style={{ color: 'var(--text-2)' }}>{tip.why}</p>
              {tip.instead && (
                <div className="mt-3 pl-8 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span className="text-xs font-black text-green-500">Say instead: </span>
                  <span className="text-xs italic leading-relaxed" style={{ color: 'var(--text)' }}>{tip.instead}</span>
                </div>
              )}
            </div>
          ))}
          {modal.type === 'phrases' && modal.phrases.map((p, i) => (
            <div key={i} className="mb-3 rounded-2xl overflow-hidden" style={{ border: '1.5px solid var(--border)' }}>
              <div className="px-4 py-2" style={{ background: 'rgba(6,182,212,0.12)' }}>
                <p className="text-xs font-black uppercase tracking-wide" style={{ color: '#06b6d4' }}>{p.situation}</p>
              </div>
              <div className="px-4 py-3" style={{ background: 'var(--bg)' }}>
                <p className="text-sm font-bold italic mb-1.5" style={{ color: 'var(--text)' }}>{p.phrase}</p>
                <p className="text-xs" style={{ color: 'var(--text-2)' }}>{p.why}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Home({ setCurrentPage }) {
  const { prog, pillarProgress, xpLevel, xpInLevel } = useProgress()
  const totalDone = Object.keys(prog.completed).length
  const totalScenarios = practiceScenarios.length
  const [tipIdx, setTipIdx] = useState(0)
  const [openCard, setOpenCard] = useState(null)
  const tip = CORA_TIPS[tipIdx]

  const badges = useMemo(() => computeBadges(prog, practiceScenarios), [prog])
  const dailyChallenge = getDailyChallenge()
  const dailyDone = prog.completed[dailyChallenge?.id]
  const dailyPillar = PILLAR_META.find(m => m.key === dailyChallenge?.pillar)

  const statValues = [
    `${totalDone}/${totalScenarios}`,
    prog.xp,
    xpLevel,
    prog.streak > 0 ? `${prog.streak}` : '—',
  ]

  function handleRecommendedClick(r) {
    if (r.modal) setOpenCard(r)
    else if (r.page) setCurrentPage(r.page)
  }

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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
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

      {/* Daily Challenge */}
      {dailyChallenge && (
        <div className="rounded-3xl p-5 flex items-center justify-between mb-5"
          style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#7B3FF2' }}>
              Daily Challenge
            </div>
            <h3 className="font-black text-base leading-snug" style={{ color: 'var(--text)' }}>{dailyChallenge.title}</h3>
            <p className="text-xs mt-0.5 font-semibold" style={{ color: 'var(--text-2)' }}>
              {dailyPillar?.label} · {DIFFICULTY_LABEL[dailyChallenge.difficulty]} · +{dailyChallenge.xp} XP
            </p>
          </div>
          {dailyDone ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm shrink-0"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 2.5l-7 7-3-3L2 8l4.5 4.5 8.5-8.5z"/></svg>
              Done! ({dailyDone.score}pts)
            </div>
          ) : (
            <button onClick={() => {
              sessionStorage.setItem('training_auto_scenario', dailyChallenge.id)
              setCurrentPage('training')
            }}
              className="text-white text-sm font-black px-5 py-2.5 rounded-2xl transition-all hover:scale-105 shrink-0"
              style={{ background: 'linear-gradient(135deg, #7B3FF2, #a855f7)', boxShadow: '0 4px 12px rgba(123,63,242,0.30)' }}>
              Start →
            </button>
          )}
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left col */}
        <div className="lg:col-span-2 space-y-5">

          {/* Progress pillars */}
          <div className="rounded-3xl shadow-sm p-5" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-sm" style={{ color: 'var(--text)' }}>Training Progress</h2>
              <button onClick={() => setCurrentPage('training')} className="text-xs font-black hover:underline" style={{ color: '#7B3FF2' }}>Continue →</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                <button key={i} onClick={() => handleRecommendedClick(r)}
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

      {/* Achievements */}
      <div className="mt-5 rounded-3xl shadow-sm p-5" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
        <h2 className="font-black text-sm mb-4" style={{ color: 'var(--text)' }}>Achievements</h2>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {badges.map(b => (
            <div key={b.id} title={b.desc}
              className="flex flex-col items-center gap-1 rounded-2xl p-2 transition-all cursor-default"
              style={{ background: b.earned ? 'rgba(123,63,242,0.12)' : 'var(--bg)', opacity: b.earned ? 1 : 0.35 }}>
              <span className="text-2xl">{b.icon}</span>
              <span className="text-[10px] font-black text-center leading-snug" style={{ color: b.earned ? '#7B3FF2' : 'var(--text-3)' }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* XP bar */}
      <div className="mt-3 px-2 flex items-center gap-3">
        <span className="text-xs font-black" style={{ color: 'var(--text-3)' }}>Lv {xpLevel}</span>
        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(123,63,242,0.12)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${xpInLevel}%`, background: 'linear-gradient(90deg,#7B3FF2,#c084fc)' }} />
        </div>
        <span className="text-xs font-black" style={{ color: 'var(--text-3)' }}>{xpInLevel}/100 XP</span>
      </div>

      {openCard && <HomeContentModal item={openCard} onClose={() => setOpenCard(null)} />}
    </div>
  )
}
