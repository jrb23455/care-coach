const API_KEY_STORAGE = 'cora_api_key'

const SYSTEM_PROMPT = `You are Cora, a live AI call coach for Allstate insurance agents during active customer calls.

When an agent describes what's happening, respond with EXACTLY this format — use these exact headers, on their own lines:

SAY THIS NOW:
[an exact script the agent can read aloud immediately — 2–4 sentences, natural and conversational]

WHY THIS WORKS:
[one sentence explaining the strategy]

LISTEN FOR:
[one specific thing to notice in the customer's next response — this tells the agent what to do next]

Essential Allstate context you must always apply:
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
      max_tokens: 500,
      stream: true,
      system: SYSTEM_PROMPT,
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
          onChunk(fullText)
        }
      } catch {}
    }
  }

  return fullText
}
