import { useState, useRef, useEffect, useMemo } from 'react'
import CoraRobot from '../components/CoraRobot'
import ConversationPlayer from '../components/ConversationPlayer'
import { useTheme } from '../hooks/useTheme'
import { getApiKey, askCoraResources } from '../services/claudeApi'
import { audioConversations } from '../data/audioConversations'

/* ─── DATA ────────────────────────────────────────────────────────── */

const categories = [
  {
    icon: '💬', gradient: 'from-pink-500 to-rose-500',
    title: 'De-escalate Rude Customers',
    desc: 'Turn hostility into conversation with proven techniques',
    prompt: 'How do I handle a customer who is being rude or disrespectful?',
  },
  {
    icon: '💭', gradient: 'from-orange-400 to-amber-500',
    title: 'What to Say (Examples)',
    desc: 'Exact scripts and phrases ready to use right now',
    prompt: 'Give me examples of what to say to a frustrated or difficult customer.',
  },
  {
    icon: '✏️', gradient: 'from-yellow-400 to-lime-500',
    title: 'Objections & Pushback',
    desc: 'Handle resistance without losing control of the call',
    prompt: 'How do I handle customer objections and pushback effectively?',
  },
  {
    icon: '📞', gradient: 'from-sky-400 to-blue-600',
    title: 'Call Flow & Best Practices',
    desc: 'Structure any difficult call from open to close',
    prompt: 'What are best practices for managing the flow of a difficult call?',
  },
  {
    icon: '🧠', gradient: 'from-teal-400 to-emerald-500',
    title: 'Emotional Control & Mindset',
    desc: 'Stay calm, focused, and confident under pressure',
    prompt: 'How do I stay calm and in control emotionally on a tough call?',
  },
  {
    icon: '🛡️', gradient: 'from-violet-500 to-purple-600',
    title: 'Policies & Escalations',
    desc: 'Know your authority and when to involve your market leader',
    prompt: 'What do I need to know about escalating to my market leader?',
  },
]

const allFaqs = [
  {
    q: 'What should I do if a customer is yelling at me?',
    category: 'De-escalation', icon: '😤',
    a: "Lower your own voice and slow your pace — don't match their energy. Let them finish completely, then: \"I hear how frustrated you are, and I want to make sure I get this right for you.\" Silence and a calm tone are your most powerful tools when someone is yelling.",
  },
  {
    q: 'How do I de-escalate an angry customer?',
    category: 'De-escalation', icon: '🔥',
    a: "Use the LAER method: Listen fully (no interrupting), Acknowledge their frustration, Empathize genuinely (\"I'd feel the same way\"), then Respond with a concrete next step. The order matters — jumping to solutions before acknowledging almost always makes things worse.",
  },
  {
    q: 'What are good things to say to a frustrated customer?',
    category: 'Scripts', icon: '💬',
    a: "\"I completely understand why you're upset.\" / \"That's not the experience we want you to have.\" / \"Here's what I can do right now...\" / \"I'm going to personally make sure this gets resolved.\" Avoid \"I understand\" before they finish — it signals you stopped listening.",
  },
  {
    q: 'How do I set limits without losing the sale?',
    category: 'De-escalation', icon: '⚖️',
    a: "Stay warm but firm. \"I want to help you find a solution, and I also need us to be able to have that conversation\" — said calmly and without apology — communicates limits without escalating. Offering a choice also restores the customer's sense of control.",
  },
  {
    q: 'When and how should I involve my market leader?',
    category: 'Escalation', icon: '👔',
    a: "Involve your market leader when: (1) a customer specifically asks for a manager and you've tried to resolve it, (2) the issue is outside your authority, or (3) the call turns abusive. Important: market leaders can't join calls or take live transfers. Commit to a callback with a specific time. Always brief your market leader fully before they reach out.",
  },
  {
    q: 'What do I do if a customer threatens legal action?',
    category: 'Escalation', icon: '⚖️',
    a: "Stay calm — do not get defensive or apologetic in a way that implies fault. Say: \"I understand you feel strongly about this, and I want to make sure your concern is fully documented.\" Note it in the account, avoid making promises, and escalate to your market leader immediately after the call.",
  },
  {
    q: 'How do I handle a customer using profanity or being abusive?',
    category: 'De-escalation', icon: '🚫',
    a: "Name it calmly the first time: \"I want to help you, and I need us to be able to have this conversation — can we keep the language professional?\" If it continues: \"I'm going to need to pause our call if the language continues. I genuinely want to resolve this for you.\" Document everything.",
  },
  {
    q: 'What if I made a mistake on the account? How do I handle it?',
    category: 'Scripts', icon: '🙏',
    a: "Own it clearly and early: \"I owe you an apology — that error was on our end and I'm going to fix it right now.\" Trying to minimize or explain away a mistake almost always makes it worse. State what you're doing to correct it, give a specific timeline, and then follow through.",
  },
  {
    q: 'What do I do when a customer keeps interrupting me?',
    category: 'De-escalation', icon: '✋',
    a: "Try the pause-and-acknowledge move: wait for a natural break, then say \"I want to make sure I capture everything you're telling me — can I take a quick note?\" If it continues: \"I want to hear everything — let me finish this one point and then you have the floor.\"",
  },
  {
    q: 'How do I handle a customer who is upset and crying?',
    category: 'Mindset', icon: '😢',
    a: "Slow everything down. Don't rush past the emotion to get to the solution. \"Take your time — I'm here.\" Give them space to collect themselves without filling the silence. Once they've steadied, reflect: \"It sounds like this situation has been really stressful.\" Empathy before efficiency — always.",
  },
  {
    q: 'What if a customer demands something I genuinely cannot do?',
    category: 'Scripts', icon: '🚧',
    a: "Never say \"there's nothing I can do\" — say what you CAN do instead. \"What I'm not able to do is [X], but here's what I can do right now: [Y].\" If there's truly nothing in your power: \"This is outside what I'm authorized to do on my own, but I can make sure it gets in front of someone who can make that call — and I'll follow up personally.\"",
  },
  {
    q: 'How do I stay mentally fresh after back-to-back difficult calls?',
    category: 'Mindset', icon: '🧠',
    a: "Give yourself a 60-second reset between calls: slow breath, stretch, remind yourself the next customer starts fresh. Difficult calls are a skill, not a personality attack. Keep a mental 'win file' — what worked today?",
  },
  {
    q: 'What should I never say to an upset customer?',
    category: 'Scripts', icon: '🚫',
    a: "\"Calm down\" (invalidates their emotion), \"That's our policy\" (sounds like 'tough luck'), \"There's nothing I can do\" (almost never true), \"I understand\" before they finish (signals you stopped listening), \"You'll have to speak to someone else\" without a clear path forward.",
  },
  {
    q: 'How do I handle a customer who has been passed around before?',
    category: 'Scripts', icon: '🔄',
    a: "Acknowledge it immediately: \"I can see you've already spoken to a few people about this, and I'm sorry you've had to repeat yourself. I have your full history in front of me — you won't have to start over.\" Then actually own it end-to-end.",
  },
  {
    q: 'What do I do if a customer threatens to record the call?',
    category: 'Policies', icon: '📱',
    a: "Don't panic — calls to insurance agents are typically recorded on the company side already. Say calmly: \"That's absolutely fine. I just want to make sure I'm helping you as best I can.\" A customer who wants to record usually feels unheard — your calm response often defuses that immediately.",
  },
]

