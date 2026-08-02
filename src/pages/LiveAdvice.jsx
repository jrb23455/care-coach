import { useState, useRef, useEffect, useCallback } from 'react'
import { getApiKey, setApiKey, clearApiKey, askCora } from '../services/claudeApi'
import CoraRobot from '../components/CoraRobot'

const QUICK_SITUATIONS = [
  { label: '😤 Getting angry',        prompt: 'The customer is getting angry and starting to raise their voice at me.' },
  { label: '🚪 Wants to cancel',      prompt: 'The customer says they want to cancel their policy right now.' },
  { label: '👔 Wants supervisor',     prompt: 'The customer is demanding to speak with my manager or supervisor right now.' },
  { label: '❌ Claim denied',         prompt: 'The customer just found out their claim was denied and wants answers immediately.' },
  { label: '💸 Premium increase',     prompt: 'The customer is upset because their premium went up and nobody told them.' },
  { label: '🧾 Billing error',        prompt: 'There was a billing error or duplicate charge on the customer\'s account.' },
  { label: '📵 Not interested',       prompt: 'I\'m on an outbound call and the customer says they\'re not interested and wants to hang up.' },
  { label: '⚖️ Agent lied to them',   prompt: 'The customer claims a previous agent promised them something that isn\'t in their policy.' },
]

const FOLLOW_UPS = [
  { label: "Still angry",         prompt: "The customer is still upset and not calming down after what I said." },
  { label: "Wants supervisor now", prompt: "They're now demanding to speak with a supervisor or market leader immediately." },
  { label: "Calmed down a bit",   prompt: "They've calmed down a little. What do I do next to close this well?" },
  { label: "Threatening to leave", prompt: "They're now saying they'll switch to a competitor if this isn't fixed today." },
  { label: "Accepted that",       prompt: "They seemed to accept what I said. How do I close the call on a positive note?" },
]

function parseAdvice(text) {
  const sayMatch  = text.match(/SAY THIS NOW:\s*([\s\S]*?)(?=WHY THIS WORKS:|LISTEN FOR:|$)/i)
  const whyMatch  = text.match(/WHY THIS WORKS:\s*([\s\S]*?)(?=SAY THIS NOW:|LISTEN FOR:|$)/i)
  const listenMatch = text.match(/LISTEN FOR:\s*([\s\S]*?)(?=SAY THIS NOW:|WHY THIS WORKS:|$)/i)
  return {
    say:    sayMatch   ? sayMatch[1].trim()   : text.trim(),
    why:    whyMatch   ? whyMatch[1].trim()   : '',
    listen: listenMatch ? listenMatch[1].trim() : '',
    hasSections: !!(sayMatch && (whyMatch || listenMatch)),
  }
}

