export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: 'Server API key not configured' } }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  const upstream = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!upstream.ok) {
    const err = await upstream.text()
    return new Response(err, {
      status: upstream.status,
      headers: { 'content-type': 'application/json' },
    })
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'x-accel-buffering': 'no',
    },
  })
}
