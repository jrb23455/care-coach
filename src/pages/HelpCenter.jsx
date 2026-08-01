import { useState, useRef, useEffect } from 'react'
import CoraRobot from '../components/CoraRobot'

const categories = [
  { icon: '💬', iconBg: 'bg-pink-100', title: 'De-escalate Rude Customers' },
  { icon: '💭', iconBg: 'bg-orange-100', title: 'What to Say (Examples)' },
  { icon: '✏️', iconBg: 'bg-yellow-100', title: 'Objections & Pushback' },
  { icon: '📞', iconBg: 'bg-blue-100', title: 'Call Flow & Best Practices' },
  { icon: '🧠', iconBg: 'bg-teal-100', title: 'Emotional Control & Mindset' },
  { icon: '🛡️', iconBg: 'bg-purple-100', title: 'Policies & Escalations' },
]

const faqs = [
  {
    q: 'What should I do if a customer is yelling at me?',
    a: "Lower your own voice and slow your pace — don't match their energy. Let them finish completely, then say: \"I hear how frustrated you are, and I want to make sure I get this right for you.\" Silence and a calm tone are your most powerful tools when someone is yelling.",
  },
  {
    q: 'How do I de-escalate an angry customer?',
    a: "Use the LAER method: Listen fully (no interrupting), Acknowledge their frustration, Empathize genuinely (\"I'd feel the same way\"), then Respond with a concrete next step. The order matters — jumping to solutions before acknowledging almost always makes things worse.",
  },
  {
    q: 'What are good things to say to a frustrated customer?',
    a: "\"I completely understand why you're upset.\" / \"That's not the experience we want you to have.\" / \"Here's what I can do right now...\" / \"I'm going to personally make sure this gets resolved.\" Avoid \"I understand\" before they finish — it signals you stopped listening.",
  },
  {
    q: 'How do I set boundaries without losing the sale?',
    a: "Stay warm but firm. \"I want to help you find a solution, and I also need us to be able to have that conversation\" — said calmly and without apology — communicates limits without escalating. Offering a choice (\"Would you like to continue now or call back when you have more time?\") also restores their sense of control.",
  },
  {
    q: 'When and how should I involve my market leader?',
    a: "Involve your market leader when: (1) a customer specifically asks for a manager and you've genuinely tried to resolve it, (2) the issue is outside your authority, or (3) the call turns abusive rather than just frustrated. Important: market leaders can't join calls or take live transfers. The right move is to commit to a market leader callback with a specific time — never 'someone will call you back.' Always brief your market leader fully before they reach out, so the customer doesn't have to repeat their story.",
  },
]

const topResources = [
  { type: 'GUIDE', typeColor: 'text-blue-600', icon: '📖', iconBg: 'bg-blue-50', title: 'De-escalation Playbook', meta: 'PDF' },
  { type: 'TOOL', typeColor: 'text-teal-600', icon: '🛠️', iconBg: 'bg-teal-50', title: 'Calm & Confident Phrases', meta: 'Interactive Tool' },
  { type: 'VIDEO', typeColor: 'text-orange-500', icon: '▶️', iconBg: 'bg-orange-50', title: 'Real Call Examples: Good vs. Better', meta: '10 min watch' },
  { type: 'CHECKLIST', typeColor: 'text-purple-600', icon: '✅', iconBg: 'bg-purple-50', title: 'Difficult Call Prep Checklist', meta: 'Use checklist' },
]

const quickChips = [
  'The customer keeps interrupting me',
  "They're threatening to cancel!",
  'They want to speak to a manager',
  'Give me a de-escalation tip',
]

const coraKnowledge = {
  'The customer keeps interrupting me':
    "Try the \"pause and acknowledge\" move. Wait for a natural break, then say: \"I want to make sure I capture everything you're telling me — can I take a quick note?\" This validates them and naturally resets the pace. If interrupting continues, calmly and kindly name it: \"I want to hear everything — let me finish this one point and then you have the floor.\"",
  "They're threatening to cancel!":
    "Don't panic — this is usually a signal that they feel unheard, not a final decision. Lead with: \"You've been with us, and that means something to me. Before you decide, can I understand what's driving this?\" Then listen before you counter. Retention offers work best when they're tied to the customer's specific complaint — not a generic discount.",
  'They want to speak to a manager':
    "At Allstate, market leaders can't be brought onto calls or take live transfers — and that's okay. Be honest about it: \"I don't have a way to bring my market leader on the call right now, but I can have them call you back at a specific time.\" Commit to briefing your market leader yourself so the customer doesn't have to repeat their story. And always try to resolve it yourself first — ask what outcome they're actually looking for.",
  'Give me a de-escalation tip':
    "Here's one that works every time: slow your speaking pace by about 20% when a customer is upset. Angry people talk fast, and unconsciously matching that pace escalates tension — even if your words are calm. Slowing down creates a subtle but real calming pull. Pair it with a volume slightly lower than theirs.",
}

