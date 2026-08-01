import { useProgress } from '../hooks/useProgress'
import { practiceScenarios } from '../data/practiceScenarios'
import CoraRobot from './CoraRobot'

const NAV = [
  {
    page: 'home',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    page: 'live',
    label: 'Live Advice',
    live: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    page: 'training',
    label: 'Training',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    page: 'help',
    label: 'Resources',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <div className="w-56 shrink-0 bg-[#0B0934] flex flex-col h-full select-none">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 bg-[#6B4EF3] rounded-lg flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 30 30" fill="none">
              <path d="M15 2L27 6.5V17C27 23 21.5 27.5 15 29.5C8.5 27.5 3 23 3 17V6.5Z" fill="white" opacity="0.9"/>
              <circle cx="15" cy="15" r="4" fill="none" stroke="#0B0934" strokeWidth="1.8"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none">CARE Coach</div>
            <div className="text-[#6B4EF3] text-[10px] font-semibold mt-0.5">by Allstate</div>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                active
                  ? 'bg-[#6B4EF3] text-white shadow-md shadow-[#6B4EF3]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/8'
              }`}
            >
              <span className={active ? 'text-white' : 'text-gray-500 group-hover:text-white'}>{icon}</span>
              <span className="flex-1">{label}</span>
              {live && (
                <span className={`w-2 h-2 rounded-full shrink-0 ${active ? 'bg-green-300' : 'bg-green-500'} animate-pulse`} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Cora mini + divider */}
      <div className="mx-3 border-t border-white/10 pt-4 pb-2 flex flex-col items-center">
        <button
          onClick={() => setCurrentPage('live')}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="relative">
            <CoraRobot size={72} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#0B0934] animate-pulse" />
          </div>
          <span className="text-[10px] text-[#6B4EF3] font-semibold uppercase tracking-widest group-hover:text-white transition-colors">Ask Cora</span>
        </button>
      </div>

      {/* XP + progress */}
      <div className="mx-3 mb-3 bg-white/6 rounded-xl px-3 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Level {xpLevel}</span>
          <span className="text-xs font-bold text-[#6B4EF3]">{prog.xp} XP</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#6B4EF3] rounded-full transition-all" style={{ width: `${xpInLevel}%` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-gray-500">{totalDone}/{totalScenarios} done</span>
          {prog.streak > 0 && (
            <span className="text-[10px] text-orange-400 font-bold">🔥 {prog.streak}</span>
          )}
        </div>
      </div>

      {/* User row */}
      <div className="mx-3 mb-4 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#6B4EF3] flex items-center justify-center text-xs font-bold text-white shrink-0">CC</div>
        <div className="min-w-0">
          <div className="text-xs text-white font-semibold truncate">Agent</div>
          <div className="text-[10px] text-gray-500 truncate">Allstate Sales</div>
        </div>
        <button className="ml-auto text-gray-600 hover:text-gray-300 text-sm shrink-0">🔔</button>
      </div>
    </div>
  )
}
