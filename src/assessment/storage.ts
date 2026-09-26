import type { AssessmentDraft, AssessmentResult, StrengthThemeId, StrengthThemeLevel } from './types'
import {
  ASSESSMENT_SCHEMA,
  DIRECTION_IDS,
  INTEREST_IDS,
  SKILL_IDS,
  STRENGTH_IDS,
  STRENGTH_THEME_IDS,
  WORK_STYLE_IDS,
} from './types'
import {
  buildResult,
  deriveStrengthThemes,
  emptyInterestScores,
  emptyThemeScores,
  isSkillsComplete,
  knownIds,
} from './score'

export const RESULT_KEY = 'nexora.assessment.result'
export const DRAFT_KEY = 'nexora.assessment.draft'

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

function readThemeLevels(
  raw: AssessmentResult['strengthThemes'] | undefined,
  strengths: AssessmentResult['strengths'],
): Record<StrengthThemeId, StrengthThemeLevel> {
  const fallback = deriveStrengthThemes(strengths)
  if (!raw || typeof raw !== 'object') return fallback
  const next = { ...fallback }
  for (const id of STRENGTH_THEME_IDS) {
    const level = raw[id]
    if (level === 'high' || level === 'medium' || level === 'low') next[id] = level
    else if (!(id in next)) next[id] = 'low'
  }
  return next
}

export function getStoredResult(): AssessmentResult | null {
  const value = readJson<AssessmentResult>(RESULT_KEY)
  if (!value || value.version !== 1 || !value.skills) return null
  const storedSkills = value.answers?.skills ?? value.skills
  const questions = value.answers?.questions
  if (questions && isSkillsComplete(storedSkills)) {
    const rebuilt = buildResult(questions, storedSkills as Record<(typeof SKILL_IDS)[number], number>)
    return { ...rebuilt, completedAt: value.completedAt }
  }
  const strengths = knownIds(value.strengths, STRENGTH_IDS)
  return {
    ...value,
    interests: knownIds(value.interests, INTEREST_IDS),
    strengths,
    strengthThemes: readThemeLevels(value.strengthThemes, strengths),
    workStyle: knownIds(value.workStyle, WORK_STYLE_IDS),
    skillsToDevelop: knownIds(value.skillsToDevelop, SKILL_IDS),
    directions: knownIds(value.directions, DIRECTION_IDS),
    signals: value.signals
      ? {
          interests: { ...emptyInterestSafe(value.signals.interests) },
          themes: { ...emptyThemeScores(), ...filterThemeScores(value.signals.themes) },
        }
      : undefined,
  }
}

function emptyInterestSafe(raw: Partial<Record<string, number>> | undefined) {
  const next = emptyInterestScores()
  if (!raw) return next
  for (const id of INTEREST_IDS) {
    const value = raw[id]
    if (typeof value === 'number' && Number.isFinite(value)) next[id] = value
  }
  return next
}

function filterThemeScores(raw: Partial<Record<string, number>> | undefined) {
  const next = emptyThemeScores()
  if (!raw) return next
  for (const id of STRENGTH_THEME_IDS) {
    const value = raw[id]
    if (typeof value === 'number' && Number.isFinite(value)) next[id] = value
  }
  return next
}

export const ASSESSMENT_CHANGED_EVENT = 'nexora:assessment-changed'

function notifyAssessmentChanged() {
  try {
    window.dispatchEvent(new Event(ASSESSMENT_CHANGED_EVENT))
  } catch {
    /* ignore */
  }
}

export function saveResult(result: AssessmentResult) {
  writeJson(RESULT_KEY, result)
  notifyAssessmentChanged()
}

export function getStoredDraft(): AssessmentDraft | null {
  const draft = readJson<AssessmentDraft>(DRAFT_KEY)
  if (!draft) return null
  if (draft.contentVersion !== ASSESSMENT_SCHEMA) return null
  return draft
}

export function saveDraft(draft: AssessmentDraft) {
  writeJson(DRAFT_KEY, draft)
}

export function clearAssessment() {
  try {
    localStorage.removeItem(RESULT_KEY)
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* ignore */
  }
  notifyAssessmentChanged()
}

export function subscribeToAssessmentResult(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === RESULT_KEY || event.key === DRAFT_KEY || event.key === null) {
      onChange()
    }
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener(ASSESSMENT_CHANGED_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(ASSESSMENT_CHANGED_EVENT, onChange)
  }
}

export const emptyDraft = (): AssessmentDraft => ({
  phase: 'intro',
  questionIndex: 0,
  answers: {},
  skills: {},
  result: null,
  contentVersion: ASSESSMENT_SCHEMA,
})
