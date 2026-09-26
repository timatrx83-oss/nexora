import type { MentorAiProfile } from './aiProfile'
import type { MentorMessage, MentorReply } from './types'

export class MentorRequestError extends Error {
  constructor() {
    super('mentor_unavailable')
    this.name = 'MentorRequestError'
  }
}

export async function requestMentorReply(input: {
  message: string
  locale: 'en' | 'ru' | 'kz'
  history: MentorMessage[]
  profile: MentorAiProfile
}): Promise<MentorReply> {
  let response: Response
  try {
    response = await fetch('/api/mentor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: input.message,
        locale: input.locale,
        history: input.history.slice(-12).map((item) => ({
          role: item.role,
          text: item.text,
        })),
        profile: input.profile,
      }),
    })
  } catch {
    throw new MentorRequestError()
  }

  if (!response.ok) throw new MentorRequestError()

  let data: { text?: unknown }
  try {
    data = (await response.json()) as { text?: unknown }
  } catch {
    throw new MentorRequestError()
  }

  if (typeof data.text !== 'string' || !data.text.trim()) throw new MentorRequestError()
  return { text: data.text.trim() }
}
