const PAGE_TITLES = {
  home: 'Dashboard',
  live: 'Live Advice',
  training: 'Training',
  help: 'Resources',
}

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

export default function TopBar({ currentPage, dark, onToggleTheme }) {
  const title = PAGE_TITLES[currentPage] || 'CARE Coach'

  return (
    <div className="h-12 flex items-center px-6 shrink-0 z-10"
      style={{ background: 'var(--topbar-bg)', borderBottom: '2px solid transparent', borderImage: 'linear-gradient(90deg, #7B3FF2, #c084fc, #f472b6) 1' }}>
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-black tracking-tight" style={{ color: 'var(--text)' }}>{title}</span>
        {currentPage === 'live' && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
            style={{ background: 'linear-gradient(135deg, #10b981, #06d6a0)', color: '#fff' }}>
            ● Live
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ background: 'var(--chip-bg)', color: 'var(--chip-text)' }}>
          CARE Coach v1.0
        </span>
        <span style={{ color: 'var(--border)' }}>·</span>
        <span className="text-xs font-semibold hidden sm:inline" style={{ color: 'var(--text-2)' }}>Insurance Sales Coaching</span>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110 ml-1"
          style={{ background: 'var(--chip-bg)', color: 'var(--chip-text)' }}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </div>
  )
}
