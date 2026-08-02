#!/usr/bin/env node
// Generates ElevenLabs TTS audio for all conversation turns.
// Usage: ELEVENLABS_API_KEY=your_key npm run generate-audio
//
// Voices:
//   Customer → Charlie (IKne3meq5aSn9XLyUdCD) — animated, conversational
//   Agent    → Rachel  (21m00Tcm4TlvDq8ikWAM) — warm, professional

import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const API_KEY = process.env.ELEVENLABS_API_KEY
if (!API_KEY) {
  console.error('Usage: ELEVENLABS_API_KEY=your_key npm run generate-audio')
  process.exit(1)
}

const VOICES = {
  customer: { id: 'IKne3meq5aSn9XLyUdCD', stability: 0.28, style: 0.50 }, // Charlie
  agent:    { id: '21m00Tcm4TlvDq8ikWAM', stability: 0.68, style: 0.10 }, // Rachel
}
const MODEL = 'eleven_turbo_v2'

const conversations = [
  {
    id: 'rate-increase',
    turns: [
      { speaker: 'customer', text: "Hi, I just got my renewal notice and my premium went up thirty percent. I am — I'm not okay with this. Nobody called me, nobody sent an email, I just got this bill and it's like — what is happening?" },
      { speaker: 'agent',    text: "I completely understand why you're caught off guard — a jump that size with no warning is genuinely frustrating, and you deserved to hear about it directly. Let me pull up your policy right now. I want to walk you through exactly what changed and what your options are." },
      { speaker: 'customer', text: "I've been a customer for seven years. Seven. And I've never had a claim. This doesn't make any sense to me." },
      { speaker: 'agent',    text: "Seven years and no claims — that matters, and I hear your frustration. Looking at your account now, I can see there were some coverage limit adjustments at renewal that are factoring in. Here's what I can do right now — I can run a full coverage review and see if there are ways to bring this number down while keeping you protected. Would that be helpful?" },
      { speaker: 'customer', text: "I mean — yes. Yes, I want to know what my options are. I just don't want to feel like I'm being taken advantage of." },
      { speaker: 'agent',    text: "That's completely fair, and you shouldn't feel that way. Let's go through it together. I've got your policy open and I want to make sure by the end of this call, everything makes sense to you." },
    ],
  },
  {
    id: 'claim-denied',
    turns: [
      { speaker: 'customer', text: "I got a letter saying my claim was denied. For flooding. I — I don't even know what to say. I've been paying you every month for ten years. Ten years." },
      { speaker: 'agent',    text: "I hear how upsetting that is, and after ten years with us, you deserve more than a letter — you deserve a real conversation. I'm opening your claim file right now." },
      { speaker: 'customer', text: "I thought flooding was covered. Nobody ever told me it wasn't. If I'd known that, I would have added it. Nobody told me." },
      { speaker: 'agent',    text: "I'm so sorry that wasn't made clear when your policy was set up — that's on us, and I won't minimize it. Here's what I want you to know: you have the right to a full written explanation of this decision, and you have the right to request a formal review by a separate team. I want to make sure you know both of those options." },
      { speaker: 'customer', text: "A review — will that actually help? Or is this just a runaround?" },
      { speaker: 'agent',    text: "It's a real process. A separate team reviews it fresh, independent of the original decision. I can't promise a different outcome, but I can promise it will be looked at thoroughly. I'll flag this in your file personally and email you the steps today." },
    ],
  },
  {
    id: 'supervisor-demand',
    turns: [
      { speaker: 'customer', text: "I need to speak to a supervisor. Right now. I've been dealing with this for three weeks and nobody has fixed it. I am done." },
      { speaker: 'agent',    text: "I hear you, and three weeks without a resolution is not okay. I want to be straight with you — my market leader can't join the call, but I can commit to having them call you back today at a time that works for you, and I'll brief them personally so you don't have to repeat everything. But first — can you tell me what's been going on?" },
      { speaker: 'customer', text: "There's a billing error on my account. It's been there for three weeks. Every time I call, someone tells me it's fixed, and then it's not." },
      { speaker: 'agent',    text: "That is not the experience you should be having, and I'm sorry. I'm looking at your billing history right now. I can see the adjustment that was supposed to go through — let me put in the correction directly and stay on the line with you while it processes, so I can confirm it's actually done before we hang up." },
      { speaker: 'customer', text: "That's... okay. I just want to know it's actually going to get fixed this time." },
      { speaker: 'agent',    text: "I understand. I'm processing it right now. I'll stay on the line, and once it's confirmed on my end I'll tell you exactly what you'll see on your next statement and when." },
    ],
  },
  {
    id: 'crisis-call',
    turns: [
      { speaker: 'customer', text: "Hi. Um. My car was just totaled. Like, I literally just watched it happen and I don't know what I'm supposed to do. I've been on hold for almost an hour." },
      { speaker: 'agent',    text: "I'm so sorry — both that this happened and that you had to wait that long. Let's slow down for a second. Are you okay? Are you safe right now?" },
      { speaker: 'customer', text: "Yeah. Yeah, I'm okay. I'm on the side of the road. I've just never had to deal with anything like this before. I don't know what the steps are." },
      { speaker: 'agent',    text: "You don't have to know — that's what I'm here for. I'm pulling up your policy right now and I'm going to walk you through every single step. Nothing gets missed. Can you tell me roughly where the accident happened and whether there's a police report?" },
      { speaker: 'customer', text: "Yeah, there's a report. The officer already came. It wasn't my fault — the other driver ran a red light." },
      { speaker: 'agent',    text: "Okay, that's important, and I have it noted. Since the other driver was at fault, that's going to affect how this gets handled in your favor. I'm starting your claim right now so we're already moving. Your policy also includes a rental vehicle while yours is assessed, so that's one less thing to figure out. Let's go through the rest together — I'm not going anywhere." },
    ],
  },
]

function tts(text, voice) {
  const body = JSON.stringify({
    text,
    model_id: MODEL,
    voice_settings: {
      stability: voice.stability,
      similarity_boost: 0.75,
      style: voice.style,
      use_speaker_boost: true,
    },
  })

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${voice.id}`,
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        let err = ''
        res.on('data', d => (err += d))
        res.on('end', () => reject(new Error(`ElevenLabs ${res.statusCode}: ${err.slice(0, 200)}`)))
        return
      }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

const publicAudio = path.join(__dirname, '..', 'public', 'audio')
fs.mkdirSync(publicAudio, { recursive: true })

for (const conv of conversations) {
  const dir = path.join(publicAudio, conv.id)
  fs.mkdirSync(dir, { recursive: true })
  console.log(`\n[${conv.id}]`)

  for (let i = 0; i < conv.turns.length; i++) {
    const turn = conv.turns[i]
    const file = path.join(dir, `turn-${i}.mp3`)

    if (fs.existsSync(file)) {
      console.log(`  turn-${i} (${turn.speaker}) — already exists, skipping`)
      continue
    }

    process.stdout.write(`  turn-${i} (${turn.speaker}) — generating...`)
    const audio = await tts(turn.text, VOICES[turn.speaker])
    fs.writeFileSync(file, audio)
    console.log(` ${Math.round(audio.length / 1024)}KB`)

    if (i < conv.turns.length - 1) await new Promise(r => setTimeout(r, 600))
  }
}

console.log('\nDone! Commit public/audio/ and deploy.')
