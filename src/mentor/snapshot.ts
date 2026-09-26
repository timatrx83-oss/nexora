import type { AssessmentResult } from '../assessment/types'
import { featuredThemes } from '../assessment/score'
import { CAREERS, careerMatch, getCareer } from '../careers'
import type { Career } from '../careers/types'

export type MentorSnapshot = {
  assessment: AssessmentResult | null
  savedIds: string[]
  savedCareers: Career[]
  matches: { career: Career; level: 'strong' | 'good' }[]
}

export function buildMentorSnapshot(
  assessment: AssessmentResult | null,
  savedIds: string[],
): MentorSnapshot {
  const savedCareers = savedIds.map((id) => getCareer(id)).filter((item): item is Career => Boolean(item))
  const matches = assessment
    ? CAREERS.map((career) => ({ career, match: careerMatch(career, assessment) }))
        .filter((item) => item.match.level === 'strong' || item.match.level === 'good')
        .sort((a, b) => b.match.score - a.match.score)
        .slice(0, 8)
        .map((item) => ({ career: item.career, level: item.match.level as 'strong' | 'good' }))
    : []

  return { assessment, savedIds, savedCareers, matches }
}

export function highThemeIds(assessment: AssessmentResult) {
  return featuredThemes(assessment.strengthThemes, assessment.signals?.themes)
    .filter((item) => item.level === 'high')
    .map((item) => item.id)
}

export function strongSkills(assessment: AssessmentResult) {
  return (Object.entries(assessment.skills) as [keyof AssessmentResult['skills'], number][])
    .filter(([, value]) => value >= 4)
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id)
    .slice(0, 4)
}