function getCoraResponse(text) {
  const lower = text.toLowerCase()
  for (const [key, val] of Object.entries(coraKnowledge)) {
    if (lower.includes(key.toLowerCase().slice(0, 12))) return val
  }
  if (lower.includes('manager') || lower.includes('supervisor') || lower.includes('market leader') || lower.includes('escalat'))
    return "Market leaders at Allstate can't join calls or take live transfers. Be upfront: \"I can't bring my market leader on the call, but I can have them call you back.\" Then commit to a specific time and brief them fully before they reach out. Most of the time, if you ask what outcome the customer actually wants, you can solve it yourself."
  if (lower.includes('outbound') || lower.includes('cold call') || lower.includes('they hung up') || lower.includes('not interested'))
    return "On outbound calls, anger usually comes from one of two places: they're busy, or they've had a bad experience before. Don't fight either. If they're busy: \"I'll be quick — when's a better time?\" If they're hostile about a past experience: let them say it, then: \"That's fair, and I'd like to understand what happened.\" Never push past a clear no on outbound — it's a compliance issue and it burns the relationship."
  if (lower.includes('yell') || lower.includes('shout') || lower.includes('scream'))
    return "Lower your own voice — don't match theirs. Let them finish completely. Then: \"I hear how frustrated you are. I want to get this right for you.\" Silence and a calm tone are underrated de-escalation tools."
  if (lower.includes('cancel') || lower.includes('switch') || lower.includes('competitor'))
    return "When a customer threatens to leave, resist the urge to immediately offer a discount. Start with: \"I'd really like to understand what's driving this before we go anywhere.\" Understanding the real issue is the most powerful retention move you have."
  if (lower.includes('claim') || lower.includes('denied'))
    return "For a denied claim: acknowledge first, explain second. \"I can hear how upsetting this is, and you deserve a clear explanation.\" Then walk through the specific reason and, critically, tell them about their right to appeal — that's often the thing that turns the call around."
  return "Great question. My top advice: let them finish before you respond — even if you already know the answer. A 2-second pause after they stop speaking communicates that you genuinely heard them. It's the simplest thing that makes the biggest difference."
}

const ALL_SEARCHABLE = [
  ...faqs.map(f => ({ type: 'faq', title: f.q, body: f.a })),
  ...topResources.map(r => ({ type: 'resource', title: r.title, body: r.type })),
  ...categories.map(c => ({ type: 'category', title: c.title, body: '' })),
]

