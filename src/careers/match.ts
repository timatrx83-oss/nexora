import type { AssessmentResult, InterestId, SkillId, StrengthThemeId, StrengthThemeLevel, WorkStyleId } from '../assessment/types'
import type { Career, CareerSkillTag, CareerWorkTag } from './types'
import { CAREER_THEMES } from './themes'

export type CareerRelevance = 'strong' | 'good' | 'low' | null

export type MatchReasonId =
  | 'strongInterestTheme'
  | 'strongInterests'
  | 'strongInterest'
  | 'goodThemeInterest'
  | 'goodInterest'
  | 'goodWork'
  | 'lowSkill'
  | 'lowInterest'

export type MatchReason = {
  id: MatchReasonId
  interest?: InterestId
  interestB?: InterestId
  theme?: StrengthThemeId
  skill?: SkillId
  field?: Career['field']
}

export type CareerMatch = {
  level: Exclude<CareerRelevance, null>
  score: number
  interestHits: number
  reason: MatchReason
}

const GENERIC_STRENGTHS = new Set(['communication', 'analyticalThinking', 'adaptability'])
const GENERIC_THEMES = new Set<StrengthThemeId>(['learner', 'adaptable'])
const GENERIC_SKILL_TAGS = new Set<CareerSkillTag>(['communication', 'analyticalThinking', 'collaboration'])

const SKILL_TAG_TO_SKILL: Partial<Record<CareerSkillTag, SkillId>> = {
  communication: 'communication',
  creativity: 'creativity',
  leadership: 'leadership',
  analyticalThinking: 'analyticalThinking',
  digital: 'digitalSkills',
}

const WORK_TAG_TO_STYLE: Record<CareerWorkTag, WorkStyleId[]> = {
  independent: ['independent'],
  collaborative: ['collaborative'],
  curious: ['curious'],
  projectOriented: ['projectOriented'],
  leading: ['leading'],
  flexible: ['flexible'],
  peopleFocused: ['collaborative'],
  researchFocused: ['curious'],
  creative: ['curious', 'flexible'],
  highResponsibility: ['leading'],
  structured: ['projectOriented'],
}

function careerThemes(career: Career): StrengthThemeId[] {
  return career.themes.length > 0 ? career.themes : (CAREER_THEMES[career.id] ?? [])
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value))
}

function interestWeight(result: AssessmentResult, id: InterestId) {
  const fromSignals = result.signals?.interests[id]
  if (typeof fromSignals === 'number' && fromSignals > 0) return fromSignals
  const rank = result.interests.indexOf(id)
  if (rank === -1) return 0
  return 4 - rank
}

function interestScore(career: Career, result: AssessmentResult) {
  const tags = career.interests
  if (tags.length === 0) return { score: 0, hits: 0, shared: [] as InterestId[] }
  const shared = tags.filter((id) => result.interests.includes(id) || interestWeight(result, id) > 0)
  const rankedHits = tags.filter((id) => result.interests.includes(id))
  const maxUser = Math.max(1, ...result.interests.map((id) => interestWeight(result, id)), 1)
  const mean = tags.reduce((sum, id) => sum + interestWeight(result, id), 0) / tags.length / maxUser
  const hitRatio = rankedHits.length / tags.length
  return { score: clamp01(mean * 0.55 + hitRatio * 0.45), hits: rankedHits.length, shared }
}

function themeScore(career: Career, themes: Record<StrengthThemeId, StrengthThemeLevel>) {
  const related = careerThemes(career)
  if (related.length === 0) return { score: 0, high: [] as StrengthThemeId[], specificHigh: 0 }
  let points = 0
  const high: StrengthThemeId[] = []
  for (const id of related) {
    const level = themes[id] ?? 'low'
    const generic = GENERIC_THEMES.has(id) ? 0.35 : 1
    if (level === 'high') {
      points += 1 * generic
      high.push(id)
    } else if (level === 'medium') {
      points += 0.45 * generic
    }
  }
  const specificHigh = high.filter((id) => !GENERIC_THEMES.has(id)).length
  return { score: clamp01(points / related.length), high, specificHigh }
}

function workScore(career: Career, workStyle: WorkStyleId[]) {
  const tags = career.workStyleTags ?? []
  if (tags.length === 0 || workStyle.length === 0) return { score: 0, hit: false }
  const mapped = new Set(tags.flatMap((tag) => WORK_TAG_TO_STYLE[tag] ?? []))
  const hits = workStyle.filter((id) => mapped.has(id)).length
  return { score: clamp01(hits / Math.min(2, workStyle.length)), hit: hits > 0 }
}

