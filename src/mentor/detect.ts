import { CAREERS } from '../careers'
import { careersEn } from '../i18n/careersEn'
import { careersKz } from '../i18n/careersKz'
import { careersRu } from '../i18n/careersRu'
import { exploreEn } from '../i18n/exploreEn'
import { exploreKz } from '../i18n/exploreKz'
import { exploreRu } from '../i18n/exploreRu'
import type { Career, CareerFieldId } from '../careers/types'
import { CAREER_FIELD_IDS } from '../careers/types'

export function normalizeMentorText(value: string) {
  return value
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[“”"«».,!?():;/\\\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const TITLE_INDEX: { id: string; title: string }[] = [careersEn, careersRu, careersKz].flatMap((dict) =>
  Object.entries(dict).map(([id, copy]) => ({ id, title: normalizeMentorText(copy.title) })),
)

const FIELD_INDEX: { id: CareerFieldId; label: string }[] = [exploreEn, exploreRu, exploreKz].flatMap((dict) =>
  CAREER_FIELD_IDS.map((id) => ({ id, label: normalizeMentorText(dict.fields[id]) })),
)

const STOP = new Set([
  'what',
  'which',
  'why',
  'how',
  'about',
  'with',
  'these',
  'those',
  'that',
  'this',
  'from',
  'your',
  'mine',
  'should',
  'would',
  'could',
  'career',
  'careers',
  'match',
  'matches',
  'profile',
  'please',
  'tell',
  'more',
  'next',
  'some',
  'them',
  'they',
  'have',
  'does',
  'did',
  'the',
  'and',
  'for',
  'are',
  'was',
  'good',
  'best',
  'fit',
  'my',
  'me',
  'i',
  'a',
  'an',
  'to',
  'of',
  'in',
  'on',
  'or',
  'is',
  'it',
  'do',
  'can',
  'что',
  'какие',
  'какой',
  'какая',
  'почему',
  'зачем',
  'как',
  'про',
  'эти',
  'этот',
  'эта',
  'мои',
  'мне',
  'моя',
  'мой',
  'профессия',
  'профессии',
  'карьера',
  'сравни',
  'сравнить',
  'расскажи',
  'почему',
  'неге',
  'қандай',
  'қалай',
  'маған',
  'менің',
  'мамандық',
  'мамандықтар',
  'салыстыр',
  'айтып',
  'бер',
])

function careerById(id: string) {
  return CAREERS.find((entry) => entry.id === id)
}

export function findCareersInText(message: string): Career[] {
  const haystack = normalizeMentorText(message)
  if (!haystack) return []
  const found: Career[] = []
  const seen = new Set<string>()

  const push = (career: Career | undefined) => {
    if (!career || seen.has(career.id)) return
    seen.add(career.id)
    found.push(career)
  }

  const ranked = TITLE_INDEX.filter((item) => item.title.length >= 4 && haystack.includes(item.title)).sort(
    (a, b) => b.title.length - a.title.length,
  )
  for (const item of ranked) {
    push(careerById(item.id))
    if (found.length >= 3) return found
  }

  const tokens = haystack.split(' ').filter((token) => token.length >= 4 && !STOP.has(token))
  const scored: { career: Career; score: number }[] = []
  for (const career of CAREERS) {
    const titles = TITLE_INDEX.filter((item) => item.id === career.id).map((item) => item.title)
    let score = 0
    for (const token of tokens) {
      if (titles.some((title) => title.includes(token) || (token.length >= 6 && token.includes(title)))) score += 2
    }
    if (score > 0) scored.push({ career, score })
  }
  scored.sort((a, b) => b.score - a.score)
  for (const item of scored) {
    push(item.career)
    if (found.length >= 3) return found
  }

  return found
}

export function findFieldsInText(message: string): CareerFieldId[] {
  const haystack = normalizeMentorText(message)
  if (!haystack) return []
  const found: CareerFieldId[] = []
  const seen = new Set<CareerFieldId>()
  const ranked = FIELD_INDEX.filter((item) => item.label.length >= 4 && haystack.includes(item.label)).sort(
    (a, b) => b.label.length - a.label.length,
  )
  for (const item of ranked) {
    if (seen.has(item.id)) continue
    seen.add(item.id)
    found.push(item.id)
  }
  const tokens = haystack.split(' ').filter((token) => token.length >= 5 && !STOP.has(token))
  for (const token of tokens) {
    for (const item of FIELD_INDEX) {
      if (item.label.includes(token) && !seen.has(item.id)) {
        seen.add(item.id)
        found.push(item.id)
      }
    }
  }
  return found.slice(0, 2)
}
