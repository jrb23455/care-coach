import { useState, useRef, useEffect } from 'react'
import CoraRobot from '../components/CoraRobot'

const categories = [
  { icon: '💬', iconBg: 'bg-pink-100',   title: 'De-escalate Rude Customers',    prompt: 'How do I handle a customer who is being rude or disrespectful?' },
  { icon: '💭', iconBg: 'bg-orange-100', title: 'What to Say (Examples)',          prompt: 'Give me examples of what to say to a frustrated or difficult customer.' },
  { icon: '✏️', iconBg: 'bg-yellow-100', title: 'Objections & Pushback',           prompt: 'How do I handle customer objections and pushback effectively?' },
  { icon: '📞', iconBg: 'bg-blue-100',   title: 'Call Flow & Best Practices',      prompt: 'What are best practices for managing the flow of a difficult call?' },
  { icon: '🧠', iconBg: 'bg-teal-100',   title: 'Emotional Control & Mindset',     prompt: 'How do I stay calm and in control emotionally on a tough call?' },
  { icon: '🛡️', iconBg: 'bg-purple-100', title: 'Policies & Escalations',          prompt: 'What do I need to know about escalating to my market leader?' },
]

const allFaqs = [
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
    a: "Involve your market leader when: (1) a customer specifically asks for a manager and you've genuinely tried to resolve it, (2) the issue is outside your authority, or (3) the call turns abusive. Important: market leaders can't join calls or take live transfers. Commit to a callback with a specific time — never 'someone will call you back.' Always brief your market leader fully before they reach out.",
  },
  {
    q: 'What do I do when a customer threatens to record the call?',
    a: "Don't panic — in most states, calls to insurance agents are already being recorded on the company side. Say calmly: \"That's absolutely fine. I just want to make sure I'm helping you as best I can.\" Then keep going. A customer who wants to record is usually one who feels unheard — your calm acknowledgment often defuses that immediately.",
  },
  {
    q: 'How do I handle a customer who keeps interrupting me?',
    a: "Try the pause-and-acknowledge move: wait for a natural break, then say \"I want to make sure I capture everything you're telling me — can I take a quick note?\" This validates them and naturally resets the pace. If it continues: \"I want to hear everything — let me finish this one point and then you have the floor.\"",
  },
  {
    q: 'What should I never say to an upset customer?',
    a: "\"Calm down\" (invalidates their emotion), \"That's our policy\" (sounds like 'tough luck'), \"There's nothing I can do\" (almost never true — say what you CAN do instead), \"I understand\" before they finish (signals you stopped listening), \"You'll have to speak to someone else\" without a clear path forward.",
  },
]

