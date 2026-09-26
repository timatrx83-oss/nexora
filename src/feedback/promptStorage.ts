const PROMPT_KEY = 'nexora.feedback.prompt'

type PromptRecord = {
  shownAt: string
}

let memoryShown = false

export function wasFeedbackPromptShown(): boolean {
  if (memoryShown) return true
  try {
    if (sessionStorage.getItem(PROMPT_KEY)) return true
    return localStorage.getItem(PROMPT_KEY) !== null
  } catch {
    return false
  }
}

export function markFeedbackPromptShown(): void {
  memoryShown = true
  const record: PromptRecord = { shownAt: new Date().toISOString() }
  try {
    sessionStorage.setItem(PROMPT_KEY, '1')
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(PROMPT_KEY, JSON.stringify(record))
  } catch {
    /* ignore */
  }
}