const resourceContent = [
  {
    type: 'VIDEO', typeColor: 'text-red-500', icon: '▶️',
    gradient: 'from-red-500 to-rose-600',
    title: 'Handling Angry Customers: Real Techniques', meta: '~10 min · YouTube',
    videoUrl: 'https://www.youtube.com/embed/1e7OH-veEUY',
  },
  {
    type: 'GUIDE', typeColor: 'text-blue-600', icon: '📖',
    gradient: 'from-blue-500 to-indigo-600',
    title: 'De-escalation Playbook', meta: '6-phase reference guide',
    content: [
      { heading: 'Phase 1: PAUSE — Before you say a word', body: "Give yourself 1–2 seconds after they finish. This is not hesitation — it's the most powerful signal you can send. A pause says 'I heard every word.' On insurance calls, anger is almost always fear in disguise: fear about money, about being let down, about a process that feels outside their control. Remember that before your first word." },
      { heading: 'Phase 2: RECEIVE — Let them finish completely', body: "Don't interrupt. Don't start explaining the rate increase, the denial, or the delay — not yet. Let them get it all out. Then ask: 'Is there anything else I should know about your situation?' Most customers have a second layer they haven't said. Getting it out early is worth the 60 seconds." },
      { heading: 'Phase 3: ACKNOWLEDGE — Reflect before you respond', body: "Repeat back what you heard before offering any solution. 'So what I'm hearing is...' / 'It sounds like the main issue is...' In insurance, this matters: customers often say 'denied' when they mean 'delayed,' or 'cancelled' when they mean 'lapsed.' Getting this right means you solve the real problem, not the assumed one." },
      { heading: 'Phase 4: EMPATHIZE — Name the emotion, not just the situation', body: "'I'd feel the same way.' / 'That's genuinely frustrating.' / 'I hear how stressful this has been.' Empathy before solutions — always. A customer who feels heard will work with you. One who doesn't will dig in. Claims calls especially often involve real financial fear or crisis. Honor that before anything else." },
      { heading: 'Phase 5: RESPOND — Lead with what you can do', body: "Only now do you problem-solve. Start with what you CAN do — never open with what you can't. 'What I can do right now is...' Be specific: a concrete date or next step is worth ten reassuring sentences. If something is outside your authority, name what you're actively doing to move it forward." },
      { heading: 'Phase 6: CONFIRM & CLOSE — Lock it in', body: "Repeat the resolution clearly. Confirm they understand who does what and by when. Ask: 'Is there anything else I can clarify before we wrap up?' End with something human — not just a script close. A customer who ends a hard call feeling respected is far more likely to stay." },
      { heading: "Critical DON'Ts", body: "❌ \"Calm down\" — tells them their reaction is wrong\n❌ \"That's our policy\" — sounds like 'tough luck, not my problem'\n❌ \"There's nothing I can do\" — almost never true, and closes the door immediately\n❌ Jumping to solutions before Phases 1–4 — the most common and costly mistake\n❌ Explaining a rate change before acknowledging the customer's reaction\n❌ Promising timelines or outcomes you aren't certain you can deliver\n❌ \"Someone will call you back\" without a specific time and your name attached\n❌ \"I understand\" before they finish — signals you stopped listening" },
    ],
  },
  {
    type: 'TOOL', typeColor: 'text-teal-600', icon: '🛠️',
    gradient: 'from-teal-500 to-emerald-500',
    title: 'Calm & Confident Phrases', meta: '15 ready-to-use phrases',
    phrases: [
      { situation: "When they're yelling", phrase: '"I hear how frustrated you are, and I want to make sure I get this right for you."', why: "Lower your voice as you say this — don't match their energy. The contrast in tone is itself a de-escalation move." },
      { situation: "Shocked by a rate increase", phrase: '"I completely understand why this caught you off guard — a change that size deserves a full explanation. Let me pull up your policy and walk you through exactly what drove it."', why: "Acknowledges the surprise before any defense. Customers accept increases far more easily when they feel informed, not ambushed." },
      { situation: "After a claim denial", phrase: '"I know this isn\'t the answer you were hoping for. You have the right to a full explanation of the decision — and the right to request a formal review. I want to make sure you know both options."', why: "Reframes 'no' as a starting point, not an ending. Knowing they have options restores agency and dramatically reduces escalation." },
      { situation: "To acknowledge the issue", phrase: '"That\'s not the experience we want you to have, and I\'m sorry it happened."', why: "Takes ownership without admitting legal fault. Short and direct — don't add qualifiers or 'but' after this line." },
      { situation: "To buy time while you check", phrase: '"I want to make sure I fully understand before I respond — let me pull up your full account right now."', why: "Gives you 30–60 seconds and signals you're taking it seriously. Never guess when you can look it up." },
      { situation: "Transferred multiple times", phrase: '"I can see you\'ve already spoken with several people, and I\'m sorry you\'ve had to repeat yourself. I\'m reading your full history right now — you won\'t have to start over with me."', why: "Reading their notes while saying this proves you mean it. Customers bounced around need ownership first, solutions second." },
      { situation: "In crisis after a major loss", phrase: '"I\'m so sorry you\'re dealing with this. Let\'s slow down — there\'s no rush. Walk me through what happened and I\'ll take it from there."', why: "In genuine crisis calls, efficiency is the wrong instinct. Slowness communicates that the person matters more than the process." },
      { situation: "To set limits firmly", phrase: '"I want to help you resolve this, and I also need us to be able to have that conversation."', why: "Sets a boundary without confrontation. Say it calmly and without apology — that's what makes it land." },
      { situation: "On market leader requests", phrase: '"I can\'t bring my market leader onto the call, but I can commit to having them call you back by [specific time] — and I\'ll brief them myself so you don\'t have to repeat your story."', why: "Honest about the process. The personal briefing commitment is the part that actually builds trust." },
      { situation: "When they feel uncovered for something", phrase: '"I hear you, and I want to understand the full picture before we talk about what\'s covered — can you walk me through exactly what happened?"', why: "Gets the facts before the coverage conversation. Jumping to policy language before you understand the situation creates a second argument on top of the first." },
      { situation: "To offer control", phrase: '"Here\'s what I can do — would you prefer [option A] or [option B]?"', why: "Restoring choice defuses the powerlessness behind most anger. Even a small choice changes the dynamic." },
      { situation: "When they threaten to cancel", phrase: '"You\'ve been with us a long time, and that matters to me. Before you make a decision, I\'d like to understand what\'s actually driving this."', why: "Leads with the relationship. Doesn't panic or immediately counter-offer. Asking what they want often resolves the threat entirely." },
      { situation: "When they threaten legal action", phrase: '"I understand you feel strongly about this, and I want to make sure your concern is fully documented and gets in front of the right people."', why: "Calm and non-defensive. 'Documented' signals accountability without admitting fault. Your composure here is the whole ballgame." },
      { situation: "After making a mistake", phrase: '"I owe you an apology — that was an error on our end, and here\'s exactly what I\'m doing to fix it right now."', why: "Own it clearly and without qualification. Customers forgive honest mistakes. They don't forgive evasiveness." },
      { situation: "To close strong", phrase: '"I want to make sure you feel good about where we\'ve landed. Is there anything else I can clarify before we wrap up?"', why: "Confirms resolution without rushing to end the call. 'Clarify' is softer than 'do you have questions' — invites rather than challenges." },
    ],
  },
  {
    type: 'TRANSCRIPT', typeColor: 'text-orange-500', icon: '📋',
    gradient: 'from-orange-400 to-rose-500',
    title: 'Real Call Examples: Good vs. Better', meta: '5 insurance call scenarios',
    examples: [
      {
        scenario: 'Rate increase — customer blindsided by a 30% jump at renewal',
        bad: { label: '❌ What makes it worse', lines: [
          { speaker: 'Customer', text: "My premium went up 30% and nobody told me. This is completely unacceptable." },
          { speaker: 'Agent', text: "Ma'am, rates increase every year — that's standard practice. The renewal notice was mailed in March, so you should have received it." },
        ]},
        good: { label: '✅ Better approach', lines: [
          { speaker: 'Customer', text: "My premium went up 30% and nobody told me. This is completely unacceptable." },
          { speaker: 'Agent', text: "I completely understand why this caught you off guard — a change that size deserves a real explanation, not a letter. Let me pull up your policy right now and walk you through exactly what drove the increase and what your options are from here." },
        ]},
        lesson: "Defending the process before acknowledging the experience reads as 'not my problem.' Lead with the impact, not the explanation. The explanation lands much better once they feel heard.",
      },
      {
        scenario: 'Claim denied — 10-year customer, unexpected coverage gap',
        bad: { label: '❌ What makes it worse', lines: [
          { speaker: 'Customer', text: "You denied my claim? I've been paying premiums for 10 years and this is how you treat me?" },
          { speaker: 'Agent', text: "I understand, but based on your policy terms, this type of damage isn't covered under your plan. It's outlined in your policy documents." },
        ]},
        good: { label: '✅ Better approach', lines: [
          { speaker: 'Customer', text: "You denied my claim? I've been paying premiums for 10 years and this is how you treat me?" },
          { speaker: 'Agent', text: "I hear you — and 10 years with us means something. You deserve a full explanation, not just a letter. Let me walk you through the specific reason — and importantly, I want to make sure you know about your right to request a formal review." },
        ]},
        lesson: "'You have the right to a review' is one of the most powerful phrases in a denial call. It shifts the customer from powerless to having options — and they often calm down just from hearing it.",
      },
      {
        scenario: 'Customer demanding a supervisor immediately',
        bad: { label: '❌ What makes it worse', lines: [
          { speaker: 'Customer', text: "I want your supervisor right now. You people are completely useless." },
          { speaker: 'Agent', text: "I'm sorry, my supervisor isn't available right now. I'll have someone call you back." },
        ]},
        good: { label: '✅ Better approach', lines: [
          { speaker: 'Customer', text: "I want your supervisor right now. You people are completely useless." },
          { speaker: 'Agent', text: "I hear you. My market leader can't join the call, but I can commit to having them call you back at a specific time — and I'll brief them fully so you don't have to repeat yourself. But before I do that — what outcome would actually make this right for you?" },
        ]},
        lesson: "Most supervisor requests are a signal the customer doesn't believe the agent can help — not a genuine demand for management. Asking what they actually want often resolves it entirely, without an escalation.",
      },
      {
        scenario: 'Customer calling in crisis after a total loss accident',
        bad: { label: '❌ What makes it worse', lines: [
          { speaker: 'Customer', text: "My car is totaled. I don't know what to do. I've been on hold for 45 minutes." },
          { speaker: 'Agent', text: "I'm sorry for the wait. I'll need your policy number, the accident date, the police report number, and the other driver's information." },
        ]},
        good: { label: '✅ Better approach', lines: [
          { speaker: 'Customer', text: "My car is totaled. I don't know what to do. I've been on hold for 45 minutes." },
          { speaker: 'Agent', text: "I'm so sorry — both that this happened and that you had to wait that long. Let's slow down. Are you safe right now? Good. I'm going to walk you through every step from here — you don't have to figure anything out on your own. I'm pulling up your policy now." },
        ]},
        lesson: "In crisis calls, efficiency is the wrong instinct. 'Are you safe?' and 'you don't have to figure anything out' communicate that you're a person, not a process. Customers remember how you made them feel far longer than what you did.",
      },
      {
        scenario: 'Customer who has been transferred four times without resolution',
        bad: { label: '❌ What makes it worse', lines: [
          { speaker: 'Customer', text: "I've talked to four different people and not one of them has helped me. I'm done." },
          { speaker: 'Agent', text: "I apologize for that. Can I get your policy number? I'll need to transfer you to the claims department — they handle this type of request." },
        ]},
        good: { label: '✅ Better approach', lines: [
          { speaker: 'Customer', text: "I've talked to four different people and not one of them has helped me. I'm done." },
          { speaker: 'Agent', text: "Four times — I completely understand why you're done. I'm reading your full history right now so you don't have to repeat a word of it. I'm going to own this call end to end. If I need to loop someone else in, I'll do it in the background and come back to you directly. You will not be transferred again." },
        ]},
        lesson: "'You will not be transferred again' is powerful precisely because it's rare. Only say it if you mean it — and then mean it. Reading their notes before you respond proves you already started.",
      },
    ],
  },
  {
    type: 'CHECKLIST', typeColor: 'text-purple-600', icon: '✅',
    gradient: 'from-violet-500 to-purple-600',
    title: 'Difficult Call Prep Checklist', meta: 'Run through before every tough call',
    items: [
      'Policy summary, effective dates, and any recent changes are pulled up',
      'Open claims and their current status are visible',
      'Billing history and any payment flags are noted',
      "I've read any previous escalation notes or market leader contacts for this customer",
      "I know if this customer has had a prior denial, dispute, or complaint",
      'I know my authority limits for this type of call before I answer',
      "I'm clear on the escalation path: market leader callback, not a live transfer",
      'I have the formal appeals and review process ready to explain if needed',
      'All notifications are silenced — no distractions for the next call',
      "I've taken a full breath and reset from whatever just happened before this",
      "I remember: their anger is about the situation, not me personally",
      "I'm ready to listen completely — not just wait for a pause to start talking",
      "I will not say 'calm down,' 'that's our policy,' or 'there's nothing I can do'",
      "I will not promise timelines or outcomes I'm not certain I can deliver",
      "I'm prepared to own any error immediately, clearly, and without qualifying it",
    ],
  },
]

