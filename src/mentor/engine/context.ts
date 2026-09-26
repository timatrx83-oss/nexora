import { themesInBand } from '../../assessment/score'
import type { AssessmentResult, SkillId, StrengthThemeId, WorkStyleId } from '../../assessment/types'
import { CAREERS, careerMatch, matchCareers } from '../../careers'
import { formatMatchReason } from '../../careers/reason'
import type { Career, CareerSkillTag, CareerWorkTag } from '../../careers/types'
import type { Messages } from '../../i18n/en'
import { listJoin } from '../starters'
import type { MentorSnapshot } from '../snapshot'
import type { MentorRequest } from '../types'

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

export type MentorCareerFact = {
  career: Career
  title: string
  field: string
  level: 'strong' | 'good' | 'low'
  reason: string
  sharedInterests: string[]
  sharedThemes: string[]
  sharedWork: string[]
  skillTags: string[]
}

export type MentorEngineContext = {
  t: Messages
  locale: MentorRequest['locale']
  snapshot: MentorSnapshot
  assessment: AssessmentResult | null
  interests: string[]
  stronger: StrengthThemeId[]
  developing: StrengthThemeId[]
  explore: StrengthThemeId[]
  strongerNames: string[]
  developingNames: string[]
  exploreNames: string[]
  workStyle: string[]
  workIds: WorkStyleId[]
  skillHigh: string[]
  skillGrow: string[]
  strong: MentorCareerFact[]
  good: MentorCareerFact[]
  low: MentorCareerFact[]
  saved: MentorCareerFact[]
}

function themeIds(assessment: AssessmentResult, band: 'high' | 'medium' | 'low') {
  return themesInBand(assessment.strengthThemes, band, assessment.signals?.themes).map((item) => item.id)
}

function fact(career: Career, assessment: AssessmentResult | null, t: Messages): MentorCareerFact {
  const copy = t.careers[career.id]
  const match = assessment ? careerMatch(career, assessment) : null
  const highThemes = assessment ? themeIds(assessment, 'high') : []
  const interestHits = assessment
    ? career.interests.filter((id) => assessment.interests.includes(id)).map((id) => t.assessment.interestNames[id])
    : []
  const themeHits = career.themes.filter((id) => highThemes.includes(id)).map((id) => t.assessment.themeNames[id])
  const workIds = assessment?.workStyle ?? []
  const workHits = (career.workStyleTags ?? []).flatMap((tag) => WORK_TAG_TO_STYLE[tag] ?? [])
  const uniqueWork = workIds.filter((id) => workHits.includes(id)).map((id) => t.assessment.workStyleNames[id])
  return {
    career,
    title: copy?.title ?? career.id,
    field: t.explore.fields[career.field],
    level: match?.level ?? 'low',
    reason: match ? formatMatchReason(match.reason, t) : '',
    sharedInterests: interestHits,
    sharedThemes: themeHits,
    sharedWork: uniqueWork,
    skillTags: career.skillTags.map((tag) => t.explore.skillTags[tag]),
  }
}

export function joinList(items: string[], locale: MentorRequest['locale']) {
  return listJoin(items.filter(Boolean), locale)
}

export function buildEngineContext(snapshot: MentorSnapshot, t: Messages, locale: MentorRequest['locale']): MentorEngineContext {
  const assessment = snapshot.assessment
  const ranked = assessment ? matchCareers(CAREERS, assessment) : []
  const toFact = (career: Career) => fact(career, assessment, t)

  const pack = (level: 'strong' | 'good' | 'low', limit: number) =>
    ranked
      .filter((item) => item.match.level === level)
      .slice(0, limit)
      .map((item) => toFact(item.career))

  const stronger = assessment ? themeIds(assessment, 'high') : []
  const developing = assessment ? themeIds(assessment, 'medium') : []
  const explore = assessment ? themeIds(assessment, 'low') : []

  const skillEntries = assessment
    ? (Object.entries(assessment.skills) as [SkillId, number][]).sort((a, b) => b[1] - a[1])
    : []

  return {
    t,
    locale,
    snapshot,
    assessment,
    interests: assessment?.interests.map((id) => t.assessment.interestNames[id]) ?? [],
    stronger,
    developing,
    explore,
    strongerNames: stronger.map((id) => t.assessment.themeNames[id]),
    developingNames: developing.map((id) => t.assessment.themeNames[id]),
    exploreNames: explore.map((id) => t.assessment.themeNames[id]),
    workStyle: assessment?.workStyle.map((id) => t.assessment.workStyleNames[id]) ?? [],
    workIds: assessment?.workStyle ?? [],
    skillHigh: skillEntries.filter(([, value]) => value >= 4).map(([id]) => t.assessment.skillNames[id]),
    skillGrow: skillEntries
      .filter(([, value]) => value <= 3)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([id]) => t.assessment.skillNames[id]),
    strong: pack('strong', 6),
    good: pack('good', 5),
    low: pack('low', 4),
    saved: snapshot.savedCareers.map(toFact),
  }
}

export function overlapScore(item: MentorCareerFact) {
  return item.sharedInterests.length * 2 + item.sharedThemes.length + (item.level === 'strong' ? 3 : item.level === 'good' ? 1 : 0)
}

export function namedCareerFacts(careers: Career[], ctx: MentorEngineContext) {
  return careers.map((career) => fact(career, ctx.assessment, ctx.t))
}

export function skillTagsFor(careers: Career[], t: Messages, limit = 6) {
  const seen = new Set<string>()
  const names: string[] = []
  for (const career of careers) {
    for (const tag of career.skillTags as CareerSkillTag[]) {
      const name = t.explore.skillTags[tag]
      if (seen.has(name)) continue
      seen.add(name)
      names.push(name)
      if (names.length >= limit) return names
    }
  }
  return names
}