const resourceContent = [
  {
    type: 'GUIDE', typeColor: 'text-blue-600', icon: '📖', iconBg: 'bg-blue-50',
    title: 'De-escalation Playbook', meta: 'Reference guide',
    content: [
      {
        heading: 'Phase 1: RECEIVE — Let them vent',
        body: "Don't interrupt. Don't explain. Just listen completely. Your goal is to understand both the core issue AND the emotion behind it. Note: What's the actual problem? How long has it been going on? What outcome are they looking for?",
      },
      {
        heading: 'Phase 2: ACKNOWLEDGE — Reflect before you respond',
        body: "Before offering any solution, reflect back what you heard. \"So what I'm hearing is...\" or \"It sounds like the core issue is...\" This proves you listened and resets the emotional temperature of the call.",
      },
      {
        heading: 'Phase 3: EMPATHIZE — Name the emotion',
        body: "\"I'd feel the same way.\" / \"That's genuinely frustrating.\" / \"I hear how stressful this has been.\" Say it and mean it — premature solutions without empathy almost always backfire. Don't rush to Phase 4.",
      },
      {
        heading: 'Phase 4: RESPOND — Offer your solution',
        body: "Only after phases 1–3 do you start problem-solving. Lead with what you CAN do, not what you can't. Be specific. Vague next steps restart the anger cycle.",
      },
      {
        heading: 'Phase 5: CONFIRM & CLOSE — Lock it in',
        body: "Repeat the resolution back. Confirm they understand. Ask: \"Is there anything else I can help you with today?\" End on a human note — not a form.",
      },
      {
        heading: 'Critical DON\'Ts',
        body: "❌ \"Calm down\" — tells them their reaction is wrong\n❌ \"That's our policy\" — sounds like 'tough luck'\n❌ Jumping to solutions before Phases 1–3\n❌ Promising things outside your authority\n❌ Saying \"someone will call you back\" without a specific time",
      },
    ],
  },
  {
    type: 'TOOL', typeColor: 'text-teal-600', icon: '🛠️', iconBg: 'bg-teal-50',
    title: 'Calm & Confident Phrases', meta: 'Interactive phrase bank',
    phrases: [
      { situation: 'When they\'re yelling', phrase: '"I hear how frustrated you are, and I want to make sure I get this right for you."', why: 'Acknowledges without escalating. Lower your voice as you say it.' },
      { situation: 'To acknowledge the issue', phrase: '"That\'s not the experience we want you to have, and I\'m sorry it happened."', why: 'Takes ownership without admitting legal fault.' },
      { situation: 'To buy time', phrase: '"I want to make sure I fully understand — let me pull up your account."', why: 'Gives you 30 seconds and signals you\'re taking it seriously.' },
      { situation: 'To set limits firmly', phrase: '"I want to help you resolve this, and I also need us to be able to have that conversation."', why: 'Sets a boundary without being confrontational.' },
      { situation: 'On market leader requests', phrase: '"I can\'t bring my market leader onto the call, but I can commit to having them call you back by [specific time]."', why: 'Honest about the process. Specificity is the key.' },
      { situation: 'To offer control', phrase: '"Here\'s what I can do — would you prefer [option A] or [option B]?"', why: 'Restoring choice defuses the powerless feeling behind most anger.' },
      { situation: 'When they threaten to cancel', phrase: '"You\'ve been with us a long time — before you decide, I\'d like to understand what\'s driving this."', why: 'Leads with the relationship. Doesn\'t panic or immediately offer discounts.' },
      { situation: 'To close strong', phrase: '"I want to make sure you feel good about where we\'ve landed. Does this work for you?"', why: 'Confirms resolution and ends on a collaborative note.' },
    ],
  },
  {
    type: 'TRANSCRIPT', typeColor: 'text-orange-500', icon: '📋', iconBg: 'bg-orange-50',
    title: 'Real Call Examples: Good vs. Better', meta: 'Script comparison',
    examples: [
      {
        scenario: 'Customer upset about a premium increase',
        bad: { label: '❌ What makes it worse', lines: [
          { speaker: 'Customer', text: 'My bill went up $80 and nobody told me! This is ridiculous.' },
          { speaker: 'Agent', text: 'Ma\'am, rates go up every year — it\'s standard practice. I can see the letter was sent in March, so you should have received notification.' },
        ]},
        good: { label: '✅ Better approach', lines: [
          { speaker: 'Customer', text: 'My bill went up $80 and nobody told me! This is ridiculous.' },
          { speaker: 'Agent', text: 'I\'m really sorry you were caught off guard — that\'s a frustrating experience and you deserved advance notice. Let me pull up your account right now and walk you through exactly why this changed and what we can do.' },
        ]},
        lesson: 'Lead with the experience, not the explanation. Explaining first sounds defensive.',
      },
      {
        scenario: 'Customer demanding to speak to a manager',
        bad: { label: '❌ What makes it worse', lines: [
          { speaker: 'Customer', text: 'I want your supervisor. You people are useless.' },
          { speaker: 'Agent', text: 'I\'m sorry, I don\'t have a supervisor available right now. I\'ll have someone call you back.' },
        ]},
        good: { label: '✅ Better approach', lines: [
          { speaker: 'Customer', text: 'I want your supervisor. You people are useless.' },
          { speaker: 'Agent', text: 'I hear you. I don\'t have a way to bring my market leader onto the call, but I can have them call you back at a specific time — and I\'ll brief them fully so you don\'t have to repeat yourself. But first — what outcome would actually make this right for you? Sometimes I can solve it right here.' },
        ]},
        lesson: 'Be honest about the process. Asking what they actually want often resolves the escalation entirely.',
      },
    ],
  },
  {
    type: 'CHECKLIST', typeColor: 'text-purple-600', icon: '✅', iconBg: 'bg-purple-50',
    title: 'Difficult Call Prep Checklist', meta: 'Use before a tough call',
    items: [
      'Account history and open issues are pulled up',
      'Billing and claims notes are visible',
      'Notifications silenced — no distractions',
      'I know this customer\'s history with us',
      'I\'ve taken a slow breath before answering',
      'I remember: anger is about the situation, not me personally',
      'I know my authority limits for this call type',
      'I know the escalation path if needed (market leader callback — not a transfer)',
      'I\'m ready to listen completely before responding',
      'I will not say "calm down," "that\'s our policy," or "there\'s nothing I can do"',
    ],
  },
]

