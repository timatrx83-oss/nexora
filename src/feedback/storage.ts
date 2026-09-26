import type { Locale } from '../i18n/locales'

export const FEEDBACK_STORAGE_KEY = 'nexora.feedback.entries'
export const FEEDBACK_SCHEMA_VERSION = 1 as const
const TEXT_LIMIT = 2000

export const RATING_KEYS = [
  'overallExperience',
  'easeOfUse',
  'visualDesign',
  'assessmentExperience',
  'likelihoodToUseAgain',
] as const

export type RatingKey = (typeof RATING_KEYS)[number]
export type StarRatingValue = 1 | 2 | 3 | 4 | 5
export type RecommendationAnswer = 'yes' | 'maybe' | 'no'

export type FeedbackRatings = Record<RatingKey, StarRatingValue>

export type FeedbackEntry = {
  schemaVersion: typeof FEEDBACK_SCHEMA_VERSION
  id: string
  submittedAt: string
  locale: Locale
  ratings: FeedbackRatings
  likedMost: string
  improve: string
  recommendation: RecommendationAnswer | null
}

export type FeedbackDraft = {
  locale: Locale
  ratings: FeedbackRatings
  likedMost: string
  improve: string
  recommendation: RecommendationAnswer | null
}

export function ratingsAreComplete(
  ratings: Record<RatingKey, StarRatingValue | null>,
): ratings is FeedbackRatings {
  return RATING_KEYS.every((key) => ratings[key] !== null)
}

function cleanText(value: string) {
  return value.trim().slice(0, TEXT_LIMIT)
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `fb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

function readRawList(): unknown[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveFeedback(draft: FeedbackDraft): boolean {
  const entry: FeedbackEntry = {
    schemaVersion: FEEDBACK_SCHEMA_VERSION,
    id: createId(),
    submittedAt: new Date().toISOString(),
    locale: draft.locale,
    ratings: draft.ratings,
    likedMost: cleanText(draft.likedMost),
    improve: cleanText(draft.improve),
    recommendation: draft.recommendation,
  }

  const entries = readRawList()
  entries.push(entry)

  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(entries))
    return true
  } catch {
    return false
  }
}