function BounceDots({ color = '#A78BFA' }) {
  return (
    <span className="flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce inline-block"
          style={{ background: color, animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl transition-all hover:scale-105 shrink-0"
      style={{ background: copied ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.12)', color: copied ? '#6ee7b7' : '#c4b5fd' }}
    >
      {copied
        ? <><svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 2.5l-7 7-3-3L2 8l4.5 4.5 8.5-8.5z"/></svg> Copied!</>
        : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</>
      }
    </button>
  )
}

function AdviceBlock({ message, isStreaming, onFollowUp }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="text-sm leading-relaxed px-4 py-2.5 max-w-[75%] rounded-2xl rounded-br-none font-semibold"
          style={{ background: 'rgba(123,63,242,0.12)', color: 'var(--text)' }}>
          {message.content}
        </div>
      </div>
    )
  }

  const { say, why, listen, hasSections } = parseAdvice(message.content)

  return (
    <div className="mb-5">
      {/* SAY THIS NOW */}
      <div className="rounded-2xl p-4 mb-2.5 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0f0b30 0%, #1a0850 100%)', boxShadow: '0 8px 24px rgba(15,11,48,0.30)' }}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#A78BFA' }}>Say This Now</span>
            {isStreaming && <BounceDots />}
          </div>
          {!isStreaming && say && <CopyButton text={say} />}
        </div>
        <p className="text-white text-[15px] leading-relaxed font-bold">{say}</p>
      </div>

      {/* WHY + LISTEN */}
      {hasSections && !isStreaming && (
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          {why && (
            <div className="rounded-2xl p-3.5" style={{ background: 'rgba(123,63,242,0.08)', border: '1.5px solid rgba(123,63,242,0.15)' }}>
              <p className="text-[10px] font-black uppercase tracking-wide mb-1.5" style={{ color: '#7B3FF2' }}>Why It Works</p>
              <p className="text-sm leading-relaxed font-semibold" style={{ color: 'var(--text)' }}>{why}</p>
            </div>
          )}
          {listen && (
            <div className="rounded-2xl p-3.5" style={{ background: 'rgba(16,185,129,0.07)', border: '1.5px solid rgba(16,185,129,0.15)' }}>
              <p className="text-[10px] font-black uppercase tracking-wide mb-1.5" style={{ color: '#10B981' }}>Listen For</p>
              <p className="text-sm leading-relaxed font-semibold" style={{ color: 'var(--text)' }}>{listen}</p>
            </div>
          )}
        </div>
      )}

      {/* Follow-up chips */}
      {!isStreaming && onFollowUp && (
        <div className="flex flex-wrap gap-1.5">
          {FOLLOW_UPS.map((f, i) => (
            <button key={i} onClick={() => onFollowUp(f.prompt)}
              className="text-xs font-black px-3 py-1.5 rounded-xl transition-all hover:scale-105"
              style={{ background: 'rgba(123,63,242,0.08)', color: '#7B3FF2' }}>
              {f.label} →
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function ApiKeySetup({ onSave }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  function handleSave() {
    const trimmed = key.trim()
    if (!trimmed) { setError('Please enter your API key.'); return }
    if (!trimmed.startsWith('sk-ant-')) {
      setError('Anthropic API keys start with "sk-ant-" — double-check and try again.')
      return
    }
    setApiKey(trimmed)
    onSave()
  }

  return (
    <div className="flex-1 flex items-center justify-center px-6" style={{ background: 'var(--bg)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CoraRobot size={110} pose="present" />
          </div>
          <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text)' }}>Connect Cora's Brain</h1>
          <p className="text-sm leading-relaxed font-semibold" style={{ color: 'var(--text-2)' }}>
            Enter your Anthropic API key to unlock real-time coaching during live calls.
            Stored in your browser only — never sent anywhere except directly to Anthropic.
          </p>
        </div>

        <div className="rounded-3xl shadow-sm p-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <label className="block text-sm font-black mb-2" style={{ color: 'var(--text)' }}>Anthropic API Key</label>
          <input
            type="password"
            value={key}
            onChange={e => { setKey(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="sk-ant-api03-..."
            autoFocus
            className="w-full border rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none transition-all"
            style={{ borderColor: error ? '#ef4444' : '#ede9fe', boxShadow: 'none' }}
          />
          {error && <p className="text-red-500 text-xs mt-2 font-bold">{error}</p>}

          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className="mt-4 w-full text-white font-black py-3 rounded-2xl transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7B3FF2, #a855f7)', boxShadow: '0 4px 16px rgba(123,63,242,0.35)' }}
          >
            Connect &amp; Start Coaching
          </button>

          <p className="text-xs text-center mt-4 font-semibold" style={{ color: 'var(--text-3)' }}>
            Get a key at{' '}
            <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer"
              className="font-mono hover:underline" style={{ color: '#7B3FF2' }}>
              console.anthropic.com
            </a>
            {' '}· Stored in your browser only
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LiveAdvice() {
  const [hasKey, setHasKey]           = useState(() => !!getApiKey())
  const [messages, setMessages]       = useState([])
  const [input, setInput]             = useState('')
  const [isLoading, setIsLoading]     = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [error, setError]             = useState('')
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText, isLoading])

  const sendMessage = useCallback(async (text) => {
    const content = text.trim()
    if (!content || isLoading) return

    const userMsg = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)
    setError('')
    setStreamingText('')

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))
      const finalText = await askCora(apiMessages, chunk => setStreamingText(chunk))
      setMessages(prev => [...prev, { role: 'assistant', content: finalText }])
      setStreamingText('')
    } catch (err) {
      if (err.message === 'NO_KEY') {
        setHasKey(false)
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [messages, isLoading])

  function newCall() {
    setMessages([])
    setStreamingText('')
    setError('')
    setInput('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  if (!hasKey) return <ApiKeySetup onSave={() => setHasKey(true)} />

  const lastIsAssistant = messages.length > 0 && messages[messages.length - 1].role === 'assistant'

  return (
    <div className="flex-1 flex flex-col min-h-0" style={{ background: 'var(--bg)' }}>

      {/* Sub-header */}
      <div className="shrink-0 px-6 py-3" style={{ background: 'var(--card)', borderBottom: '1.5px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-black" style={{ color: 'var(--text)' }}>Live Call Mode</span>
            </span>
            <span className="select-none" style={{ color: 'var(--border)' }}>|</span>
            <span className="text-sm font-semibold hidden sm:inline" style={{ color: 'var(--text-2)' }}>
              Describe what's happening → get the exact words to say right now
            </span>
          </div>
          <button onClick={newCall}
            className="text-sm font-black px-4 py-2 rounded-2xl transition-all hover:scale-105"
            style={{ background: 'rgba(123,63,242,0.09)', color: '#7B3FF2' }}>
            + New Call
          </button>
        </div>
      </div>

      {/* Quick situation chips */}
      <div className="shrink-0 px-6 py-3" style={{ background: 'var(--card)', borderBottom: '1.5px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
          {QUICK_SITUATIONS.map((s, i) => (
            <button key={i} onClick={() => sendMessage(s.prompt)} disabled={isLoading}
              className="text-xs font-black px-3 py-1.5 rounded-2xl transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'rgba(123,63,242,0.09)', color: '#7B3FF2' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="max-w-3xl mx-auto">

          {messages.length === 0 && !isLoading && (
            <div className="text-center py-10">
              <div className="flex justify-center mb-4">
                <CoraRobot size={120} pose="thumbs" />
              </div>
              <h2 className="text-lg font-black mb-2" style={{ color: 'var(--text)' }}>Ready to coach</h2>
              <p className="text-sm font-semibold max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--text-2)' }}>
                Tap a quick button above or type what's happening on your call.
                Cora gives you the exact script to say right now.
              </p>
            </div>
          )}

          {messages.map((msg, i) => {
            const isLast = i === messages.length - 1
            return (
              <AdviceBlock
                key={i}
                message={msg}
                isStreaming={false}
                onFollowUp={isLast && msg.role === 'assistant' && !isLoading ? sendMessage : null}
              />
            )
          })}

          {streamingText && (
            <AdviceBlock
              message={{ role: 'assistant', content: streamingText }}
              isStreaming={true}
              onFollowUp={null}
            />
          )}

          {isLoading && !streamingText && (
            <div className="flex justify-start mb-4">
              <div className="flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-sm"
                style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
                <CoraRobot size={24} shadow={false} />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>Cora is thinking</span>
                <BounceDots />
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-2xl px-4 py-3 mb-4 text-sm font-semibold"
              style={{ background: '#fef2f2', border: '1.5px solid #fecaca', color: '#dc2626' }}>
              {error} — Check your API key or try again.
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 px-6 py-4" style={{ background: 'var(--card)', borderTop: '1.5px solid var(--border)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
              }}
              placeholder="What's happening on your call right now? (e.g. 'Customer just found out claim was denied and is escalating')"
              rows={2}
              disabled={isLoading}
              className="flex-1 rounded-2xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none resize-none disabled:opacity-50 transition-all font-semibold" style={{ color: 'var(--text)' }}
              style={{ border: '1.5px solid var(--border)', background: 'var(--input-bg)' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 text-white rounded-2xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 shrink-0"
              style={{ background: 'linear-gradient(135deg, #7B3FF2, #a855f7)', boxShadow: '0 4px 12px rgba(123,63,242,0.35)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
          <p className="text-xs mt-2 font-semibold" style={{ color: 'var(--text-3)' }}>Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  )
}
