import type { IncomingMessage, ServerResponse } from 'node:http'
import { createMentorCompletion, type MentorEnv } from './openai.ts'
import { mentorSystemPrompt } from './mentorPrompt.ts'

const MAX_MESSAGE = 4000
const MAX_HISTORY = 12
const MAX_BODY = 80_000

export type MentorApiBody = {
  message?: unknown
  locale?: unknown
  history?: unknown
  profile?: unknown
}

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(new Error('payload_too_large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function json(res: ServerResponse, status: number, payload: Record<string, unknown>) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

function asLocale(value: unknown): 'en' | 'ru' | 'kz' {
  if (value === 'ru' || value === 'kz' || value === 'en') return value
  return 'en'
}

function compactHistory(raw: unknown) {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item) => item && typeof item === 'object')
    .map((item) => item as { role?: unknown; text?: unknown })
    .filter((item) => (item.role === 'user' || item.role === 'mentor' || item.role === 'assistant') && typeof item.text === 'string')
    .slice(-MAX_HISTORY)
    .map((item) => ({
      role: item.role === 'user' ? ('user' as const) : ('assistant' as const),
      content: String(item.text).slice(0, MAX_MESSAGE),
    }))
}

export async function handleMentorApi(req: IncomingMessage, res: ServerResponse, env: MentorEnv) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }
  if (req.method !== 'POST') {
    json(res, 405, { error: 'method_not_allowed' })
    return
  }

  let parsed: MentorApiBody
  try {
    const raw = await readBody(req)
    parsed = raw ? (JSON.parse(raw) as MentorApiBody) : {}
  } catch {
    json(res, 400, { error: 'invalid_json' })
    return
  }

  const message = typeof parsed.message === 'string' ? parsed.message.trim() : ''
  if (!message || message.length > MAX_MESSAGE) {
    json(res, 400, { error: 'invalid_message' })
    return
  }

  const locale = asLocale(parsed.locale)
  const history = compactHistory(parsed.history)
  const profile =
    parsed.profile && typeof parsed.profile === 'object' ? parsed.profile : { assessmentCompleted: false }

  const conversation = [
    {
      role: 'user' as const,
      content: `NEXORA profile context (JSON). Use this. Do not invent missing fields.\n${JSON.stringify(profile)}`,
    },
    ...history.filter((item, index) => !(index === history.length - 1 && item.role === 'user' && item.content === message)),
    { role: 'user' as const, content: message },
  ]

  try {
    const text = await createMentorCompletion({
      env,
      instructions: mentorSystemPrompt(locale),
      conversation,
    })
    json(res, 200, { text })
  } catch (error) {
    const name = error instanceof Error ? error.name : 'Error'
    if (name === 'MentorConfigError') {
      console.error('[mentor] OpenAI API key is not configured')
      json(res, 503, { error: 'unavailable' })
      return
    }
    if (name === 'MentorAuthError') {
      console.error('[mentor] OpenAI authentication failed')
      json(res, 503, { error: 'unavailable' })
      return
    }
    console.error('[mentor] upstream request failed')
    json(res, 502, { error: 'unavailable' })
  }
}
