import { useState, useEffect } from 'react'
import Header from './components/Header'
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
    <div className="min-h-screen bg-white font-sans">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'home' && <Home setCurrentPage={setCurrentPage} />}
      {currentPage === 'help' && <HelpCenter setCurrentPage={setCurrentPage} />}
      {currentPage === 'training' && <Training />}
      {currentPage === 'live' && <LiveAdvice />}
    </div>
  )
}