const quickChips = [
  'The customer keeps interrupting me',
  "They're threatening to cancel!",
  'They want to speak to a manager',
  'Give me a de-escalation tip',
]

const coraKnowledge = {
  'The customer keeps interrupting me':
    "Try the \"pause and acknowledge\" move. Wait for a natural break, then say: \"I want to make sure I capture everything you're telling me — can I take a quick note?\" This validates them and naturally resets the pace. If interrupting continues, calmly name it: \"I want to hear everything — let me finish this one point and then you have the floor.\"",
  "They're threatening to cancel!":
    "Don't panic — this is usually a signal that they feel unheard, not a final decision. Lead with: \"You've been with us, and that means something to me. Before you decide, can I understand what's driving this?\" Then listen before you counter. Retention offers work best when tied to the customer's specific complaint — not a generic discount.",
  'They want to speak to a manager':
    "At Allstate, market leaders can't be brought onto calls or take live transfers — and that's okay. Be honest: \"I don't have a way to bring my market leader on the call right now, but I can have them call you back at a specific time.\" Commit to briefing your market leader yourself so the customer doesn't have to repeat their story. Always try to resolve it yourself first — ask what outcome they're actually looking for.",
  'Give me a de-escalation tip':
    "Here's one that works every time: slow your speaking pace by about 20% when a customer is upset. Angry people talk fast, and matching that pace escalates tension even if your words are calm. Slowing down creates a subtle but real calming pull. Pair it with a volume slightly lower than theirs.",
}

function getCoraResponse(text) {
  const lower = text.toLowerCase()
  for (const [key, val] of Object.entries(coraKnowledge)) {
    if (lower.includes(key.toLowerCase().slice(0, 12))) return val
  }
  if (lower.includes('manager') || lower.includes('supervisor') || lower.includes('market leader') || lower.includes('escalat'))
    return "Market leaders at Allstate can't join calls or take live transfers. Be upfront: \"I can't bring my market leader on the call, but I can have them call you back.\" Commit to a specific time and brief them fully before they reach out. Most of the time, if you ask what outcome the customer actually wants, you can solve it yourself."
  if (lower.includes('outbound') || lower.includes('cold call') || lower.includes('they hung up') || lower.includes('not interested'))
    return "On outbound calls, anger usually comes from one of two places: they're busy, or they've had a bad experience before. Don't fight either. If they're busy: \"I'll be quick — when's a better time?\" If they're hostile: let them say it, then: \"That's fair, and I'd like to understand what happened.\" Never push past a clear no on outbound — it's a compliance issue and it burns the relationship."
  if (lower.includes('rude') || lower.includes('yell') || lower.includes('shout') || lower.includes('disrespect'))
    return "Lower your own voice — don't match theirs. Let them finish completely. Then: \"I hear how frustrated you are. I want to get this right for you.\" Silence and a calm tone are underrated de-escalation tools."
  if (lower.includes('what to say') || lower.includes('example') || lower.includes('phrase') || lower.includes('script'))
    return "Some go-to phrases: \"I completely understand why you're upset.\" / \"That's not the experience we want you to have.\" / \"Here's what I can do right now...\" / \"I'm going to personally make sure this gets resolved.\" Avoid \"I understand\" before they finish — it signals you stopped listening."
  if (lower.includes('objection') || lower.includes('pushback') || lower.includes('not interested'))
    return "When a customer pushes back, resist the urge to defend. Instead, ask: \"Help me understand what your main concern is.\" Most objections are really about trust or a past experience — once you know which, you can actually address it. Never argue with an objection; validate it first."
  if (lower.includes('call flow') || lower.includes('best practice') || lower.includes('structure'))
    return "The best call flow for a difficult customer: (1) Let them finish — no interrupting. (2) Reflect back what you heard. (3) Empathize genuinely. (4) Then and only then offer your solution. Jumping to solutions before steps 1–3 almost always makes things worse. The whole sequence takes 60–90 seconds and saves 10 minutes of escalation."
  if (lower.includes('calm') || lower.includes('mindset') || lower.includes('emotional') || lower.includes('stress'))
    return "The most effective mindset shift: their anger is about the situation, not you personally. The moment you take it personally, your voice tightens and they feel it. Take a slow breath before you respond — literally 1–2 seconds of silence after they finish reads as 'I heard you' and gives you a reset."
  if (lower.includes('policy') || lower.includes('escalation') || lower.includes('authority') || lower.includes('can i'))
    return "Know your authority limits before the call: what fees can you waive, what corrections can you initiate, what requires market leader sign-off. When something is outside your authority, say what you CAN do first: \"What I can do right now is [X]. For [Y], I'll need my market leader to follow up — I'll brief them fully so you don't have to repeat yourself.\""
  if (lower.includes('cancel') || lower.includes('switch') || lower.includes('competitor'))
    return "When a customer threatens to leave, resist the urge to immediately offer a discount. Start with: \"I'd really like to understand what's driving this before we go anywhere.\" Understanding the real issue is the most powerful retention move you have."
  if (lower.includes('claim') || lower.includes('denied'))
    return "For a denied claim: acknowledge first, explain second. \"I can hear how upsetting this is, and you deserve a clear explanation.\" Then walk through the specific reason and, critically, tell them about their right to appeal — that's often the thing that turns the call around."
  return "Great question. My top advice: let them finish before you respond — even if you already know the answer. A 2-second pause after they stop speaking communicates that you genuinely heard them. It's the simplest thing that makes the biggest difference."
}

