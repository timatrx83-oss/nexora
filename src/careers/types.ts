import type { InterestId, StrengthId, StrengthThemeId } from '../assessment/types'

export const CAREER_FIELD_IDS = [
  'tech',
  'business',
  'science',
  'biology',
  'health',
  'environment',
  'engineering',
  'psychology',
  'creative',
  'media',
  'finance',
  'law',
  'education',
  'architecture',
  'agriculture',
  'space',
  'animals',
] as const

export type CareerFieldId = (typeof CAREER_FIELD_IDS)[number]

export const CAREER_SKILL_TAGS = [
  'analyticalThinking',
  'research',
  'observation',
  'communication',
  'creativity',
  'digital',
  'leadership',
  'problemSolving',
  'empathy',
  'writing',
  'design',
  'planning',
  'fieldwork',
  'labwork',
  'teaching',
  'policy',
  'numbers',
  'systems',
  'care',
  'collaboration',
] as const

export type CareerSkillTag = (typeof CAREER_SKILL_TAGS)[number]

export const CAREER_WORK_TAGS = [
  'independent',
  'collaborative',
  'curious',
  'projectOriented',
  'leading',
  'flexible',
  'peopleFocused',
  'researchFocused',
  'creative',
  'highResponsibility',
  'structured',
] as const

export type CareerWorkTag = (typeof CAREER_WORK_TAGS)[number]

export type Career = {
  id: string
  field: CareerFieldId
  interests: InterestId[]
  strengths: StrengthId[]
  themes: StrengthThemeId[]
  skillTags: CareerSkillTag[]
  workStyleTags: CareerWorkTag[]
  related: string[]
}

/** Matching aliases: interests = interestTags, themes = strengthTags. */
