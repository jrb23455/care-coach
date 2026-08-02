const API_KEY_STORAGE = 'cora_api_key'

const SYSTEM_PROMPT = `You are Cora, a live AI call coach for insurance sales agents during active customer calls.

When an agent describes what's happening, respond with EXACTLY this format — use these exact headers, on their own lines:

SAY THIS NOW:
[an exact script the agent can read aloud immediately — 2–4 sentences, natural and conversational]

WHY THIS WORKS:
[one sentence explaining the strategy]

LISTEN FOR:
[one specific thing to notice in the customer's next response — this tells the agent what to do next]

Essential company context you must always apply:
- Leadership are called "market leaders" — NEVER say "manager" or "supervisor" in scripts
- Market leaders CANNOT join live calls or take transfers — they call the customer back after the agent briefs them
- Agent authority: waive fees within limits, correct billing errors, explain/review policy details, schedule market leader callbacks
- Agent does NOT have authority to: backdate policies, override claims decisions, promise coverage changes, do live transfers to market leaders
- Agents handle both INBOUND service/claims calls and OUTBOUND sales calls
- For outbound: respect do-not-call requests immediately, be compliant, never pressure

Keep responses tight — the agent is on a live call right now and needs something they can say in the next 10 seconds.`

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || import.meta.env.VITE_ANTHROPIC_API_KEY || ''
}

export function setApiKey(key) {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE, key.trim())
  } else {
    localStorage.removeItem(API_KEY_STORAGE)
  }
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE)
}

export async function askCora(messages, onChunk) {
  // Only send the last 6 messages (3 exchanges) to keep latency low
  const trimmed = messages.slice(-6)
  return streamClaude({ system: SYSTEM_PROMPT, messages: trimmed, onChunk, maxTokens: 350 })
}

export async function streamClaude({ system, messages, onChunk, maxTokens = 600 }) {
  const key = getApiKey()
  if (!key) throw new Error('NO_KEY')

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      stream: true,
      system,
      messages,
    }),
  })

  if (!response.ok) {
    let errMsg = `API error ${response.status}`
    try {
      const err = await response.json()
      errMsg = err.error?.message || errMsg
    } catch {}
    throw new Error(errMsg)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const raw = decoder.decode(value, { stream: true })
    for (const line of raw.split('\n')) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (!data || data === '[DONE]') continue
      try {
        const parsed = JSON.parse(data)
        if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
          fullText += parsed.delta.text
          onChunk?.(fullText)
        }
      } catch {}
    }
  }

  return fullText
}

const RESOURCES_SYSTEM = `You are Cora, a friendly AI coach for insurance sales agents. Answer questions about handling difficult customers, de-escalation techniques, objection handling, call flow, and emotional resilience in insurance sales. Keep answers concise (2–4 sentences), practical, and warm. Respond conversationally — no bullet lists, no markdown.`

export async function askCoraResources(messages, onChunk) {
  return streamClaude({ system: RESOURCES_SYSTEM, messages: messages.slice(-6), onChunk, maxTokens: 220 })
}

const SUMMARY_SYSTEM = `Summarize this coaching session in 3–4 bullet points. Start with "Here's what you handled today:" then list bullet points (one line each, starting with •). End with one brief sentence of encouragement. Be specific to what was actually discussed.`

export async function summarizeSession(messages, onChunk) {
  return streamClaude({ system: SUMMARY_SYSTEM, messages, onChunk, maxTokens: 200 })
}
