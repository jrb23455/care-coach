const PAGE_TITLES = {
  home: 'Dashboard',
  live: 'Live Advice',
  training: 'Training',
  help: 'Resources',
}

export default function TopBar({ currentPage }) {
  const title = PAGE_TITLES[currentPage] || 'CARE Coach'

  return (
    <div className="h-12 bg-white border-b border-gray-100 flex items-center px-6 shrink-0 z-10">
      <div>
        <span className="text-sm font-bold text-[#13105A]">{title}</span>
        {currentPage === 'live' && (
          <span className="ml-2 text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Live
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-3 text-xs text-gray-400">
        <span>CARE Coach v1.0</span>
        <span className="text-gray-200">|</span>
        <span>Allstate Insurance</span>
      </div>
    </div>
  )
}
