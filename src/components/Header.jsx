import { useProgress } from '../hooks/useProgress'

const NAV = [
  { label: 'Home', page: 'home' },
  { label: 'Live Advice', page: 'live', live: true },
  { label: 'Training', page: 'training' },
  { label: 'Resources', page: 'help' },
  { label: 'Progress', page: 'training' },
]

function ShieldIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M15 2L27 6.5V17C27 23 21.5 27.5 15 29.5C8.5 27.5 3 23 3 17V6.5Z" fill="#6B4EF3"/>
      <circle cx="15" cy="15" r="4.5" fill="none" stroke="white" strokeWidth="1.8"/>
      <path d="M10.5 15H8.5V18.5H10.5V15Z M19.5 15H21.5V18.5H19.5V15Z" fill="white"/>
      <path d="M8.5 15C8.5 10.5 21.5 10.5 21.5 15" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  )
}

export default function Header({ currentPage, setCurrentPage }) {
  const { prog, xpLevel, xpInLevel } = useProgress()

  return (
    <header className="bg-[#0B0934] text-white sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <ShieldIcon />
          <span className="text-base font-bold tracking-wide">CARE Coach</span>
        </button>

        {currentPage === 'help' ? (
          <div className="flex items-center gap-3 text-gray-300 text-sm">
            <span className="text-gray-500">|</span>
            <span className="font-medium text-white">Help Center</span>
          </div>
        ) : (
          <nav className="flex gap-7">
            {NAV.map(({ label, page, live }) => {
              const active = page === currentPage
              return (
                <button
                  key={label}
                  onClick={() => page && setCurrentPage(page)}
                  className={`text-sm font-medium pb-0.5 transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'text-white border-b-2 border-[#6B4EF3]'
                      : page ? 'text-gray-400 hover:text-white' : 'text-gray-600 cursor-default'
                  }`}
                >
                  {live && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                  )}
                  {label}
                </button>
              )
            })}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {currentPage === 'help' && (
            <button
              onClick={() => setCurrentPage('home')}
              className="text-sm text-gray-300 hover:text-white border border-gray-600 rounded-lg px-3 py-1.5 transition-colors"
            >
              ← Back to CARE Coach
            </button>
          )}

          {/* Streak badge */}
          {prog.streak > 0 && (
            <div className="flex items-center gap-1 bg-orange-500/20 px-2.5 py-1 rounded-full">
              <span className="text-sm">🔥</span>
              <span className="text-xs font-bold text-orange-300">{prog.streak}</span>
            </div>
          )}

          {/* XP level */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs text-gray-400 leading-none">Lvl {xpLevel}</div>
              <div className="text-xs font-bold text-[#6B4EF3] leading-none mt-0.5">{prog.xp} XP</div>
            </div>
            <div className="w-7 h-7 rounded-full border-2 border-[#6B4EF3] flex items-center justify-center text-xs font-black text-[#6B4EF3]" title={`Level ${xpLevel}`}>
              {xpLevel}
            </div>
          </div>

          <button className="text-gray-400 hover:text-white text-lg">🔔</button>
          <div className="w-8 h-8 rounded-full bg-[#6B4EF3] flex items-center justify-center text-xs font-bold">CC</div>
        </div>
      </div>

      {/* XP bar under header */}
      <div className="h-0.5 bg-gray-800">
        <div
          className="h-full bg-[#6B4EF3] transition-all duration-700"
          style={{ width: `${xpInLevel}%` }}
        />
      </div>
    </header>
  )
}
