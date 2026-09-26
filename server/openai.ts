export type MentorEnv = {
  OPENAI_API_KEY?: string
  OPENAI_MODEL?: string
}

const DEFAULT_MODEL = 'gpt-5.6-luna'

type ResponsesPayload = {
  output_text?: unknown
  output?: unknown
  error?: { message?: unknown }
}

function collectText(node: unknown, parts: string[]) {
  if (typeof node === 'string') {
    if (node.trim()) parts.push(node)
    return
  }
  if (!node || typeof node !== 'object') return
  const record = node as Record<string, unknown>
  if (typeof record.output_text === 'string') parts.push(record.output_text)
  if (typeof record.text === 'string') parts.push(record.text)
  if (record.text && typeof record.text === 'object' && typeof (record.text as { value?: unknown }).value === 'string') {
    parts.push((record.text as { value: string }).value)
  }
  if (Array.isArray(record.content)) {
    for (const item of record.content) collectText(item, parts)
  }
  if (Array.isArray(record.output)) {
    for (const item of record.output) collectText(item, parts)
  }
}

export function extractResponseText(data: unknown) {
  if (!data || typeof data !== 'object') return ''
  const payload = data as ResponsesPayload
  if (typeof payload.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim()
  }
  const parts: string[] = []
  collectText(payload.output, parts)
  return parts.join('\n').trim()
}

export async function createMentorCompletion(input: {
  env: MentorEnv
  instructions: string
  conversation: { role: 'user' | 'assistant'; content: string }[]
}) {
  const apiKey = input.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    const error = new Error('missing_key')
    error.name = 'MentorConfigError'
    throw error
  }

  const model = input.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      instructions: input.instructions,
      input: input.conversation,
    }),
  })

  const raw = await response.text()
  let data: unknown = null
  try {
    data = raw ? JSON.parse(raw) : null
  } catch {
    data = null
  }

  if (!response.ok) {
    const error = new Error(`openai_${response.status}`)
    error.name = response.status === 401 || response.status === 403 ? 'MentorAuthError' : 'MentorUpstreamError'
    throw error
  }

  const text = extractResponseText(data)
  if (!text) {
    const error = new Error('empty_response')
    error.name = 'MentorUpstreamError'
    throw error
  }
  return text
}