function searchItems(query) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return ALL_SEARCHABLE.filter(item =>
    item.title.toLowerCase().includes(q) || item.body.toLowerCase().includes(q)
  ).slice(0, 6)
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400"
          style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
      ))}
      <style>{`@keyframes bounce { 0%,80%,100% { transform:translateY(0) } 40% { transform:translateY(-5px) } }`}</style>
    </div>
  )
}

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [helpful, setHelpful] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  function send(text) {
    const msg = (text || inputText).trim()
    if (!msg) return
    const reply = getCoraResponse(msg)
    setMessages(prev => [...prev, { from: 'user', text: msg }])
    setInputText('')
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { from: 'cora', text: reply }])
    }, 900 + Math.random() * 600)
  }

  const searchResults = searchItems(searchQuery)

  return (
    <div>
      {/* ── Hero ── */}
      <section className="bg-[#EAE7FF] px-6 py-10">
        <div className="max-w-7xl mx-auto flex items-center gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#13105A] mb-1">Hi, I'm Cora!</h1>
            <p className="text-lg text-[#6B7280] mb-6">How can I help you today?</p>
            <div className="relative max-w-lg">
              <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Search for help (e.g., "rude customer", "de-escalation tips")'
                  className="flex-1 text-sm outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                />
                {searchQuery ? (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                ) : (
                  <button className="w-8 h-8 bg-[#6B4EF3] rounded-lg flex items-center justify-center text-white text-sm shrink-0">🔍</button>
                )}
              </div>
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-10 overflow-hidden">
                  {searchResults.map((r, i) => (
                    <button key={i}
                      onClick={() => { setSearchQuery(''); if (r.type === 'faq') setOpenFaq(faqs.findIndex(f => f.q === r.title)) }}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-50 flex items-start gap-3 border-b border-gray-50 last:border-0">
                      <span className="text-lg shrink-0">{r.type === 'faq' ? '❓' : r.type === 'resource' ? '📖' : '📂'}</span>
                      <div>
                        <div className="text-sm font-medium text-[#13105A]">{r.title}</div>
                        <div className="text-xs text-gray-400 capitalize">{r.type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-10 p-4 text-sm text-gray-500">
                  No results for "{searchQuery}" — try asking Cora in the chat!
                </div>
              )}
            </div>
          </div>
          <div className="shrink-0 relative">
            <div className="absolute -top-4 right-0 bg-white rounded-2xl rounded-br-none shadow-md px-4 py-3 max-w-[200px]">
              <p className="text-xs text-[#13105A]">Ask me anything about handling difficult customers in insurance sales.</p>
            </div>
            <CoraRobot size={170} />
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-7xl mx-auto grid grid-cols-6 gap-3 mt-8">
          {categories.map((c, i) => (
            <button key={i} className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-full ${c.iconBg} flex items-center justify-center text-xl`}>
                {c.icon}
              </div>
              <span className="text-xs font-medium text-[#13105A] text-center leading-tight">{c.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── FAQs + Chat ── */}
      <section className="bg-white px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {/* FAQ accordion */}
          <div className="col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-[#13105A]">Popular Questions</h2>
              <button className="text-sm text-[#6B4EF3] hover:underline">View all FAQs</button>
            </div>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium text-[#13105A] pr-4">{faq.q}</span>
                    <span className="text-gray-400 shrink-0 text-xs">{openFaq === i ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chat with Cora */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden flex flex-col" style={{ height: '480px' }}>
            <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-2 shrink-0">
              <span className="font-semibold text-sm text-[#13105A]">Chat with Cora</span>
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-green-500 font-medium">Online</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
              {/* Cora's opening */}
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-[#6B4EF3] flex items-center justify-center text-xs text-white shrink-0 font-bold">C</div>
                <div className="bg-white rounded-2xl rounded-tl-none px-3 py-2.5 text-xs text-gray-700 shadow-sm max-w-[200px] leading-relaxed">
                  I'm here to help you handle tough customers and grow with confidence.
                </div>
              </div>

              {messages.map((m, i) =>
                m.from === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="bg-[#6B4EF3] rounded-2xl rounded-tr-none px-3 py-2.5 text-xs text-white max-w-[200px] leading-relaxed">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#6B4EF3] flex items-center justify-center text-xs text-white shrink-0 font-bold">C</div>
                    <div className="bg-white rounded-2xl rounded-tl-none px-3 py-2.5 text-xs text-gray-700 shadow-sm max-w-[200px] leading-relaxed">
                      {m.text}
                    </div>
                  </div>
                )
              )}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#6B4EF3] flex items-center justify-center text-xs text-white shrink-0 font-bold">C</div>
                  <div className="bg-white rounded-2xl rounded-tl-none shadow-sm">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick chips — shown only before first message */}
            {messages.length === 0 && (
              <div className="px-3 py-2.5 border-t border-gray-100 space-y-1.5 shrink-0 bg-white">
                {quickChips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => send(chip)}
                    className="w-full text-left text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[#6B4EF3] hover:text-[#6B4EF3] transition-colors truncate"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-200 px-3 py-2.5 flex items-center gap-2 bg-white shrink-0">
              <input
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Type your question..."
                className="flex-1 text-xs outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={() => send()}
                className="w-7 h-7 bg-[#6B4EF3] hover:bg-[#5A3EE0] rounded-full flex items-center justify-center text-white text-sm transition-colors shrink-0"
              >
                →
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 pb-2 bg-white shrink-0">
              Cora is an AI coach and can make mistakes.<br/>Do not share personal or sensitive information.
            </p>
          </div>
        </div>
      </section>

      {/* ── Top Resources ── */}
      <section className="bg-gray-50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-[#13105A]">Top Resources</h2>
            <button className="text-sm text-[#6B4EF3] hover:underline">View all resources</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {topResources.map((r, i) => (
              <button key={i} className="bg-white rounded-2xl border border-gray-100 p-4 text-left hover:shadow-sm transition-shadow">
                <p className={`text-xs font-semibold ${r.typeColor} mb-3`}>{r.type}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${r.iconBg} flex items-center justify-center text-xl shrink-0`}>
                    {r.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-[#13105A] leading-tight">{r.title}</h3>
                </div>
                <p className="text-xs text-gray-400 mt-3">⏱ {r.meta}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Was this helpful ── */}
      <section className="bg-white px-6 py-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-xl">👍</div>
            <div>
              <p className="font-semibold text-sm text-[#13105A]">Was this helpful?</p>
              <p className="text-xs text-gray-400">Your feedback helps us improve.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setHelpful(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                helpful === true ? 'bg-[#6B4EF3] text-white border-[#6B4EF3]' : 'border-gray-200 text-gray-700 hover:border-[#6B4EF3]'
              }`}
            >
              Yes, it was
            </button>
            <button
              onClick={() => setHelpful(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                helpful === false ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-200 text-gray-700 hover:border-gray-400'
              }`}
            >
              Not really
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white px-6 py-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-400">
          <span>Still need help? <button className="text-[#6B4EF3] hover:underline">Contact Support</button></span>
          <div className="flex gap-4">
            <button className="hover:text-gray-600 transition-colors">Privacy Policy</button>
            <button className="hover:text-gray-600 transition-colors">Terms of Use</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
