import { useState, useRef, useEffect } from 'react'

const STORAGE_KEY = 'carecoach_intro_seen'

export default function SplashScreen({ onDone }) {
  const [fading, setFading] = useState(false)
  const videoRef = useRef(null)

  function finish() {
    if (fading) return
    setFading(true)
    localStorage.setItem(STORAGE_KEY, '1')
    setTimeout(onDone, 600)
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [])

  return (
    <div
      onClick={finish}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease',
        cursor: 'pointer',
      }}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        onEnded={finish}
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute', bottom: 24, left: 0, right: 0,
        textAlign: 'center', color: 'rgba(255,255,255,0.4)',
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
        userSelect: 'none',
      }}>
        TAP TO SKIP
      </div>
    </div>
  )
}

export function shouldShowSplash() {
  return !localStorage.getItem(STORAGE_KEY)
}
