import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Home from './pages/Home'
import HelpCenter from './pages/HelpCenter'
import Training from './pages/Training'
import LiveAdvice from './pages/LiveAdvice'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const { dark, toggle } = useTheme()
  const mainRef = useRef(null)

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [currentPage])

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar currentPage={currentPage} setCurrentPage={setCurrentPage} dark={dark} onToggleTheme={toggle} />
        <main ref={mainRef} className={`flex-1 min-h-0 ${currentPage === 'live' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'}`}>
          {currentPage === 'home'     && <Home setCurrentPage={setCurrentPage} />}
          {currentPage === 'help'     && <HelpCenter setCurrentPage={setCurrentPage} />}
          {currentPage === 'training' && <Training />}
          {currentPage === 'live'     && <LiveAdvice />}
        </main>
      </div>
    </div>
  )
}
