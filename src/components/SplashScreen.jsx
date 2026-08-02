import { useState, useRef } from 'react'

const STORAGE_KEY = 'carecoach_intro_seen'

export default function SplashScreen({ onDone }) {
  const [started, setStarted] = useState(false)
  const [fading, setFading] = useState(false)
  const videoRef = useRef(null)

  function begin() {
    setStarted(true)
    const v = videoRef.current
    if (v) v.play().catch(() => finish())
  }

  function finish() {
    if (fading) return
    setFading(true)
    localStorage.setItem(STORAGE_KEY, '1')
    setTimeout(onDone, 700)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.7s ease',
      }}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        onEnded={finish}
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: started ? 'block' : 'none' }}
      />

      {!started && (
        <div
          onClick={begin}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', userSelect: 'none',
          }}
        >
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(123,63,242,0.25)',
            border: '2px solid rgba(123,63,242,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 20,
          }}>
            <div style={{
              width: 0, height: 0,
              borderTop: '14px solid transparent',
              borderBottom: '14px solid transparent',
              borderLeft: '22px solid rgba(123,63,242,0.9)',
              marginLeft: 5,
            }} />
          </div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em' }}>
            TAP TO BEGIN
          </div>
        </div>
      )}

      {started && (
        <div
          onClick={finish}
          style={{
            position: 'absolute', bottom: 24, left: 0, right: 0,
            textAlign: 'center', color: 'rgba(255,255,255,0.35)',
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em',
            cursor: 'pointer', userSelect: 'none',
          }}
        >
          TAP TO SKIP
        </div>
      )}
    </div>
  )
}

export function shouldShowSplash() {
  return !localStorage.getItem(STORAGE_KEY)
}
