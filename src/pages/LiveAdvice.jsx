import { useState, useRef, useEffect } from 'react'
import { getApiKey, setApiKey, clearApiKey, askCora } from '../services/claudeApi'

const QUICK_SITUATIONS = [
  { label: '😤 Getting angry / yelling', prompt: 'The customer is getting angry and starting to raise their voice at me.' },
  { label: '🚪 Threatening to cancel', prompt: 'The customer says they want to cancel their policy right now.' },
  { label: '👔 Wants market leader', prompt: 'The customer is demanding to speak with my manager or supervisor right now.' },
  { label: '❌ Claim denied', prompt: 'The customer just found out their claim was denied and wants answers immediately.' },
  { label: '💸 Premium increase', prompt: 'The customer is upset because their premium went up and nobody told them.' },
  { label: '🧾 Billing error', prompt: 'There was a billing error or duplicate charge on the customer\'s account.' },
  { label: '📵 Outbound objection', prompt: 'I\'m on an outbound call and the customer says they\'re not interested and wants to hang up.' },
  { label: '⚖️ Agent misrepresentation', prompt: 'The customer claims a previous agent promised them something that isn\'t in their policy.' },
]

function parseAdvice(text) {
  const sayMatch = text.match(/SAY THIS NOW:\s*([\s\S]*?)(?=WHY THIS WORKS:|LISTEN FOR:|$)/i)
  const whyMatch = text.match(/WHY THIS WORKS:\s*([\s\S]*?)(?=SAY THIS NOW:|LISTEN FOR:|$)/i)
  const listenMatch = text.match(/LISTEN FOR:\s*([\s\S]*?)(?=SAY THIS NOW:|WHY THIS WORKS:|$)/i)

  return {
    say: sayMatch ? sayMatch[1].trim() : text.trim(),
    why: whyMatch ? whyMatch[1].trim() : '',
    listen: listenMatch ? listenMatch[1].trim() : '',
    hasSections: !!(sayMatch && (whyMatch || listenMatch)),
  }
}

