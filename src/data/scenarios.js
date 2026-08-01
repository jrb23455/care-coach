export const scenarios = [
  {
    id: 1,
    title: "Claim Denied",
    category: "Claims",
    icon: "❌",
    severity: "high",
    customerScript: "I cannot believe you denied my claim! I've been paying premiums for 10 years and now when I actually need you, you turn your back on me. This is absolutely ridiculous and I want answers RIGHT NOW.",
    triggerPhrases: ["denied my claim", "won't pay", "not covered", "rejected"],
    donts: ["Don't say 'That's our policy'", "Don't interrupt", "Don't be defensive", "Don't promise what you can't deliver"],
    responses: [
      {
        label: "Open with empathy",
        script: "I completely understand how upsetting this is, especially after being a loyal customer for so long. You deserve a clear explanation, and I want to make sure you get one. Can I take a moment to pull up your claim so we can go through it together?",
        why: "Validates their frustration before jumping to explanations. Slows the emotional temperature."
      },
      {
        label: "If they push for an immediate answer",
        script: "You're right to want answers, and I'm not going to give you the runaround. Here's what I can tell you right now: [reason from file]. I also want to make sure you know you have the right to appeal this decision, and I can walk you through exactly how to do that.",
        why: "Gives them something concrete. Offering the appeal path shows you're on their side."
      },
      {
        label: "If they threaten to cancel",
        script: "I hear you, and that's absolutely your right. Before you make that decision, I'd really like to make sure you have all the information — including whether there's anything we can do on our end. Would you be willing to give me five minutes?",
        why: "Buys time without being dismissive. Keeps the door open."
      }
    ],
    escalationPath: "If the customer remains unsatisfied after explaining the denial reason and appeal process, commit to looping in your market leader — brief them fully before they call the customer back, so the customer doesn't have to repeat the story.",
    quickTip: "Never say 'I understand' without first letting them finish. Premature empathy feels fake."
  },
  {
    id: 2,
    title: "Premium Increase",
    category: "Billing",
    icon: "💸",
    severity: "medium",
    customerScript: "My payment went up $80 a month and nobody told me! I open my bill and it's a completely different number. How is this even legal? I feel like you're just stealing from me at this point.",
    triggerPhrases: ["premium went up", "bill is higher", "rate increase", "didn't notify me"],
    donts: ["Don't say 'Rates go up every year'", "Don't minimize the dollar amount", "Don't read from a script robotically"],
    responses: [
      {
        label: "Open with empathy + ownership",
        script: "I'm really sorry you were caught off guard by this — that's a frustrating experience and you deserved advance notice. Let me look at your account right now and walk you through exactly why this changed and when it was communicated.",
        why: "Takes responsibility for the communication gap without admitting illegal conduct."
      },
      {
        label: "After explaining the reason",
        script: "So the increase is due to [reason — e.g. state rate adjustment / claims history / coverage change]. I know $80 is not a small number. What I can do is review your current coverage with you to see if there are any adjustments that could bring your cost down while keeping you protected.",
        why: "Pivots from problem to solution. The coverage review gives them something actionable."
      },
      {
        label: "If they demand a refund or rollback",
        script: "I completely understand why you'd want that. I'm not in a position to reverse a state-filed rate, but what I can do is submit a rate review request and flag your account. I also want to make sure you're aware of [any loyalty discount / payment plan options].",
        why: "Sets honest limits while still offering something of value."
      }
    ],
    escalationPath: "If the customer needs billing support beyond your authority, document everything in notes and connect them to the right team — never a cold handoff. Brief whoever follows up so the customer doesn't restart from scratch.",
    quickTip: "Say the dollar amount back to them. It shows you're listening, not dismissing."
  },
  {
    id: 3,
    title: "Slow Claims Processing",
    category: "Claims",
    icon: "⏳",
    severity: "medium",
    customerScript: "It's been SIX WEEKS. Six weeks and I still haven't seen a dime. I have bills piling up, my car is still sitting at the shop, and every time I call I get a different story. What is going on over there?",
    triggerPhrases: ["waiting weeks", "how long", "still haven't heard", "no update"],
    donts: ["Don't give a new timeline you can't guarantee", "Don't blame 'the system'", "Don't say 'I'll have someone call you back' without booking it"],
    responses: [
      {
        label: "Acknowledge the wait first",
        script: "Six weeks — I hear you, and that is too long. I'm sorry you've had to keep chasing this. I'm pulling up your claim right now, and I'm going to stay on this call with you until I have a real answer, not a runaround.",
        why: "The commitment to stay on the call differentiates you from past experiences they've had."
      },
      {
        label: "After checking the file",
        script: "Okay, I can see your claim is at [stage]. The hold-up is [specific reason]. Here's what happens next: [next step] — that should take [honest timeframe]. I'm going to put a priority flag on this and add a note that you've been waiting since [date].",
        why: "Specificity rebuilds trust. Vague timelines re-trigger anger."
      },
      {
        label: "If no update is available",
        script: "I want to be honest with you: I don't have a definitive update right now, and I'm not going to give you a timeline I can't stand behind. What I will do is personally follow up with the claims team and call you back by [specific time/date]. Is that number the best one to reach you?",
        why: "Honest about limits, but commits to a concrete callback. Never say 'someone will call you'."
      }
    ],
    escalationPath: "Place a priority flag on the claim. Schedule a guaranteed personal callback with a specific time — never 'someone will call you back.' Document it in the file and follow through.",
    quickTip: "Repeat back specific dates and amounts the customer mentions. It proves you listened."
  },
  {
    id: 4,
    title: "Coverage Dispute",
    category: "Coverage",
    icon: "📄",
    severity: "high",
    customerScript: "I bought this policy specifically because I thought it covered flood damage. Now you're telling me it doesn't? I asked your agent specifically about this when I signed up. Someone lied to me.",
    triggerPhrases: ["thought it covered", "wasn't told", "agent said", "misled", "lied"],
    donts: ["Don't throw the original agent under the bus", "Don't say 'It's in your policy documents'", "Don't be defensive about the company"],
    responses: [
      {
        label: "Validate the confusion, don't assign blame",
        script: "I can absolutely see why you understood it that way, and I'm sorry there was a disconnect. Coverage language can be confusing, and it sounds like there may have been a miscommunication somewhere along the way. Can you walk me through what was said when you signed up?",
        why: "Opens an investigation rather than a debate. Avoids blaming the previous agent while gathering facts."
      },
      {
        label: "Explaining the exclusion",
        script: "Here's what your policy covers: [list]. Flood damage specifically requires a separate flood policy — that's actually a federal requirement for most standard policies, not something unique to us. I know that doesn't fix your situation, but I want to make sure the picture is clear.",
        why: "Externalizing the rule (federal requirement) reduces the 'you vs. them' dynamic."
      },
      {
        label: "If they claim agent misrepresentation",
        script: "That's a serious concern and I'm not dismissing it. If our agent told you this was covered and it isn't, that needs to be looked into. I'm going to open a formal review — that means someone from our compliance team will pull any recorded calls or notes from your sign-up. Can I get that started for you?",
        why: "Escalating to a formal review is appropriate here. It protects you, the customer, and the company."
      }
    ],
    escalationPath: "If the customer claims an agent explicitly promised coverage: open a misrepresentation review case and escalate to your market leader. Do not make coverage promises to resolve the call — document everything and let the review process work.",
    quickTip: "Never say 'it's all in your policy documents' — it sounds like 'tough luck, you should've read it.'"
  },
  {
    id: 5,
    title: "Demands to Speak to a Market Leader",
    category: "Escalation",
    icon: "👔",
    severity: "medium",
    customerScript: "I don't want to talk to you anymore. I want your supervisor, your manager, whoever is in charge. You people are useless and I'm done being passed around.",
    triggerPhrases: ["speak to your manager", "want your supervisor", "get me someone in charge", "you can't help me"],
    donts: ["Don't take it personally", "Don't promise a live transfer — market leaders can't join calls", "Don't say 'I'll have someone call you' without committing to a specific time", "Don't oversell what a market leader callback can do"],
    responses: [
      {
        label: "Try to resolve first, honestly",
        script: "I hear you, and I want to get this right. I don't have a way to bring my market leader on the call directly — but I absolutely can have them call you back. Before we go that route, can I ask: what outcome would actually make this right for you? Sometimes I can solve it right here.",
        why: "Honest about the real process. Asking what they actually want often defuses the escalation — they usually want a solution, not a specific person."
      },
      {
        label: "If they still want a market leader",
        script: "Absolutely. My market leader will call you back — I'll personally brief them on everything we talked about so you don't have to repeat yourself. When's the best time to reach you today?",
        why: "Committing to brief the market leader yourself is the key. 'You don't have to repeat yourself' is what customers dread most about escalation."
      },
      {
        label: "If they want someone right now",
        script: "I understand you want to speak with someone right now. I can't get my market leader on the call at this moment, but I can commit to having them call you back within [specific timeframe]. Would [specific time] work?",
        why: "Honest about the limitation while committing to a real time — not 'someone will call you back.'"
      }
    ],
    escalationPath: "When involving your market leader: brief them fully first (customer name, issue, emotional state, what was tried). Never hand off cold. If the customer is in a high-frustration state, flag that in your notes.",
    quickTip: "Don't take 'you're useless' personally. They're frustrated at the situation, not you. And never promise a live supervisor transfer — it sets an expectation you can't meet."
  },
  {
    id: 6,
    title: "Threatening to Cancel / Switch",
    category: "Retention",
    icon: "🚪",
    severity: "high",
    customerScript: "That's it. I'm done. I'm calling [Competitor] first thing tomorrow and canceling everything. I've been a customer for 12 years and this is how you treat people. You just lost a customer.",
    triggerPhrases: ["canceling", "switching to", "done with you", "lost a customer", "going to competitor"],
    donts: ["Don't panic or over-promise", "Don't immediately offer discounts (it rewards threatening)", "Don't argue about the competitor", "Don't let them go without trying"],
    responses: [
      {
        label: "Lead with acknowledgment, not sales",
        script: "I hear you, and after 12 years, you've earned the right to feel that way if we've let you down. I'm not going to try to spin this — I'd like to understand what happened, because if there's something we got wrong, I want to know and I want to see if it's fixable.",
        why: "Starting with 'let me tell you about our features' here is tone-deaf. Lead with the relationship."
      },
      {
        label: "After understanding the issue",
        script: "Based on what you've told me, here's what I think I can do: [specific offer/resolution]. I can't promise this fixes everything, but I can promise I'll make sure this issue is on the record and addressed. Would you be willing to give us the chance to make it right before you decide?",
        why: "Make a specific offer tied to their specific complaint, not a generic discount."
      },
      {
        label: "If they want to cancel regardless",
        script: "I respect that, and I appreciate the 12 years you gave us. Before I process anything, I just want to make sure you have all the information about [any pending claims / refunds owed / coverage gap if they cancel today]. I want this to go smoothly for you.",
        why: "Even in a cancellation, provide value. They may come back. Leave on good terms."
      }
    ],
    escalationPath: "For high-value or long-tenure customers threatening to cancel, loop in your market leader before processing any cancellation — brief them on the tenure, the issue, and what was offered. Document everything.",
    quickTip: "Retention offers work best when they're tied to the customer's specific complaint — not just 'here's 10% off.'"
  },
  {
    id: 7,
    title: "Billing Error / Wrong Charge",
    category: "Billing",
    icon: "🧾",
    severity: "medium",
    customerScript: "You charged my bank account twice this month. TWICE. Do you understand what that does to someone? I had rent due and you overdrafted my account. I want my money back today.",
    triggerPhrases: ["double charged", "wrong amount", "overdraft", "unauthorized charge", "want refund"],
    donts: ["Don't question whether the error really happened", "Don't say 'it takes 7-10 business days' without empathy first", "Don't make them prove it before you investigate"],
    responses: [
      {
        label: "Take ownership immediately",
        script: "I am so sorry — a double charge affecting your bank account is a serious error and I understand the real impact that has. I'm pulling your account up right now. Let me confirm what I'm seeing and we'll figure out how to get this resolved as fast as possible.",
        why: "Don't make them prove it first. Start from a position of believing them."
      },
      {
        label: "After confirming the error",
        script: "I can confirm the duplicate charge. Here's what's going to happen: I'm initiating a reversal right now. Depending on your bank, that typically posts within [1-3 business days]. I'm also flagging your account so we can document this error. Is there anything else this caused — like an overdraft fee — that I should know about?",
        why: "Proactively asking about downstream damage (overdraft fee) shows you care about the full picture."
      },
      {
        label: "Addressing overdraft fees from their bank",
        script: "I want to be upfront: the overdraft fee was charged by your bank, and I can't reverse that directly. However, I can give you a letter documenting our error, which many banks will accept to waive an overdraft fee. Would that help?",
        why: "You can't promise what you can't deliver — but offering the documentation letter is genuinely useful."
      }
    ],
    escalationPath: "For confirmed billing errors, initiate the correction immediately per your authority and document in the account. If overdraft fees are involved, offer a formal error letter. Loop in your market leader if the error caused significant financial harm to the customer.",
    quickTip: "Say 'I can confirm' or 'I don't see that yet, but I believe you and I'm looking' — never 'I don't see a double charge' as your opening."
  }
];