const quickChips = [
  "My customer is furious about their rate increase",
  "They're threatening to cancel their policy",
  "The claim was denied and they're escalating",
  "Give me an exact phrase to use right now",
]

function getCoraResponse(text) {
  const lower = text.toLowerCase()
  if (lower.includes('interrupt')) return "Try the pause-and-acknowledge move. Wait for a natural break, then say: \"I want to make sure I capture everything you're telling me — can I take a quick note?\" This validates them and naturally resets the pace. If it continues: \"I want to hear everything — let me finish this one point and then you have the floor.\""
  if (lower.includes('cancel') || lower.includes('switch') || lower.includes('leaving')) return "Don't panic — a cancellation threat is usually a signal they feel unheard, not a final decision. Lead with: \"You've been with us a long time, and that means something to me. Before you decide, can I understand what's driving this?\" Then listen before you counter."
  if (lower.includes('manager') || lower.includes('supervisor') || lower.includes('market leader') || lower.includes('escalat')) return "Market leaders can't join calls or take live transfers. Be honest: \"I can't bring my market leader onto the call right now, but I can have them call you back at a specific time.\" Commit to briefing your market leader yourself so the customer doesn't have to repeat their story."
  if (lower.includes('legal') || lower.includes('lawyer') || lower.includes('sue')) return "Stay calm and don't get defensive. Say: \"I understand you feel strongly about this, and I want to make sure your concern is fully documented.\" Note it in the account, avoid making promises, and escalate to your market leader after the call."
  if (lower.includes('profan') || lower.includes('curse') || lower.includes('abusive') || lower.includes('swear')) return "Name it calmly the first time: \"I want to help you, and I need us to be able to have this conversation — can we keep the language professional?\" If it continues: \"I'm going to need to pause our call if the language continues. I genuinely want to resolve this for you.\""
  if (lower.includes('cry') || lower.includes('crying') || lower.includes('upset') && lower.includes('emotional')) return "Slow everything down. Don't rush past the emotion to get to the solution. \"Take your time — I'm here.\" Give them space without filling the silence. Once they've steadied: \"It sounds like this situation has been really stressful.\" Empathy before efficiency — always."
  if (lower.includes('mistake') || lower.includes('error')) return "Own it clearly and early: \"I owe you an apology — that error was on our end and I'm going to fix it right now.\" Trying to minimize or explain it away almost always makes it worse. State what you're doing to correct it, give a specific timeline, and follow through."
  if (lower.includes('yell') || lower.includes('shout') || lower.includes('rude') || lower.includes('disrespect')) return "Lower your own voice — don't match theirs. Let them finish completely. Then: \"I hear how frustrated you are. I want to get this right for you.\" A calm pace is the single most effective de-escalation tool you have."
  if (lower.includes('what to say') || lower.includes('example') || lower.includes('phrase') || lower.includes('script')) return "Some go-to phrases: \"I completely understand why you're upset.\" / \"That's not the experience we want you to have.\" / \"Here's what I can do right now...\" / \"I'm going to personally make sure this gets resolved.\""
  if (lower.includes('objection') || lower.includes('pushback')) return "When a customer pushes back, resist the urge to defend. Instead, ask: \"Help me understand what your main concern is.\" Most objections are really about trust or a past experience — once you know which, you can actually address it."
  if (lower.includes('claim') || lower.includes('denied')) return "For a denied claim: acknowledge first, explain second. \"I can hear how upsetting this is, and you deserve a clear explanation.\" Then walk through the specific reason and, critically, tell them about their right to appeal — that's often the thing that turns the call around."
  if (lower.includes('calm') || lower.includes('mindset') || lower.includes('stress')) return "The most effective mindset shift: their anger is about the situation, not you personally. The moment you take it personally, your voice tightens and they feel it. Take a slow breath before you respond — 1–2 seconds of silence after they finish reads as 'I heard you.'"
  if (lower.includes('policy') || lower.includes('authority')) return "Know your authority limits before the call. When something is outside your authority, say what you CAN do first: \"What I can do right now is [X]. For [Y], I'll need my market leader to follow up — I'll brief them fully so you don't have to repeat yourself.\""
  return "Great question. My top advice: let them finish before you respond — even if you already know the answer. A 2-second pause after they stop speaking communicates that you genuinely heard them. It's the simplest thing that makes the biggest difference."
}

