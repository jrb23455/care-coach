const PAGE_TITLES = {
  home: 'Dashboard',
  live: 'Live Advice',
  training: 'Training',
  help: 'Resources',
}

export default function TopBar({ currentPage }) {
  const title = PAGE_TITLES[currentPage] || 'CARE Coach'

  return (
    <div className="h-12 bg-white flex items-center px-6 shrink-0 z-10" style={{ borderBottom: '2px solid transparent', borderImage: 'linear-gradient(90deg, #7B3FF2, #c084fc, #f472b6) 1' }}>
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-black text-[#0f0b30] tracking-tight">{title}</span>
        {currentPage === 'live' && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: 'linear-gradient(135deg, #10b981, #06d6a0)', color: '#fff' }}>
            ● Live
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 text-xs text-gray-400 font-semibold">
        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold" style={{ background: '#F5F3FF', color: '#7B3FF2' }}>CARE Coach v1.0</span>
        <span className="text-gray-300">·</span>
        <span>Insurance Sales Coaching</span>
      </div>
    </div>
  )
}
