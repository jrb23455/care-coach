export const practiceScenarios = [
  // ── UNDERSTAND ──────────────────────────────────────────────────────
  {
    id: 'understand-1', pillar: 'understand', title: 'The Three-Week Wait',
    difficulty: 'beginner', xp: 25,
    customerLine: "I've been waiting THREE WEEKS for my claim and nobody will tell me anything. This is absolutely unacceptable.",
    options: [
      { text: "I hear you — three weeks with no update isn't okay. I'm pulling up your claim right now. Can I get your policy number?", score: 92, feedback: "Excellent. You named the problem, validated the emotion, and moved to action — all in one sentence. This is the CARE model working." },
      { text: "I understand your frustration. Can I get your policy number so I can look into this?", score: 70, feedback: "Decent start, but 'I understand your frustration' before they've finished venting can feel dismissive. Try naming the specific thing they're frustrated about." },
      { text: "Three weeks is definitely too long. Let me check what's happening with your claim.", score: 55, feedback: "You acknowledged the time but skipped the emotional validation. Customers need to feel heard before they trust you to fix things." },
      { text: "I apologize for the delay. Our claims department has been backed up lately.", score: 15, feedback: "Apologizing and then immediately giving an excuse is the worst combination. It sounds defensive. Acknowledge their experience first — never your operations." },
    ],
    expertResponse: "I hear you — three weeks with no update is genuinely frustrating, and you deserve better communication than that. Let me pull up your claim right now and tell you exactly where things stand.",
  },
  {
    id: 'understand-2', pillar: 'understand', title: 'Premium Shock',
    difficulty: 'beginner', xp: 25,
    customerLine: "My bill went up $80 a month and nobody told me! I feel like you people are just stealing from me.",
    options: [
      { text: "An $80 increase with no warning — that's a real shock, and I'm sorry you found out on your bill instead of from us. Let me look at exactly why this changed.", score: 90, feedback: "You reflected the specific dollar amount back, acknowledged the notification failure, and moved to investigation. Customers feel heard when you repeat their numbers." },
      { text: "I understand that must be frustrating. Rates do go up from time to time based on various factors.", score: 10, feedback: "'Rates go up from time to time' is the most dismissive thing you can say. It sounds like 'tough luck.' Never normalize their pain." },
      { text: "I'm sorry to hear that. Let me pull up your account and see what happened.", score: 60, feedback: "Fine, but you missed an opportunity to reflect the specific impact ($80/month, no warning). Specificity builds trust." },
      { text: "You're right, we should have notified you. I apologize. Let me explain the reason for the change.", score: 75, feedback: "Good ownership of the communication failure. Just make sure you let them respond before jumping to explanations — they may not be ready to listen yet." },
    ],
    expertResponse: "An $80 jump with no warning — I completely understand why that feels like a betrayal. You deserved to hear about this from us, not from your bill. Let me look at exactly what changed and why, and then let's see if there's anything we can do.",
  },
  {
    id: 'understand-3', pillar: 'understand', title: 'The Accusation',
    difficulty: 'intermediate', xp: 35,
    customerLine: "Your agent LIED to me when I signed up. She said this covered flood damage and now you're telling me it doesn't? I want to sue.",
    options: [
      { text: "That's a serious concern and I'm not dismissing it. If there was a miscommunication about your coverage when you signed up, that needs to be investigated. Can you tell me what was said?", score: 88, feedback: "Perfect response. You took it seriously without admitting liability, opened an investigation, and didn't get defensive about 'your agent.'" },
      { text: "I'm sorry, but flood damage requires a separate policy. That's a federal requirement, not something specific to us.", score: 45, feedback: "The information is accurate but the delivery is tone-deaf. You immediately jumped to defending the company. Acknowledge their experience first." },
      { text: "I understand your frustration, but our agents are trained not to misrepresent coverage.", score: 5, feedback: "This is the worst possible response. You're essentially calling them a liar. Never defend your staff before investigating the customer's claim." },
      { text: "I'm sorry to hear that. Let me open a formal review — we can pull any recorded calls or notes from your sign-up to see what was said.", score: 95, feedback: "Outstanding. Offering to pull the records is the most credible response here. It protects everyone and shows you're taking it seriously." },
    ],
    expertResponse: "That's a serious concern, and I'm not going to brush it off. If our agent represented your coverage in a way that wasn't accurate, that needs to be reviewed. I'm going to open a formal case — we can pull any recorded calls or notes from when you signed up. Can I get that started for you?",
  },
  {
    id: 'understand-4', pillar: 'understand', title: 'Transferred Too Many Times',
    difficulty: 'intermediate', xp: 35,
    customerLine: "I have been transferred FOUR times today. FOUR. I have to explain this whole story every single time. I'm done.",
    options: [
      { text: "Four transfers — that's exhausting, and I'm sorry we've put you through that. You're not going anywhere else. Tell me once and I'll either solve it right here, or I'll personally make sure whoever follows up already knows your full story.", score: 95, feedback: "The commitment 'you're not going anywhere else' and 'tell me once' are the exact phrases that defuse this. You're promising ownership — not a transfer, but accountability." },
      { text: "I completely understand. Let me try to help you with your issue.", score: 50, feedback: "Better than nothing, but you didn't address the specific pain (repeating themselves four times). Acknowledge the exact frustration before pivoting." },
      { text: "I apologize for the inconvenience. I'll do my best to help you today.", score: 30, feedback: "'Inconvenience' massively undersells their experience. And 'I'll do my best' sounds non-committal when they need a firm promise." },
      { text: "You shouldn't have been transferred that many times. Can you give me your account number?", score: 55, feedback: "You validated the problem but moved to data-gathering too fast. They need to feel heard before they trust you with their account number again." },
    ],
    expertResponse: "Four transfers and having to repeat yourself every time — I'm genuinely sorry. That's not what your experience with us should look like. You're done being passed around. Tell me what's going on once, and I'm going to own this from here — either I fix it myself, or I personally make sure whoever is next already knows everything.",
  },
  {
    id: 'understand-5', pillar: 'understand', title: 'Personal Financial Impact',
    difficulty: 'advanced', xp: 45,
    customerLine: "You double-charged my account. TWICE. I had rent due. I overdrafted. I have overdraft fees now because of YOU. Do you understand what that means for my family?",
    options: [
      { text: "I do understand, and this is a real emergency. A double charge that caused an overdraft is completely unacceptable. I'm initiating a reversal right now — and I also want to ask: did you get hit with an overdraft fee from your bank? I may be able to help with that too.", score: 97, feedback: "Exceptional. You used the word 'emergency,' initiated action immediately, and proactively asked about downstream damage (overdraft fees). This is elite-level empathy." },
      { text: "I'm so sorry. I see the double charge — I'm going to get that reversed for you right away.", score: 72, feedback: "Good action, but you undersold the empathy. When someone mentions their family and rent, you need to address the human impact before the transaction." },
      { text: "I understand. That kind of billing error is unacceptable. Let me look into this.", score: 55, feedback: "'Look into this' is weak when someone has an active financial crisis. Use urgent language and commit to immediate action." },
      { text: "Overdraft fees are charged by your bank, so unfortunately we can't reverse those.", score: 5, feedback: "Technically true, catastrophically wrong. You led with what you can't do during someone's financial crisis. Even if you can't reverse the bank fee, offer something (a letter documenting the error)." },
    ],
    expertResponse: "I hear what you're saying, and I understand this isn't just about the money — this affected your family's stability. That's on us, and I'm sorry. I'm initiating the reversal right now. I also want to ask about the overdraft fee — I can't reverse your bank's fee directly, but I can give you a formal letter documenting our error, which many banks will waive the fee for. Would that help?",
  },

  // ── DE-ESCALATE ──────────────────────────────────────────────────────
  {
    id: 'deescalate-1', pillar: 'deescalate', title: 'The Yeller',
    difficulty: 'beginner', xp: 25,
    customerLine: "THIS IS RIDICULOUS! I want this fixed RIGHT NOW or I am going to your competitor. DO YOU UNDERSTAND ME?",
    options: [
      { text: "I hear you. I'm going to fix this.", score: 80, feedback: "Short, calm, and action-oriented. Good. In a real call your tone here matters more than the words — speak slower and quieter than them." },
      { text: "Please calm down so I can help you.", score: 0, feedback: "Never say 'calm down.' Ever. It invalidates their emotion and almost always escalates the situation further." },
      { text: "I completely understand why you're upset, and I want to make this right. Can you give me one moment to look at your account?", score: 85, feedback: "Strong. Validation + intent to resolve + a specific ask. The 'one moment' creates a brief reset without putting them on hold." },
      { text: "There's no need to raise your voice. I'm trying to help you.", score: 10, feedback: "Commenting on their tone puts you in the role of parent correcting a child. It derails from the actual problem and adds a confrontation layer." },
    ],
    expertResponse: "I hear you, and I want to fix this right now. Give me one moment to pull up your account — I'm not going anywhere.",
  },
  {
    id: 'deescalate-2', pillar: 'deescalate', title: 'Threatening to Record',
    difficulty: 'intermediate', xp: 35,
    customerLine: "I'm recording this conversation. I want you to know that. Everything you say is being recorded.",
    options: [
      { text: "That's completely fine. This call may be recorded on our end as well. How can I help you today?", score: 92, feedback: "Perfect. Calm, transparent, and immediately redirected to solving their problem. Showing no reaction to the recording threat removes its power." },
      { text: "I'm sorry, but I need to let my market leader know if you're going to record this call.", score: 25, feedback: "This makes it a much bigger deal than it needs to be. Customers can record calls in most jurisdictions. Treating it as an escalation point only escalates things." },
      { text: "I understand. Please know that I'm here to help you and will do everything I can to resolve your issue.", score: 78, feedback: "Good — you didn't react to the threat. Slightly weaker because you didn't acknowledge the recording itself, which can feel evasive." },
      { text: "For your information, this call is already being recorded on our end.", score: 45, feedback: "True, but the phrasing 'for your information' comes across as slightly defensive or confrontational. Keep it neutral." },
    ],
    expertResponse: "That's fine — this call may be recorded on our end as well. Now, how can I help you?",
  },
  {
    id: 'deescalate-3', pillar: 'deescalate', title: 'Personal Attack',
    difficulty: 'intermediate', xp: 35,
    customerLine: "You people are completely incompetent. Do you even know what you're doing? Is anyone there actually trained?",
    options: [
      { text: "I understand your frustration with the experience you've had. I'm trained and I'm focused entirely on getting this resolved for you right now.", score: 85, feedback: "You acknowledged the frustration without taking the bait on the personal attack. Redirecting to your capability and commitment is the right move." },
      { text: "I'm sorry you feel that way. Let me try to help you.", score: 40, feedback: "'I'm sorry you feel that way' is a non-apology that often makes things worse. It sounds dismissive of their actual experience." },
      { text: "I assure you our team is highly trained. Now, let me help you with your issue.", score: 35, feedback: "Defending the team's training shifts the conversation into a debate about competence, which you can't win on a call. Redirect to action instead." },
      { text: "I hear that you've had a frustrating experience — that's not what we want for you. Tell me what's happened and I'll focus on making it right.", score: 90, feedback: "Excellent. You separated their frustration with the experience from a personal judgment, and pivoted immediately to resolution. This is the right frame." },
    ],
    expertResponse: "I hear that you've had a frustrating experience — that's not what we want for you, and I take that seriously. Tell me what's happened and I'll focus entirely on making it right.",
  },
  {
    id: 'deescalate-4', pillar: 'deescalate', title: 'The Repeat Caller',
    difficulty: 'advanced', xp: 45,
    customerLine: "I've called six times about this exact same issue. Every agent tells me something different. I don't believe anything you say anymore.",
    options: [
      { text: "Six calls and six different answers — that's a complete failure on our part, and I understand why you don't trust what I'm about to tell you. I'm going to read every note in your file before I say anything so I can give you one accurate answer and own it.", score: 97, feedback: "Outstanding. You validated the distrust as earned, not irrational, and made a specific commitment (reading the notes) that demonstrates you'll do something different." },
      { text: "I'm sorry about that. I'll make sure to give you the correct information today.", score: 42, feedback: "Every previous agent probably said this exact thing. 'I'll make sure' is not a differentiator — it's what they've heard five times already." },
      { text: "I understand your frustration. Let me start fresh and try to get to the bottom of this.", score: 60, feedback: "'Start fresh' accidentally implies ignoring the history of their issue. Acknowledge the history is exactly the problem — you need to work WITH it, not reset." },
      { text: "I can see there have been multiple contacts about this. Let me review the notes and give you a definitive answer.", score: 82, feedback: "Good — concrete and professional. Loses points only because you didn't specifically acknowledge the trust damage six calls creates." },
    ],
    expertResponse: "Six calls with six different answers — I understand completely why you don't trust what I'm about to say. Before I tell you anything, I'm going to read every single note in your account so I can give you one accurate answer and put my name on it. Give me thirty seconds.",
  },
  {
    id: 'deescalate-5', pillar: 'deescalate', title: 'Grief Behind the Anger',
    difficulty: 'advanced', xp: 45,
    customerLine: "My husband JUST died and you're sending me collection notices? He handled all of this. I don't even know what half these policies mean.",
    options: [
      { text: "I'm so sorry for your loss. Dealing with insurance paperwork while grieving is incredibly hard. I want to make this as easy as possible — let's slow down, and I'll walk you through everything step by step. Nothing is urgent right now.", score: 98, feedback: "This is exceptional. You acknowledged the grief first, validated the overwhelm, explicitly said 'nothing is urgent,' and committed to guiding her. This is a human response, not an agent script." },
      { text: "I'm sorry for your loss. I can send you information about our bereavement policy.", score: 30, feedback: "Jumping to process ('bereavement policy') immediately after someone discloses a death feels clinical and cold. The person needs to feel cared for first." },
      { text: "I understand. For collection matters you'll need to speak with our billing department.", score: 0, feedback: "This is the worst possible response. You're essentially abandoning a grieving widow by routing her elsewhere the moment she disclosed her husband's death. Own this call — never deflect at someone's most vulnerable moment." },
      { text: "I'm very sorry for your loss. I want to help make this as simple as possible for you. Let's go through everything together, and if you need to take a break at any point, that's completely fine.", score: 90, feedback: "Very strong empathy and flexibility. The 'take a break' offer is a nice human touch. Loses a couple points only because 'nothing is urgent right now' would be even more reassuring." },
    ],
    expertResponse: "I'm so deeply sorry for your loss. Please know that none of this is urgent — I want you to take whatever time you need. When you're ready, I'll walk you through everything from the beginning, as slowly as you'd like, so you understand exactly what each policy means and what, if anything, needs your attention right now.",
  },

  // ── RESPOND ──────────────────────────────────────────────────────────
  {
    id: 'respond-1', pillar: 'respond', title: 'The Demand for a Refund',
    difficulty: 'beginner', xp: 25,
    customerLine: "I want a full refund. Today. I don't want to hear about processes or timelines.",
    options: [
      { text: "I hear you. Here's what I can do right now: [confirm what you CAN do]. I want to be honest with you about the timeline, but I'll do everything in my power to expedite it.", score: 82, feedback: "Good — leading with what you CAN do is exactly right. Honesty about timing, paired with a commitment to expedite, is the best version of 'I can't do it today.'" },
      { text: "I understand you want a refund today, but our refund process takes 5-7 business days.", score: 20, feedback: "You led with the limitation and gave a generic timeline. They told you they didn't want to hear about timelines. Start with what you can control." },
      { text: "There's nothing I can do to speed that up.", score: 0, feedback: "Never say 'there's nothing I can do.' Almost always untrue, and always the fastest way to lose the customer completely." },
      { text: "You deserve a clear answer. I can initiate the refund right now — it will post within [X days]. I'm also flagging this as a priority and will follow up personally to confirm it posts.", score: 95, feedback: "Excellent. Concrete action, honest timeline, personal follow-up commitment. This is the structure every refund response should follow." },
    ],
    expertResponse: "You deserve a straight answer. I can initiate the refund right now — it typically posts in [X] business days. I'm going to flag this as a priority and add a personal note to follow up and confirm it posts. Is [your email] still the best place to reach you?",
  },
  {
    id: 'respond-2', pillar: 'respond', title: "Can't Do That",
    difficulty: 'beginner', xp: 25,
    customerLine: "I want you to waive this late fee. It's not my fault your autopay glitched.",
    options: [
      { text: "If our autopay system caused the missed payment, that's absolutely something we should make right. Let me look at your payment history to see what happened on our end.", score: 90, feedback: "You started from a position of believing them and investigating rather than defending. This builds trust and is factually the right starting point." },
      { text: "I can waive the late fee as a one-time courtesy.", score: 75, feedback: "Effective resolution, but 'one-time courtesy' can feel slightly condescending when the customer is claiming it's our system's fault, not theirs." },
      { text: "Late fees are applied automatically by the system. I'd need to check your account to see if a waiver is possible.", score: 50, feedback: "True, but leading with 'fees are applied automatically' is defensive. Lead with the investigation, not the policy." },
      { text: "We don't typically waive fees, but let me see what I can do.", score: 15, feedback: "'We don't typically' plants doubt before you've even looked. Never signal skepticism before investigating a customer's claim." },
    ],
    expertResponse: "If our autopay system is the reason this was missed, then that's not your fault and this fee shouldn't stand. Let me pull up your account and look at what happened on our end.",
  },
  {
    id: 'respond-3', pillar: 'respond', title: 'Asking for the Impossible',
    difficulty: 'intermediate', xp: 35,
    customerLine: "I want you to change my policy effective date retroactively so my accident is covered. You have to do this.",
    options: [
      { text: "I understand why you're asking, and I wish I could do that for you. What I can do is [review the claim for any other applicable coverage / look at whether there's an appeal process]. Let me start there.", score: 85, feedback: "You were honest about the limit without dwelling on it, and pivoted immediately to alternatives. This is the right structure for every 'I can't do that' situation." },
      { text: "I'm sorry, but that's not something we're able to do. Coverage can't be backdated.", score: 30, feedback: "Accurate but abrupt. You closed the door without offering anything. Always follow 'I can't' with 'but here's what I can.'" },
      { text: "Let me see what I can do.", score: 20, feedback: "You're setting up a false expectation. If you know this isn't possible, saying 'let me see' is a short-term delay that will make the eventual 'no' feel worse." },
      { text: "I completely understand why you're asking — that would solve everything. I have to be honest with you: backdating a policy after an incident isn't something I have the ability to do. But I don't want to just say no and leave you stuck — let me look at whether there's any other coverage that might apply here.", score: 95, feedback: "Exceptional. You validated the ask, were honest about the limit, and immediately turned toward alternatives without making them feel dismissed." },
    ],
    expertResponse: "I understand why you're asking — that would solve everything. I have to be honest: backdating coverage after an incident isn't something I'm able to do. But I don't want to just tell you no. Let me look carefully at your current policy to see if there's any other coverage that might apply to this situation.",
  },
  {
    id: 'respond-4', pillar: 'respond', title: 'The Market Leader Request',
    difficulty: 'intermediate', xp: 35,
    customerLine: "You can't help me. I want to speak to your manager RIGHT NOW.",
    options: [
      { text: "I hear you. I don't have a way to bring my market leader on the call directly, but I absolutely can have them call you back — or let me take one more shot at this myself. What outcome would actually make this right for you?", score: 92, feedback: "This is exactly right for Allstate. You were honest about the real process (no live handoff to a market leader), offered the real escalation path, and still tried to resolve it first." },
      { text: "Of course. Let me transfer you to my supervisor right away.", score: 0, feedback: "This isn't how Allstate works — market leaders can't be brought on calls or take live transfers. Promising something you can't deliver destroys trust the moment they find out." },
      { text: "My market leader isn't available to join the call, but I can have them call you back at a specific time — or I can try to resolve this myself right now. Which works better for you?", score: 85, feedback: "Honest about the real process and gives the customer a choice. Loses a few points for not first asking what outcome they're looking for — understanding that can change everything." },
      { text: "There's no need for a manager — I can help you with this.", score: 10, feedback: "Refusing the escalation request feels dismissive. Even if you can genuinely fix it, their trust in you is already low. Acknowledge the request before redirecting." },
    ],
    expertResponse: "I hear you. I don't have a way to bring my market leader directly on the call, but I can absolutely make sure they follow up with you — or I can take one more shot at getting this resolved right now. Before we decide: what would 'fixed' actually look like for you?",
  },
  {
    id: 'respond-5', pillar: 'respond', title: 'The Ultimatum',
    difficulty: 'advanced', xp: 45,
    customerLine: "Either you fix this today or I'm filing a complaint with the state insurance commissioner.",
    options: [
      { text: "That's absolutely your right, and I respect it. I want to be clear: I want to fix this today too. Let's see what we can actually do in the next few minutes. What would 'fixed' look like for you?", score: 95, feedback: "Masterful. You acknowledged their right without being defensive, aligned your goal with theirs, and asked a powerful question that shifts from complaint to resolution." },
      { text: "I understand your frustration. Let me do everything I can to resolve this today.", score: 65, feedback: "Fine response, but 'everything I can' is vague. When someone issues an ultimatum they need specificity, not good intentions." },
      { text: "You have every right to file a complaint. Now, let me tell you what I can do today.", score: 78, feedback: "Good — you didn't show fear of the threat. Slightly better if you aligned on a shared goal before pivoting to action." },
      { text: "I'd prefer if we could resolve this without involving the commissioner. Let me see what I can do.", score: 20, feedback: "'I'd prefer' signals the threat worked, which hands them leverage. Treat the commissioner comment as neutral information, not a weapon they've deployed." },
    ],
    expertResponse: "Filing a complaint is absolutely your right, and I respect that. I also want you to know: I want to fix this today too. So let's focus on that. Tell me — what would 'resolved' look like for you, specifically? Let's see if we can get there in the next few minutes.",
  },

  // ── RESOLVE & CLOSE ──────────────────────────────────────────────────
  {
    id: 'resolve-1', pillar: 'resolve', title: 'Before You Hang Up',
    difficulty: 'beginner', xp: 25,
    customerLine: "Fine. Whatever. Is that it? Because I've been on this call for 40 minutes.",
    options: [
      { text: "I know this took longer than it should have, and I appreciate your patience. Before you go — I want to make sure you actually feel like this is resolved, not just that we got through a call. Is there anything else I should know about?", score: 88, feedback: "Strong. You acknowledged the time, and 'resolved vs. just got through a call' is an insightful distinction that signals you actually care about the outcome." },
      { text: "Yes, that's everything. Thank you for your patience and have a great day!", score: 20, feedback: "The contrast between their tone and your cheerfulness will feel tone-deaf. Match the energy slightly — be warm but measured." },
      { text: "I'm sorry this took so long. To confirm: [recap what was resolved]. You should see [outcome] within [timeframe]. Is that correct?", score: 92, feedback: "Excellent close. The recap and timeline confirmation ensures alignment and gives them one last thing to hold you accountable to." },
      { text: "Thank you for your patience. Is there anything else I can help you with today?", score: 45, feedback: "Generic close. After a 40-minute call, they need a recap and a concrete next step — not a standard end-of-call question." },
    ],
    expertResponse: "I know this took longer than it should have — I appreciate your patience. Before you go, let me just confirm what happens next: [specific outcome and timeline]. You should see [X] by [date]. If that doesn't happen, call us back and reference [case/confirmation number]. Is there anything else before I let you go?",
  },
  {
    id: 'resolve-2', pillar: 'resolve', title: 'Turning the Cancellation',
    difficulty: 'intermediate', xp: 35,
    customerLine: "Fine, I've thought about it and I want to cancel my policy. Process the cancellation.",
    options: [
      { text: "I can process that for you. Before I do — I want to make sure you know about anything that might affect you: [pending claim / prorated refund / coverage gap]. I want this to go smoothly for you either way.", score: 88, feedback: "Good. You respected the decision and still added value by ensuring they have all the information. This is the right tone for a cancellation that's already been decided." },
      { text: "I can do that. But before I process it — is there anything specific that drove this decision? I want to make sure we didn't miss a chance to fix something.", score: 82, feedback: "Good question, but be careful — if they've already said 'I've thought about it,' asking why can feel like you're not accepting their decision. Use this if they haven't given a reason yet." },
      { text: "Are you sure? Have you considered the coverage gap this might create?", score: 25, feedback: "Leading with 'are you sure?' after they explicitly said they've thought about it is dismissive of their decision. If you want to raise concerns, frame them as information, not doubt." },
      { text: "Of course. I'll process that right away.", score: 50, feedback: "You respected their decision, but you missed an opportunity to provide real value — prorated refunds, coverage gaps, pending claims. Even a departing customer deserves your expertise." },
    ],
    expertResponse: "Of course — I'll process that. Before I do, I just want to make sure you have the full picture: [pending claim / coverage gap / prorated refund]. I want this transition to go smoothly for you regardless. Ready to proceed?",
  },
  {
    id: 'resolve-3', pillar: 'resolve', title: 'The Unsatisfied Customer',
    difficulty: 'intermediate', xp: 35,
    customerLine: "I guess that's all you can do. But I'm still not happy about this.",
    options: [
      { text: "And you don't have to be. What happened wasn't okay, and I don't expect you to walk away happy. What I can promise is that I've done everything in my power on this call, and [specific next step]. If that doesn't happen, call back and ask for me.", score: 95, feedback: "Exceptional. Validating that they don't have to be happy is a bold, honest move that usually earns more respect than any resolution script. The personal accountability ('ask for me') seals it." },
      { text: "I completely understand. I'm sorry we couldn't do more. Is there anything else I can help with?", score: 50, feedback: "Acceptable but forgettable. The standard close doesn't land after a difficult call. Add specificity — what happens next, and how they can follow up." },
      { text: "I understand. Thank you for your patience and I hope you have a great rest of your day!", score: 5, feedback: "The cheerful 'great rest of your day!' after they explicitly said they're unhappy will feel sarcastic or oblivious. Read the room." },
      { text: "I hear you, and I don't want to pretend this went perfectly. What I've done is [specific action]. You should see [outcome] by [date] — and if you don't, call back and we'll make this right.", score: 90, feedback: "Very strong. Honest, specific, and gives them a concrete follow-up path. The phrase 'I don't want to pretend this went perfectly' is honest in a way that builds trust." },
    ],
    expertResponse: "You don't have to be happy about this — and I'm not going to pretend everything went perfectly. What I've done today is [specific action], and you should see [outcome] by [date]. If that doesn't happen, call back and ask for me by name. I want to make sure this actually gets resolved for you.",
  },
  {
    id: 'resolve-4', pillar: 'resolve', title: 'Protecting the Relationship',
    difficulty: 'advanced', xp: 45,
    customerLine: "You resolved the issue but I still can't believe it came to this. I used to love this company.",
    options: [
      { text: "I hear that, and honestly, that matters to me. The fact that you're saying 'used to' tells me we let you down. I can't undo what happened but I want to earn that back. Is there anything else about your experience that I should know about?", score: 95, feedback: "Exceptional. You caught the language shift ('used to love') and addressed it directly. Asking to earn trust back is vulnerable and powerful — it's not a script, it's a human response." },
      { text: "I'm glad we resolved the issue. We really do value your loyalty.", score: 30, feedback: "'We value your loyalty' is corporate boilerplate that falls flat after a difficult call. It doesn't acknowledge what they actually said." },
      { text: "I completely understand. I hope this experience doesn't change how you feel about us long-term.", score: 55, feedback: "Better — you acknowledged the relationship dimension. But 'I hope' is passive. Take ownership: 'I want to make sure this doesn't define your experience with us.'" },
      { text: "I'm sorry it came to this. You've been a customer for [X years] and you deserve better than what happened today. I'm going to note everything in your account so that if you ever have an issue again, the next agent understands your history with us.", score: 88, feedback: "Strong. Personalizing with their tenure and flagging the account note are both concrete actions that signal you're invested in the relationship, not just the resolution." },
    ],
    expertResponse: "I caught that — 'used to love.' That means we let you down, and I take that seriously. I'm glad we resolved this, but I want to earn back more than just the resolution. I'm making a note of everything we talked about today so that anyone you speak to in the future understands your history with us. You shouldn't have to start over if something comes up again.",
  },
  {
    id: 'resolve-5', pillar: 'resolve', title: 'The Close on a Win',
    difficulty: 'beginner', xp: 25,
    customerLine: "Okay, that actually worked. Thank you. I was ready to cancel.",
    options: [
      { text: "I'm really glad we got there. For the record — your feedback about [what frustrated them] is worth hearing. These calls matter. Thank you for giving us the chance to fix it.", score: 92, feedback: "Excellent. You closed warmly, referenced the specific issue, and made them feel like their frustration had value. This is how you turn a save into a loyalty moment." },
      { text: "Great! Is there anything else I can help you with today?", score: 40, feedback: "Standard close on a non-standard moment. When a customer says 'I was ready to cancel,' you've just won something real. Acknowledge it." },
      { text: "I'm so glad! We really do appreciate your business and loyalty.", score: 55, feedback: "Warmer than the generic close, but 'we appreciate your business' is a little corporate for the moment. Make it personal." },
      { text: "I'm really glad we worked through this. And I want you to know — this call is going to be noted. What you experienced shouldn't happen again, and I want to make sure it doesn't.", score: 88, feedback: "Strong accountability close. Noting the call signals real commitment to improvement, which is meaningful to someone who was about to leave." },
    ],
    expertResponse: "I'm really glad we got there. And honestly — thank you for giving us the chance to fix it instead of just canceling. That matters. I'm going to note this call so what you experienced is on record. You should never have to go through that again.",
  },
]
