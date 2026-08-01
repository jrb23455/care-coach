import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Home from './pages/Home'
import HelpCenter from './pages/HelpCenter'
import Training from './pages/Training'
import LiveAdvice from './pages/LiveAdvice'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage])

  return (
    <div className="h-screen flex overflow-hidden bg-[#F8F7FF]">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className={`flex-1 min-h-0 ${currentPage === 'live' ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'}`}>
          {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
          {currentPage === 'help' && <HelpCenter setCurrentPage={setCurrentPage} />}
          {currentPage === 'training' && <Training />}
          {currentPage === 'live' && <LiveAdvice />}
        </main>
      </div>
    </div>
  )
}