/* ─── SEARCH ─────────────────────────────────────────────────────── */

const SYNONYMS = [
  ['angry', 'yell', 'shout', 'scream', 'hostile', 'rude', 'upset', 'frustrat'],
  ['cancel', 'switch', 'leav', 'competi', 'done with'],
  ['manager', 'supervisor', 'market leader', 'escalat', 'boss'],
  ['script', 'say', 'phrase', 'word', 'example', 'tell them'],
  ['bill', 'premium', 'charge', 'payment', 'rate', 'price'],
  ['claim', 'denied', 'coverage', 'reject'],
  ['legal', 'lawyer', 'sue', 'attorney', 'record'],
  ['calm', 'mindset', 'stress', 'burnout', 'mental', 'emotional'],
  ['interrupt', 'talk over', 'wont let me'],
  ['mistake', 'error', 'wrong', 'my fault'],
  ['profan', 'curse', 'swear', 'abusive', 'language'],
  ['cry', 'emotional', 'sob', 'upset'],
]

const ALL_SEARCHABLE = [
  ...allFaqs.map((f, i) => ({ type: 'faq', title: f.q, sub: f.category, body: f.a, icon: f.icon, idx: i })),
  ...resourceContent.map((r, i) => ({ type: 'resource', title: r.title, sub: r.type, body: '', idx: i })),
  ...categories.map((c, i) => ({ type: 'category', title: c.title, sub: 'Topic', body: c.desc, idx: i })),
]

