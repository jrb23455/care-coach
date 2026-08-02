import { useState, useEffect, useRef, useCallback } from 'react'
import CoraRobot from './CoraRobot'

function CustomerAvatar({ active }) {
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0 transition-all"
      style={{
        background: active ? 'linear-gradient(135deg, #ef4444, #f97316)' : 'var(--border)',
        boxShadow: active ? '0 0 0 2px #ef444450' : 'none',
        color: active ? 'white' : 'var(--text-3)',
      }}>
      👤
    </div>
  )
}

function AgentAvatar({ active }) {
  return (
    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 transition-all flex items-center justify-center"
      style={{
        background: active ? 'linear-gradient(135deg, #7B3FF2, #a855f7)' : 'var(--border)',
        boxShadow: active ? '0 0 0 2px #7B3FF250' : 'none',
      }}>
      <CoraRobot size={36} pose="neutral" shadow={false} />
    </div>
  )
}

function SpeakingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1.5" aria-label="speaking">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1 h-1 rounded-full bg-current"
          style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
      ))}
    </span>
  )
}

export default function ConversationPlayer({ conversation }) {
  const [status, setStatus] = useState('idle') // idle | loading | playing | paused | done | error
  const [currentTurn, setCurrentTurn] = useState(-1)
  const [available, setAvailable] = useState(null) // null=checking, true, false
  const audioRef = useRef(null)
  const turnIndexRef = useRef(-1)

  useEffect(() => {
    fetch(`/audio/${conversation.id}/turn-0.mp3`, { method: 'HEAD' })
      .then(r => {
        const ct = r.headers.get('Content-Type') || ''
        setAvailable(r.ok && (ct.includes('audio') || ct.includes('octet-stream')))
      })
      .catch(() => setAvailable(false))
  }, [conversation.id])

  const playTurn = useCallback((index) => {
    if (index >= conversation.turns.length) {
      setStatus('done')
      setCurrentTurn(-1)
      turnIndexRef.current = -1
      return
    }
    turnIndexRef.current = index
    setCurrentTurn(index)

    const audio = new Audio(`/audio/${conversation.id}/turn-${index}.mp3`)
    audioRef.current = audio

    audio.oncanplaythrough = () => setStatus('playing')
    audio.onended = () => {
      if (turnIndexRef.current === index) playTurn(index + 1)
    }
    audio.onerror = () => {
      if (turnIndexRef.current === index) playTurn(index + 1)
    }
    audio.play().catch(() => setStatus('error'))
  }, [conversation])

  function handlePlay() {
    if (status === 'idle' || status === 'done') {
      setStatus('loading')
      playTurn(0)
    } else if (status === 'playing') {
      audioRef.current?.pause()
      setStatus('paused')
    } else if (status === 'paused') {
      audioRef.current?.play()
      setStatus('playing')
    }
  }

  function handleReset() {
    audioRef.current?.pause()
    audioRef.current = null
    turnIndexRef.current = -1
    setStatus('idle')
    setCurrentTurn(-1)
  }

  useEffect(() => () => { audioRef.current?.pause() }, [])

  const isPlaying = status === 'playing'
  const isLoading = status === 'loading'
  const isDone = status === 'done'
  const canPlay = available === true

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ border: '1.5px solid var(--border)', background: 'var(--card)' }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-start justify-between gap-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#6B4EF3' }}>AUDIO DEMO</p>
          <h3 className="font-bold text-sm leading-snug" style={{ color: 'var(--text)' }}>{conversation.title}</h3>
          <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--text-3)' }}>{conversation.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-0.5">
          {isDone && (
            <button onClick={handleReset}
              className="text-xs px-2.5 py-1 rounded-lg font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-3)', border: '1px solid var(--border)' }}>
              Restart
            </button>
          )}
          <button
            onClick={handlePlay}
            disabled={!canPlay || isLoading}
            title={available === false ? 'Run npm run generate-audio first' : ''}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all disabled:opacity-40"
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, #ef4444, #f97316)'
                : 'linear-gradient(135deg, #7B3FF2, #a855f7)',
              boxShadow: canPlay && !isLoading ? '0 4px 12px rgba(123,63,242,0.35)' : 'none',
            }}>
            {isLoading ? (
              <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>◌</span>
            ) : isPlaying ? '⏸' : '▶'}
          </button>
        </div>
      </div>

      {/* Transcript */}
      <div className="px-5 py-4 space-y-4 overflow-y-auto" style={{ maxHeight: 300 }}>
        {available === false && (
          <div className="text-center py-3 rounded-xl text-xs" style={{ background: 'rgba(123,63,242,0.08)', color: 'var(--text-3)', border: '1px dashed var(--border)' }}>
            Audio not yet generated — run <code className="font-mono px-1 rounded" style={{ background: 'var(--border)' }}>npm run generate-audio</code>
          </div>
        )}
        {conversation.turns.map((turn, i) => {
          const active = currentTurn === i
          const past = isDone || (currentTurn > i && currentTurn !== -1)
          const future = !isDone && currentTurn !== -1 && currentTurn < i
          const isAgent = turn.speaker === 'agent'

          return (
            <div key={i}
              className="flex items-start gap-3 transition-all duration-300"
              style={{ opacity: future ? 0.25 : past ? 0.6 : 1 }}>
              {isAgent ? <AgentAvatar active={active} /> : <CustomerAvatar active={active} />}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center"
                  style={{ color: isAgent ? '#6B4EF3' : '#ef4444' }}>
                  {isAgent ? 'Agent' : 'Customer'}
                  {active && <SpeakingDots />}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: active ? 'var(--text)' : 'var(--text-2)', fontWeight: active ? 500 : 400 }}>
                  {turn.text}
                </p>
              </div>
            </div>
          )
        })}

        {isDone && (
          <div className="text-center pt-1 pb-1 rounded-xl text-xs font-bold"
            style={{ color: '#10B981', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.20)', padding: '10px 16px' }}>
            ✓ Notice how acknowledging the emotion before problem-solving changed the outcome
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>
    </div>
  )
}