function skillScore(career: Career, skills: Record<SkillId, number>) {
  const tags = career.skillTags
  if (tags.length === 0) return { score: 0, genericOnly: true, best: null as SkillId | null }
  let total = 0
  let generic = 0
  let specific = 0
  let best: SkillId | null = null
  let bestValue = 0
  for (const tag of tags) {
    const skill = SKILL_TAG_TO_SKILL[tag]
    const value = skill ? (skills[skill] ?? 0) / 5 : 0
    const weight = GENERIC_SKILL_TAGS.has(tag) ? 0.25 : 1
    total += value * weight
    if (GENERIC_SKILL_TAGS.has(tag)) generic += 1
    else specific += 1
    if (skill && value >= bestValue && !GENERIC_SKILL_TAGS.has(tag)) {
      best = skill
      bestValue = value
    } else if (skill && !best && value >= bestValue) {
      best = skill
      bestValue = value
    }
  }
  return {
    score: clamp01(total / tags.length),
    genericOnly: specific === 0 && generic > 0,
    best,
  }
}

function pickReason(input: {
  level: CareerMatch['level']
  interestHits: number
  sharedInterests: InterestId[]
  highThemes: StrengthThemeId[]
  workHit: boolean
  skill: SkillId | null
  field: Career['field']
}): MatchReason {
  const [interest, interestB] = input.sharedInterests
  const theme = input.highThemes.find((id) => !GENERIC_THEMES.has(id)) ?? input.highThemes[0]

  if (input.level === 'strong' && theme && interest) {
    return { id: 'strongInterestTheme', theme, interest, field: input.field }
  }
  if (input.level === 'strong' && interest && interestB) {
    return { id: 'strongInterests', interest, interestB, field: input.field }
  }
  if (input.level === 'strong' && interest) {
    return { id: 'strongInterest', interest, field: input.field }
  }
  if (input.level === 'good' && theme && input.interestHits >= 1) {
    return { id: 'goodThemeInterest', theme, interest, field: input.field }
  }
  if (input.level === 'good' && interest) {
    return { id: 'goodInterest', interest, field: input.field }
  }
  if (input.level === 'good' && input.workHit) {
    return { id: 'goodWork', theme, field: input.field }
  }
  if (input.skill && input.interestHits === 0) {
    return { id: 'lowSkill', skill: input.skill, field: input.field, interest }
  }
  return { id: 'lowInterest', field: input.field, interest, theme }
}

export function careerMatch(career: Career, result: AssessmentResult): CareerMatch {
  const interests = interestScore(career, result)
  const themes = themeScore(career, result.strengthThemes)
  const work = workScore(career, result.workStyle)
  const skills = skillScore(career, result.skills)

  const specificStrengthHits = career.strengths.filter(
    (id) => result.strengths.includes(id) && !GENERIC_STRENGTHS.has(id),
  ).length

  const combined = clamp01(
    interests.score * 0.5 +
      themes.score * 0.25 +
      work.score * 0.15 +
      skills.score * 0.1 +
      specificStrengthHits * 0.02,
  )

  let level: CareerMatch['level'] = 'low'
  const interestGate = interests.hits >= 1 && interests.score >= 0.34
  const strongInterest = interests.hits >= 2 || (interests.hits >= 1 && interests.score >= 0.55)
  const strongThemes = themes.specificHigh >= 1
  if (interestGate && strongInterest && (strongThemes || interests.hits >= 2) && combined >= 0.42) {
    level = 'strong'
  } else if (interests.hits >= 1 && combined >= 0.28) {
    level = 'good'
  } else if (interests.score >= 0.22 && combined >= 0.32) {
    level = 'good'
  }

  const reason = pickReason({
    level,
    interestHits: interests.hits,
    sharedInterests: result.interests.filter((id) => career.interests.includes(id)),
    highThemes: themes.high,
    workHit: work.hit,
    skill: skills.best,
    field: career.field,
  })

  return {
    level,
    score: combined,
    interestHits: interests.hits,
    reason,
  }
}

export function careerRelevance(career: Career, result: AssessmentResult | null): CareerRelevance {
  if (!result) return null
  return careerMatch(career, result).level
}

export function matchCareers(careers: Career[], result: AssessmentResult) {
  return careers
    .map((career) => ({ career, match: careerMatch(career, result) }))
    .sort((a, b) => b.match.score - a.match.score)
}