function searchItems(query) {
  const q = query.toLowerCase().trim()
  if (!q) return []
  const group = SYNONYMS.find(g => g.some(s => q.includes(s) || s.includes(q))) || []
  const terms = [...new Set([q, ...group])]
  const scored = ALL_SEARCHABLE.map(item => {
    const t = item.title.toLowerCase()
    const b = (item.body || '').toLowerCase()
    const s = (item.sub || '').toLowerCase()
    let score = 0
    for (const term of terms) {
      if (t.includes(term)) score += 4
      else if (b.includes(term)) score += 2
      else if (s.includes(term)) score += 1
    }
    return { ...item, score }
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score)
  return scored.slice(0, 6)
}

/* ─── SUBCOMPONENTS ──────────────────────────────────────────────── */

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2.5">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-3)', animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }} />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </div>
  )
}

function ChecklistResource({ items }) {
  const [checked, setChecked] = useState(() => new Array(items.length).fill(false))
  const done = checked.filter(Boolean).length
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>{done}/{items.length} ready</div>
          <div className="h-2 w-32 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div className="h-full bg-[#6B4EF3] rounded-full transition-all" style={{ width: `${(done / items.length) * 100}%` }} />
          </div>
        </div>
        <button onClick={() => setChecked(new Array(items.length).fill(false))}
          className="text-xs hover:underline" style={{ color: 'var(--text-3)' }}>Reset</button>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <button key={i} onClick={() => setChecked(p => { const n = [...p]; n[i] = !n[i]; return n })}
            className="w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all"
            style={{ background: checked[i] ? 'rgba(16,185,129,0.10)' : 'var(--bg)', border: `1.5px solid ${checked[i] ? 'rgba(16,185,129,0.30)' : 'var(--border)'}` }}>
            <span className="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors"
              style={{ background: checked[i] ? '#10B981' : 'transparent', borderColor: checked[i] ? '#10B981' : 'var(--border)', color: 'white' }}>
              {checked[i] && <span className="text-[10px] font-bold">✓</span>}
            </span>
            <span className="text-sm leading-snug" style={{ color: checked[i] ? 'var(--text-3)' : 'var(--text)', textDecoration: checked[i] ? 'line-through' : 'none' }}>{item}</span>
          </button>
        ))}
      </div>
      {done === items.length && (
        <div className="mt-4 rounded-xl p-4 text-center" style={{ background: 'rgba(16,185,129,0.10)', border: '1.5px solid rgba(16,185,129,0.25)' }}>
          <p className="text-sm font-bold" style={{ color: '#10B981' }}>You're ready. Go take care of that customer.</p>
        </div>
      )}
    </div>
  )
}

