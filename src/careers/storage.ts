const SAVED_KEY = 'nexora.explore.saved'
export const SAVED_CAREERS_EVENT = 'nexora:saved-careers'

function readIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is string => typeof id === 'string')
  } catch {
    return []
  }
}

function writeIds(ids: string[]) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(ids))
    window.dispatchEvent(new Event(SAVED_CAREERS_EVENT))
  } catch {
    /* ignore */
  }
}

export function getSavedCareerIds() {
  return readIds()
}

export function isCareerSaved(id: string) {
  return readIds().includes(id)
}

export function toggleSavedCareer(id: string) {
  const current = readIds()
  const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
  writeIds(next)
  return next
}

export function subscribeToSavedCareers(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SAVED_KEY || event.key === null) onChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(SAVED_CAREERS_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(SAVED_CAREERS_EVENT, onChange)
  }
}