const ALL_SEARCHABLE = [
  ...allFaqs.map(f => ({ type: 'faq', title: f.q, body: f.a })),
  ...resourceContent.map(r => ({ type: 'resource', title: r.title, body: r.type })),
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

function ResourceModal({ resource, onClose }) {
  if (!resource) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${resource.iconBg} flex items-center justify-center text-xl shrink-0`}>
              {resource.icon}
            </div>
            <div>
              <p className={`text-xs font-bold uppercase tracking-wide ${resource.typeColor}`}>{resource.type}</p>
              <h2 className="font-bold text-[#13105A]">{resource.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-4 shrink-0">×</button>
        </div>

        <div className="px-6 py-5">
          {/* GUIDE — sections */}
          {resource.content && resource.content.map((s, i) => (
            <div key={i} className="mb-5">
              <h3 className="font-bold text-[#13105A] text-sm mb-2">{s.heading}</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{s.body}</p>
            </div>
          ))}

          {/* TOOL — phrase bank */}
          {resource.phrases && (
            <div className="space-y-3">
              {resource.phrases.map((p, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-[#6B4EF3] uppercase tracking-wide mb-1">{p.situation}</p>
                  <p className="text-sm font-medium text-[#13105A] mb-2 italic">{p.phrase}</p>
                  <p className="text-xs text-gray-500">{p.why}</p>
                </div>
              ))}
            </div>
          )}

          {/* TRANSCRIPT — good vs bad */}
          {resource.examples && resource.examples.map((ex, i) => (
            <div key={i} className="mb-8">
              <h3 className="font-bold text-[#13105A] text-sm mb-4 pb-2 border-b border-gray-100">Scenario: {ex.scenario}</h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                {[ex.bad, ex.good].map((side, j) => (
                  <div key={j} className={`rounded-xl p-4 ${j === 0 ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
                    <p className={`text-xs font-bold mb-3 ${j === 0 ? 'text-red-600' : 'text-green-600'}`}>{side.label}</p>
                    <div className="space-y-2">
                      {side.lines.map((line, k) => (
                        <div key={k}>
                          <span className={`text-xs font-bold ${line.speaker === 'Agent' ? (j === 0 ? 'text-red-500' : 'text-green-600') : 'text-gray-500'}`}>
                            {line.speaker}:{' '}
                          </span>
                          <span className="text-xs text-gray-700 leading-relaxed">{line.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#F0EEFF] rounded-xl px-4 py-3">
                <p className="text-xs font-bold text-[#6B4EF3] mb-1">Key Lesson</p>
                <p className="text-xs text-[#13105A]">{ex.lesson}</p>
              </div>
            </div>
          ))}

          {/* CHECKLIST — interactive */}
          {resource.items && <ChecklistResource items={resource.items} />}
        </div>
      </div>
    </div>
  )
}

function ChecklistResource({ items }) {
  const [checked, setChecked] = useState(() => new Array(items.length).fill(false))
  const doneCount = checked.filter(Boolean).length

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{doneCount} of {items.length} checked</p>
        <button
          onClick={() => setChecked(new Array(items.length).fill(false))}
          className="text-xs text-[#6B4EF3] hover:underline"
        >
          Reset
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n })}
            className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
              checked[i]
                ? 'bg-green-50 border-green-200 text-gray-400 line-through'
                : 'bg-white border-gray-200 hover:border-[#6B4EF3]/40 text-[#13105A]'
            }`}
          >
            <span className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
              checked[i] ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
            }`}>
              {checked[i] && <span className="text-xs font-bold">✓</span>}
            </span>
            <span className="text-sm leading-snug">{item}</span>
          </button>
        ))}
      </div>
      {doneCount === items.length && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-sm font-bold text-green-700">You're ready. Go take care of that customer.</p>
        </div>
      )}
    </div>
  )
}

