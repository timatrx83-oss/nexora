import type { Messages } from '../i18n/en'
import type { Career } from '../careers/types'
import type { MentorPromptId } from './types'
import type { MentorSnapshot } from './snapshot'

export type MentorStarter = {
  id: MentorPromptId
  label: string
}

export function mentorStarters(t: Messages, snapshot: MentorSnapshot): MentorStarter[] {
  const copy = t.mentor.starters
  const items: MentorStarter[] = [
    { id: 'fit', label: copy.fit },
    { id: 'results', label: copy.results },
    { id: 'traits', label: copy.traits },
  ]

  const saved = snapshot.savedCareers[0]
  if (saved && t.careers[saved.id]) {
    items.push({
      id: 'aboutSaved',
      label: copy.aboutSaved.replace('{title}', t.careers[saved.id].title),
    })
  } else {
    items.push({ id: 'fields', label: copy.fields })
  }

  if (snapshot.savedCareers.length >= 2) {
    items.push({ id: 'compareSaved', label: copy.compareSaved })
  } else {
    items.push({ id: 'compare', label: copy.compare })
  }

  items.push({ id: 'skills', label: copy.skills })
  return items.slice(0, 6)
}

export function listJoin(items: string[], locale: string) {
  if (items.length <= 1) return items[0] ?? ''
  if (locale === 'ru') return `${items.slice(0, -1).join(', ')} и ${items.at(-1)}`
  if (locale === 'kz') return `${items.slice(0, -1).join(', ')} және ${items.at(-1)}`
  return `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`
}

export function careerTitles(careers: Career[], t: Messages) {
  return careers.map((career) => t.careers[career.id]?.title).filter(Boolean) as string[]
}