function ResourceModal({ resource, onClose }) {
  if (!resource) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
        style={{ background: 'var(--card)' }} onClick={e => e.stopPropagation()}>
        {/* Gradient header */}
        <div className={`bg-gradient-to-r ${resource.gradient} px-6 py-5 flex items-start justify-between shrink-0`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">{resource.icon}</div>
            <div>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{resource.type}</p>
              <h2 className="text-white font-bold text-lg leading-tight">{resource.title}</h2>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none ml-4 shrink-0 mt-0.5">×</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {/* VIDEO resource */}
          {resource.videoUrl && (
            <div className="rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <iframe src={resource.videoUrl} className="w-full h-full" style={{ minHeight: 300 }}
                allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          )}
          {resource.content && resource.content.map((s, i) => (
            <div key={i} className="mb-5 last:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-[#6B4EF3] text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{s.heading}</h3>
              </div>
              <p className="text-sm leading-relaxed pl-8 whitespace-pre-line" style={{ color: 'var(--text-2)' }}>{s.body}</p>
            </div>
          ))}
          {resource.phrases && (
            <div className="space-y-3">
              {resource.phrases.map((p, i) => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ border: '1.5px solid var(--border)' }}>
                  <div className="px-4 py-2" style={{ background: 'rgba(123,63,242,0.12)' }}>
                    <p className="text-xs font-bold text-[#6B4EF3] uppercase tracking-wide">{p.situation}</p>
                  </div>
                  <div className="px-4 py-3" style={{ background: 'var(--bg)' }}>
                    <p className="text-sm font-medium italic mb-1.5" style={{ color: 'var(--text)' }}>{p.phrase}</p>
                    <p className="text-xs" style={{ color: 'var(--text-2)' }}>{p.why}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {resource.examples && resource.examples.map((ex, i) => (
            <div key={i} className={i > 0 ? 'mt-8 pt-8' : ''} style={i > 0 ? { borderTop: '1px solid var(--border)' } : {}}>
              <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-3)' }}>Scenario: {ex.scenario}</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {[ex.bad, ex.good].map((side, j) => (
                  <div key={j} className="rounded-xl p-4"
                    style={{ background: j === 0 ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)', border: `1px solid ${j === 0 ? 'rgba(239,68,68,0.20)' : 'rgba(16,185,129,0.20)'}` }}>
                    <p className="text-xs font-bold mb-3" style={{ color: j === 0 ? '#ef4444' : '#10b981' }}>{side.label}</p>
                    <div className="space-y-2">
                      {side.lines.map((line, k) => (
                        <p key={k} className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                          <span className="font-bold" style={{ color: line.speaker === 'Agent' ? (j === 0 ? '#ef4444' : '#10b981') : 'var(--text-3)' }}>{line.speaker}: </span>
                          {line.text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(123,63,242,0.12)' }}>
                <p className="text-xs font-bold text-[#6B4EF3] mb-1">Key Lesson</p>
                <p className="text-xs" style={{ color: 'var(--text)' }}>{ex.lesson}</p>
              </div>
            </div>
          ))}
          {resource.items && <ChecklistResource items={resource.items} />}
        </div>
      </div>
    </div>
  )
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────────── */

export default function HelpCenter() {
  const { dark } = useTheme()
  const [openFaq, setOpenFaq] = useState(null)
  const [showAllFaqs, setShowAllFaqs] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [streamingReply, setStreamingReply] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchPanel, setSearchPanel] = useState(null)
  const [openResource, setOpenResource] = useState(null)

  const chatEndRef = useRef(null)
  const chatRef = useRef(null)

  const visibleFaqs = showAllFaqs ? allFaqs : allFaqs.slice(0, 5)
  const searchResults = useMemo(() => searchItems(searchQuery), [searchQuery])

  useEffect(() => {
    const target = sessionStorage.getItem('help_scroll_to')
    if (target) {
      sessionStorage.removeItem('help_scroll_to')
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 120)
    }
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, streamingReply])

  async function send(text) {
    const msg = (text || inputText).trim()
    if (!msg || isTyping) return

    const apiMsgs = [
      { role: 'assistant', content: "I'm here to help you handle tough customers and grow with confidence. What's going on?" },
      ...messages.map(m => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text })),
      { role: 'user', content: msg },
    ]

    setMessages(prev => [...prev, { from: 'user', text: msg }])
    setInputText('')
    setIsTyping(true)
    setStreamingReply('')

    const hasKey = !!getApiKey()
    if (hasKey) {
      try {
        const final = await askCoraResources(apiMsgs, chunk => setStreamingReply(chunk))
        setMessages(prev => [...prev, { from: 'cora', text: final }])
      } catch {
        setMessages(prev => [...prev, { from: 'cora', text: getCoraResponse(msg) }])
      }
    } else {
      await new Promise(resolve => setTimeout(resolve, 900 + Math.random() * 500))
      setMessages(prev => [...prev, { from: 'cora', text: getCoraResponse(msg) }])
    }
    setStreamingReply('')
    setIsTyping(false)
  }

  function handleCategory(cat) {
    send(cat.prompt)
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  function handleSearchClick(r) {
    setSearchQuery('')
    if (r.type === 'faq') {
      setSearchPanel({ type: 'faq', faq: allFaqs[r.idx] })
    } else if (r.type === 'resource') {
      setSearchPanel(null)
      setOpenResource(r.idx)
    } else if (r.type === 'category') {
      setSearchPanel(null)
      handleCategory(categories[r.idx])
    }
  }

  const heroStyle = {
    background: dark
      ? 'linear-gradient(135deg, #12103d 0%, #0d0a2e 100%)'
      : 'linear-gradient(135deg, #EAE7FF 0%, #D4CEFF 100%)',
  }

  const chatRobotStyle = {
    background: dark
      ? 'linear-gradient(180deg, #1a1440 0%, #110e28 100%)'
      : 'linear-gradient(180deg, #EAE7FF 0%, #D8D2FF 100%)',
    border: '1.5px solid var(--border)',
    borderBottom: 'none',
  }

  const bubbleStyle = {
    background: 'var(--card)',
    border: '1px solid var(--border)',
  }

  return (
    <div style={{ background: 'var(--bg)' }}>
      {/* ── Hero ── */}
      <section style={heroStyle} className="px-6 py-10">
        <div className="max-w-7xl mx-auto flex items-center gap-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>Hi, I'm Cora!</h1>
            <p className="text-lg mb-6" style={{ color: 'var(--text-2)' }}>How can I help you today?</p>
            <div className="relative max-w-lg">
              <div className="flex items-center gap-2 rounded-xl border px-4 py-3 shadow-sm"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <span style={{ color: 'var(--text-3)' }}>🔍</span>
                <input
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setSearchPanel(null) }}
                  placeholder="Search topics, scripts, FAQs..."
                  className="flex-1 text-sm outline-none bg-transparent"
                  style={{ color: 'var(--text)' }}
                />
                {(searchQuery || searchPanel) && (
                  <button onClick={() => { setSearchQuery(''); setSearchPanel(null) }}
                    className="text-xl leading-none hover:opacity-60" style={{ color: 'var(--text-3)' }}>×</button>
                )}
              </div>

              {searchQuery && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-2xl z-20 overflow-hidden"
                  style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
                  {searchResults.map((r, i) => (
                    <button key={i} onClick={() => handleSearchClick(r)}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors"
                      style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <span className="text-xl shrink-0">{r.type === 'faq' ? (r.icon || '❓') : r.type === 'resource' ? '📖' : '📂'}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text)' }}>{r.title}</p>
                        {r.type === 'faq' && r.body && (
                          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-3)' }}>{r.body.slice(0, 80)}…</p>
                        )}
                        <p className="text-xs text-[#6B4EF3] font-medium mt-0.5 capitalize">{r.sub}</p>
                      </div>
                      <span style={{ color: 'var(--border)' }}>›</span>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery && searchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl z-20 p-4 text-sm"
                  style={{ background: 'var(--card)', border: '1.5px solid var(--border)', color: 'var(--text-2)' }}>
                  No results — try asking Cora in the chat below!
                </div>
              )}
            </div>

            {searchPanel?.type === 'faq' && (
              <div className="max-w-lg mt-3 rounded-2xl shadow-lg overflow-hidden" style={{ border: '1px solid #6B4EF3' }}>
                <div className="bg-[#6B4EF3] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{searchPanel.faq.icon}</span>
                    <span className="text-white font-semibold text-sm leading-snug">{searchPanel.faq.q}</span>
                  </div>
                  <button onClick={() => setSearchPanel(null)} className="text-white/60 hover:text-white text-xl leading-none ml-3 shrink-0">×</button>
                </div>
                <div className="px-5 py-4" style={{ background: 'var(--card)' }}>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{searchPanel.faq.a}</p>
                  <p className="text-xs text-[#6B4EF3] font-medium mt-3">{searchPanel.faq.category}</p>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 relative">
            <div className="absolute top-2 right-full mr-3 z-10 rounded-2xl rounded-br-none shadow-md px-4 py-3 w-[200px]"
              style={bubbleStyle}>
              <p className="text-xs" style={{ color: 'var(--text)' }}>Ask me anything about handling difficult customers in insurance sales.</p>
            </div>
            <CoraRobot size={170} pose="present" />
          </div>
        </div>

        {/* Category cards */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {categories.map((c, i) => (
            <button key={i} onClick={() => handleCategory(c)}
              className="group relative overflow-hidden rounded-2xl text-left transition-all hover:scale-[1.02] hover:shadow-xl shadow-md">
              <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
              <div className="relative p-5 flex items-start gap-4">
                <span className="text-3xl shrink-0 mt-0.5">{c.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-sm leading-snug mb-1">{c.title}</h3>
                  <p className="text-white/70 text-xs leading-relaxed">{c.desc}</p>
                </div>
              </div>
              <div className="relative px-5 pb-4">
                <span className="text-white/80 text-xs font-medium group-hover:text-white transition-colors">Ask Cora →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── FAQs + Chat ── */}
      <section ref={chatRef} className="px-6 py-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* FAQ accordion */}
          <div className="col-span-2">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Popular Questions</h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>Click any question to expand the answer</p>
              </div>
              <button onClick={() => setShowAllFaqs(v => !v)}
                className="text-sm text-[#6B4EF3] font-medium hover:underline shrink-0">
                {showAllFaqs ? 'Show fewer' : `See all ${allFaqs.length} questions`}
              </button>
            </div>
            <div className="space-y-2">
              {visibleFaqs.map((faq, i) => {
                const isOpen = openFaq === i
                return (
                  <div key={i} className="rounded-xl transition-all"
                    style={{ border: `1.5px solid ${isOpen ? 'rgba(107,78,243,0.40)' : 'var(--border)'}`, background: 'var(--card)' }}>
                    <button onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="w-full flex items-center gap-3 px-4 py-4 text-left">
                      <span className="text-xl shrink-0">{faq.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1"
                          style={{ background: 'rgba(107,78,243,0.12)', color: '#6B4EF3' }}>{faq.category}</span>
                        <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text)' }}>{faq.q}</p>
                      </div>
                      <span className={`text-[#6B4EF3] shrink-0 transition-transform text-sm ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                      <div className="overflow-hidden">
                        <div className="px-4 pb-4 pl-14">
                          <div className="rounded-xl p-4 text-sm leading-relaxed" style={{ background: 'var(--bg)', border: '1px solid rgba(107,78,243,0.12)', color: 'var(--text-2)' }}>
                            {faq.a}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cora Robot + Chat */}
          <div className="flex flex-col">
            <div className="rounded-t-2xl pt-5 pb-0 flex flex-col items-center" style={chatRobotStyle}>
              <CoraRobot size={110} pose="arms" />
            </div>

            {/* Chat */}
            <div className="rounded-b-2xl overflow-hidden flex flex-col shadow-sm" style={{ height: '460px', border: '1.5px solid var(--border)', borderTop: 'none' }}>
              <div className="bg-gradient-to-r from-[#6B4EF3] to-[#8B6EFF] px-4 py-3 flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white">C</div>
                <span className="font-semibold text-sm text-white">Chat with Cora</span>
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-white/70">{getApiKey() ? 'AI Mode' : 'Online'}</span>
                </span>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ background: 'var(--bg)' }}>
                {/* Initial greeting */}
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#6B4EF3] flex items-center justify-center text-xs text-white shrink-0 font-bold">C</div>
                  <div className="rounded-2xl rounded-tl-none px-3 py-2.5 text-xs max-w-[210px] leading-relaxed shadow-sm"
                    style={{ background: 'var(--card)', color: 'var(--text)' }}>
                    I'm here to help you handle tough customers and grow with confidence. What's going on?
                  </div>
                </div>
                {messages.map((m, i) => m.from === 'user' ? (
                  <div key={i} className="flex justify-end">
                    <div className="bg-[#6B4EF3] rounded-2xl rounded-tr-none px-3 py-2.5 text-xs text-white max-w-[210px] leading-relaxed">{m.text}</div>
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#6B4EF3] flex items-center justify-center text-xs text-white shrink-0 font-bold">C</div>
                    <div className="rounded-2xl rounded-tl-none px-3 py-2.5 text-xs max-w-[210px] leading-relaxed shadow-sm"
                      style={{ background: 'var(--card)', color: 'var(--text)' }}>{m.text}</div>
                  </div>
                ))}
                {streamingReply && isTyping && (
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#6B4EF3] flex items-center justify-center text-xs text-white shrink-0 font-bold">C</div>
                    <div className="rounded-2xl rounded-tl-none px-3 py-2.5 text-xs max-w-[210px] leading-relaxed shadow-sm"
                      style={{ background: 'var(--card)', color: 'var(--text)' }}>{streamingReply}</div>
                  </div>
                )}
                {isTyping && !streamingReply && (
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#6B4EF3] flex items-center justify-center text-xs text-white shrink-0 font-bold">C</div>
                    <div className="rounded-2xl rounded-tl-none shadow-sm" style={{ background: 'var(--card)' }}><TypingDots /></div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              {messages.length === 0 && (
                <div className="px-3 py-2.5 space-y-1.5 shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--card)' }}>
                  {quickChips.map((chip, i) => (
                    <button key={i} onClick={() => send(chip)}
                      className="w-full text-left text-xs rounded-lg px-3 py-1.5 transition-all truncate"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-2)', background: 'var(--bg)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#6B4EF3'; e.currentTarget.style.color = '#6B4EF3' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)' }}>
                      {chip}
                    </button>
                  ))}
                </div>
              )}
              <div className="px-3 py-2.5 flex items-center gap-2 shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--card)' }}>
                <input value={inputText} onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Ask Cora anything..."
                  className="flex-1 text-xs outline-none bg-transparent"
                  style={{ color: 'var(--text)' }} />
                <button onClick={() => send()}
                  className="w-7 h-7 bg-[#6B4EF3] hover:bg-[#5A3EE0] rounded-full flex items-center justify-center text-white text-sm transition-colors shrink-0">→</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Top Resources ── */}
      <section className="px-6 py-10" style={{ background: 'var(--card)', borderTop: '1.5px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Top Resources</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>Guides, tools, and references — click any card to open</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {resourceContent.map((r, i) => (
              <button key={i} onClick={() => setOpenResource(i)}
                className="group rounded-2xl overflow-hidden text-left transition-all hover:shadow-lg hover:scale-[1.02]"
                style={{ background: 'var(--bg)', border: '1.5px solid var(--border)' }}>
                <div className={`bg-gradient-to-br ${r.gradient} p-5 flex items-center justify-center`} style={{ height: 80 }}>
                  <span className="text-4xl group-hover:scale-110 transition-transform">{r.icon}</span>
                </div>
                <div className="p-4">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${r.typeColor}`}>{r.type}</p>
                  <h3 className="text-xs font-bold leading-snug mb-2" style={{ color: 'var(--text)' }}>{r.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>{r.meta}</p>
                  <p className="text-xs text-[#6B4EF3] font-semibold mt-3 group-hover:underline">Open →</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Listen & Learn ── */}
      <section id="listen-learn" className="px-6 py-10" style={{ background: 'var(--bg)', borderTop: '1.5px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-6 gap-4">
            <div>
              <h2 className="font-bold text-lg" style={{ color: 'var(--text)' }}>Listen & Learn</h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-3)' }}>
                AI-voiced calls showing de-escalation in real time. Follow the transcript as you listen.
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
              style={{ background: 'rgba(107,78,243,0.12)', color: '#6B4EF3', border: '1px solid rgba(107,78,243,0.20)' }}>
              AI Voices
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audioConversations.map(conv => (
              <ConversationPlayer key={conv.id} conversation={conv} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 py-4" style={{ background: 'var(--bg)', borderTop: '1.5px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs" style={{ color: 'var(--text-3)' }}>
          <span>Still need help? Ask Cora in the chat above, or schedule time with your market leader.</span>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>

      {openResource !== null && (
        <ResourceModal resource={resourceContent[openResource]} onClose={() => setOpenResource(null)} />
      )}
    </div>
  )
}