export default function HelpCenter() {
  const [openFaq, setOpenFaq] = useState(null)
  const [showAllFaqs, setShowAllFaqs] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [helpful, setHelpful] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openResource, setOpenResource] = useState(null)
  const chatEndRef = useRef(null)
  const chatRef = useRef(null)
  const resourcesRef = useRef(null)

  const visibleFaqs = showAllFaqs ? allFaqs : allFaqs.slice(0, 5)

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

  function handleCategory(cat) {
    send(cat.prompt)
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
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
                      onClick={() => {
                        setSearchQuery('')
                        if (r.type === 'faq') setOpenFaq(allFaqs.findIndex(f => f.q === r.title))
                        if (r.type === 'resource') setOpenResource(resourceContent.findIndex(rc => rc.title === r.title))
                        if (r.type === 'category') handleCategory(categories.find(c => c.title === r.title))
                      }}
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
            <button
              key={i}
              onClick={() => handleCategory(c)}
              className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:border-[#6B4EF3]/30 border border-transparent transition-all"
            >
              <div className={`w-10 h-10 rounded-full ${c.iconBg} flex items-center justify-center text-xl`}>
                {c.icon}
              </div>
              <span className="text-xs font-medium text-[#13105A] text-center leading-tight">{c.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── FAQs + Chat ── */}
      <section ref={chatRef} className="bg-white px-6 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-6">
          {/* FAQ accordion */}
          <div className="col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-[#13105A]">Popular Questions</h2>
              <button
                onClick={() => setShowAllFaqs(v => !v)}
                className="text-sm text-[#6B4EF3] hover:underline"
              >
                {showAllFaqs ? 'Show fewer' : `View all ${allFaqs.length} FAQs`}
              </button>
            </div>
            <div className="space-y-2">
              {visibleFaqs.map((faq, i) => (
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
      <section ref={resourcesRef} className="bg-gray-50 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-[#13105A]">Top Resources</h2>
            <button
              onClick={() => resourcesRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm text-[#6B4EF3] hover:underline"
            >
              View all resources
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {resourceContent.map((r, i) => (
              <button
                key={i}
                onClick={() => setOpenResource(i)}
                className="bg-white rounded-2xl border border-gray-100 p-4 text-left hover:shadow-md hover:border-[#6B4EF3]/30 transition-all"
              >
                <p className={`text-xs font-semibold ${r.typeColor} mb-3`}>{r.type}</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${r.iconBg} flex items-center justify-center text-xl shrink-0`}>
                    {r.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-[#13105A] leading-tight">{r.title}</h3>
                </div>
                <p className="text-xs text-gray-400 mt-3">⏱ {r.meta}</p>
                <p className="text-xs text-[#6B4EF3] mt-2 font-medium">Open →</p>
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
              {helpful === true ? '✓ Thanks!' : 'Yes, it was'}
            </button>
            <button
              onClick={() => setHelpful(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                helpful === false ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-200 text-gray-700 hover:border-gray-400'
              }`}
            >
              {helpful === false ? 'Thanks for letting us know' : 'Not really'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white px-6 py-4 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-400">
          <span>
            Still need help?{' '}
            <a href="mailto:support@allstate.com" className="text-[#6B4EF3] hover:underline">
              Contact Support
            </a>
          </span>
          <div className="flex gap-4">
            <span className="text-gray-300">Privacy Policy</span>
            <span className="text-gray-300">Terms of Use</span>
          </div>
        </div>
      </footer>

      {/* ── Resource Modal ── */}
      {openResource !== null && (
        <ResourceModal
          resource={resourceContent[openResource]}
          onClose={() => setOpenResource(null)}
        />
      )}
    </div>
  )
}
