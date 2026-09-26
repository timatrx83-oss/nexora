import type { MentorMessage } from './types'

const STORAGE_KEY = 'nexora.mentor.conversation'

type StoredConversation = {
  version: 1
  messages: MentorMessage[]
}

function read(): MentorMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as StoredConversation
    if (parsed.version !== 1 || !Array.isArray(parsed.messages)) return []
    return parsed.messages.filter(
      (item) =>
        item &&
        typeof item.id === 'string' &&
        (item.role === 'user' || item.role === 'mentor') &&
        typeof item.text === 'string',
    )
  } catch {
    return []
  }
}

function write(messages: MentorMessage[]) {
  try {
    const payload: StoredConversation = { version: 1, messages }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    /* ignore */
  }
}

export function loadConversation() {
  return read()
}

export function saveConversation(messages: MentorMessage[]) {
  write(messages)
}

export function clearConversation() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