export const techniques = [
  {
    name: "LAER Method",
    icon: "🎯",
    description: "The core de-escalation framework",
    steps: [
      { letter: "L", word: "Listen", detail: "Let them finish. No interrupting, no 'I understand' until they're done." },
      { letter: "A", word: "Acknowledge", detail: "Repeat back the core issue in your own words. 'So what I'm hearing is...'" },
      { letter: "E", word: "Empathize", detail: "Name the emotion. 'That's genuinely frustrating' beats 'I understand.'" },
      { letter: "R", word: "Respond", detail: "Only now give your answer or solution." }
    ]
  },
  {
    name: "Voice Control",
    icon: "🎙️",
    description: "Your tone does more than your words",
    steps: [
      { letter: "↓", word: "Slow down", detail: "Angry customers talk fast. Slow your pace — it's unconsciously calming." },
      { letter: "↓", word: "Lower volume", detail: "Never match their volume. Speak softer than them." },
      { letter: "→", word: "Stay even", detail: "Avoid sounding frustrated, bored, or defensive. Neutral warmth." },
      { letter: "○", word: "Pause", detail: "A 2-second pause before responding signals that you actually heard them." }
    ]
  },
  {
    name: "Never-Say List",
    icon: "🚫",
    description: "Phrases that always make things worse",
    steps: [
      { letter: "✗", word: "'Calm down'", detail: "Tells them their reaction is wrong. Always backfires." },
      { letter: "✗", word: "'That's our policy'", detail: "Ends the conversation. Sounds like 'tough luck.'" },
      { letter: "✗", word: "'I understand' (too early)", detail: "Before they finish, it signals you're not listening." },
      { letter: "✗", word: "'There's nothing I can do'", detail: "Almost never true. Say what you CAN do instead." }
    ]
  },
  {
    name: "Reset Phrases",
    icon: "🔄",
    description: "Use these to shift the energy",
    steps: [
      { letter: "→", word: "Let me own this", detail: "'Let me take personal responsibility for getting this sorted out for you.'" },
      { letter: "→", word: "Specific time", detail: "'I will call you back by 3pm today' beats 'someone will follow up.'" },
      { letter: "→", word: "Name the emotion", detail: "'I can hear how frustrated you are, and honestly, I'd feel the same way.'" },
      { letter: "→", word: "Give a choice", detail: "'Would you prefer I...' — choices restore the customer's sense of control." }
    ]
  }
];