function BounceDots({ color = '#6B4EF3' }) {
  return (
    <span className="flex gap-1 items-center">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full animate-bounce inline-block"
          style={{ background: color, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  )
}

function AdviceBlock({ message, isStreaming }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-5">
        <div className="bg-[#EAE7FF] text-[#13105A] rounded-2xl rounded-br-none px-4 py-3 max-w-[75%] text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    )
  }

  const { say, why, listen, hasSections } = parseAdvice(message.content)

  return (
    <div className="mb-6">
      {/* SAY THIS NOW — most prominent */}
      <div className="bg-[#0B0934] rounded-2xl p-5 mb-3 shadow-lg shadow-[#0B0934]/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[#A78BFA] text-xs font-bold uppercase tracking-widest">Say This Now</span>
          {isStreaming && <BounceDots color="#A78BFA" />}
        </div>
        <p className="text-white text-[15px] leading-relaxed font-medium">
          {say}
        </p>
      </div>

      {/* WHY + LISTEN FOR */}
      {hasSections && (
        <div className="grid grid-cols-2 gap-3">
          {why && (
            <div className="bg-[#F0EEFF] border border-[#6B4EF3]/10 rounded-xl p-4">
              <p className="text-xs font-bold text-[#6B4EF3] uppercase tracking-wide mb-2">Why It Works</p>
              <p className="text-sm text-[#13105A] leading-relaxed">{why}</p>
            </div>
          )}
          {listen && (
            <div className="bg-[#F0FFF9] border border-[#10B981]/15 rounded-xl p-4">
              <p className="text-xs font-bold text-[#10B981] uppercase tracking-wide mb-2">Listen For</p>
              <p className="text-sm text-[#13105A] leading-relaxed">{listen}</p>
            </div>
          )}
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
    if (!trimmed) {
      setError('Please enter your API key.')
      return
    }
    if (!trimmed.startsWith('sk-ant-')) {
      setError('Anthropic API keys start with "sk-ant-" — double-check and try again.')
      return
    }
    setApiKey(trimmed)
    onSave()
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-[#F8F7FF] px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#6B4EF3] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-[#6B4EF3]/30">
            🧠
          </div>
          <h1 className="text-2xl font-bold text-[#13105A] mb-2">Connect Cora's Brain</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Enter your Anthropic API key to unlock real-time AI coaching during live calls.
            Your key is stored in your browser only — never sent anywhere except directly to Anthropic.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <label className="block text-sm font-semibold text-[#13105A] mb-2">
            Anthropic API Key
          </label>
          <input
            type="password"
            value={key}
            onChange={e => { setKey(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            placeholder="sk-ant-api03-..."
            autoFocus
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#6B4EF3]/40 focus:border-[#6B4EF3] transition-all"
          />
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className="mt-4 w-full bg-[#6B4EF3] hover:bg-[#5A3EE0] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-md shadow-[#6B4EF3]/20"
          >
            Connect &amp; Start Coaching
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            Get a key at{' '}
            <span className="font-mono">console.anthropic.com</span>
            {' '}· Stored in your browser only
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LiveAdvice() {
  const [hasKey, setHasKey] = useState(() => !!getApiKey())
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [error, setError] = useState('')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText, isLoading])

  async function sendMessage(text) {
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
  }

  function newCall() {
    setMessages([])
    setStreamingText('')
    setError('')
    setInput('')
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  if (!hasKey) {
    return <ApiKeySetup onSave={() => setHasKey(true)} />
  }

  return (
    <div className="flex-1 flex flex-col bg-[#F8F7FF] min-h-0">

      {/* Sub-header */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-bold text-[#13105A]">Live Call Mode</span>
            </span>
            <span className="text-gray-200 select-none">|</span>
            <span className="text-sm text-gray-400 hidden sm:inline">
              Tell Cora what's happening — get the exact words to say now
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { clearApiKey(); setHasKey(false) }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1 rounded-lg hover:bg-gray-50"
            >
              Change Key
            </button>
            <button
              onClick={newCall}
              className="bg-[#6B4EF3]/10 hover:bg-[#6B4EF3]/20 text-[#6B4EF3] text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              + New Call
            </button>
          </div>
        </div>
      </div>

      {/* Quick situations */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {QUICK_SITUATIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s.prompt)}
                disabled={isLoading}
                className="text-xs font-medium bg-[#F0EEFF] hover:bg-[#E0D9FF] text-[#6B4EF3] px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">

          {messages.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-[#6B4EF3]/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-5">
                🤖
              </div>
              <h2 className="text-lg font-bold text-[#13105A] mb-2">Ready to coach</h2>
              <p className="text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
                Describe what's happening on your call and Cora will give you the exact script to use right now.
                Use the quick buttons above or type in your own situation below.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <AdviceBlock key={i} message={msg} isStreaming={false} />
          ))}

          {streamingText && (
            <AdviceBlock
              message={{ role: 'assistant', content: streamingText }}
              isStreaming={true}
            />
          )}

          {isLoading && !streamingText && (
            <div className="flex justify-start mb-4">
              <div className="bg-white rounded-2xl rounded-bl-none px-5 py-3.5 shadow-sm border border-gray-100 flex items-center gap-2">
                <span className="text-sm text-gray-400">Cora is thinking</span>
                <BounceDots />
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 text-sm text-red-600">
              {error} — Check your API key or try again.
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-6 py-4 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder="What's happening on your call right now? (e.g. 'Customer just found out claim was denied and is getting loud')"
              rows={2}
              disabled={isLoading}
              className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-[#13105A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6B4EF3]/40 focus:border-[#6B4EF3] resize-none disabled:opacity-50 transition-all"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 bg-[#6B4EF3] hover:bg-[#5A3EE0] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-colors shadow-md shadow-[#6B4EF3]/20 shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  )
}
