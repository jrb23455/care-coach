import { useProgress } from '../hooks/useProgress'
import { practiceScenarios } from '../data/practiceScenarios'
import CoraRobot from './CoraRobot'

const NAV = [
  {
    page: 'home',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/>
        <rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/>
      </svg>
    ),
  },
  {
    page: 'live',
    label: 'Live Advice',
    live: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    page: 'training',
    label: 'Training',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    page: 'help',
    label: 'Resources',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
]

export default function Sidebar({ currentPage, setCurrentPage }) {
  const { prog, xpLevel, xpInLevel } = useProgress()
  const totalDone = Object.keys(prog.completed).length
  const totalScenarios = practiceScenarios.length

  return (
    <div className="w-56 shrink-0 flex flex-col h-full select-none" style={{ background: 'linear-gradient(165deg, #0f0b30 0%, #1a0850 50%, #0d0a2e 100%)' }}>
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2.5 group w-full"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: 'linear-gradient(135deg, #7B3FF2, #a855f7)' }}>
            <CoraRobot pose="wink" size={30} shadow={false} />
          </div>
          <div>
            <div className="text-white font-black text-sm leading-none tracking-tight">CARE Coach</div>
            <div className="text-purple-400 text-[10px] font-bold mt-0.5 tracking-wide">AI CALL COACH</div>
          </div>
        </button>
      </div>

      {/* Nav */}
      <nav className="px-3 py-4 flex flex-col gap-1 flex-1">
        {NAV.map(({ page, label, live, icon }) => {
          const active = page === currentPage
          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-bold transition-all text-left ${
                active
                  ? 'text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-white/8'
              }`}
              style={active ? {
                background: 'linear-gradient(135deg, #7B3FF2 0%, #a855f7 100%)',
                boxShadow: '0 4px 15px rgba(123, 63, 242, 0.45)',
              } : {}}
            >
              <span className={active ? 'text-white' : 'text-gray-500'}>{icon}</span>
              <span className="flex-1">{label}</span>
              {live && (
                <span className={`w-2 h-2 rounded-full shrink-0 ${active ? 'bg-green-300' : 'bg-green-400'} animate-pulse`} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Cora mini */}
      <div className="mx-3 border-t border-white/10 pt-4 pb-2 flex flex-col items-center">
        <button
          onClick={() => setCurrentPage('live')}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl opacity-40" style={{ background: 'radial-gradient(circle, #7B3FF2, transparent)' }} />
            <CoraRobot size={72} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0D0A2E] animate-pulse" />
          </div>
          <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest group-hover:text-white transition-colors">Ask Cora</span>
        </button>
      </div>

      {/* XP + progress */}
      <div className="mx-3 mb-3 rounded-2xl px-3 py-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400 font-bold">Level {xpLevel}</span>
          <span className="text-xs font-black" style={{ color: '#c084fc' }}>{prog.xp} XP</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${xpInLevel}%`,
              background: 'linear-gradient(90deg, #7B3FF2, #c084fc, #f472b6)',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-gray-500 font-bold">{totalDone}/{totalScenarios} done</span>
          {prog.streak > 0 && (
            <span className="text-[10px] text-orange-400 font-black">🔥 {prog.streak} day{prog.streak > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* User row */}
      <div className="mx-3 mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0" style={{ background: 'linear-gradient(135deg, #7B3FF2, #a855f7)' }}>CC</div>
        <div className="min-w-0">
          <div className="text-xs text-white font-bold truncate">Agent</div>
          <div className="text-[10px] text-gray-500 truncate">Insurance Sales</div>
        </div>
        <button className="ml-auto text-gray-600 hover:text-gray-300 text-sm shrink-0">🔔</button>
      </div>
    </div>
  )
}
