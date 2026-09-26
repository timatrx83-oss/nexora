import { matchCareers } from '../careers'
import { formatMatchReason } from '../careers/reason'
import { CAREERS } from '../careers/catalog'
import { themesInBand } from '../assessment/score'
import type { AssessmentResult } from '../assessment/types'
import type { Messages } from '../i18n/en'
import type { Locale } from '../i18n/locales'

export type MentorAiCareer = {
  id: string
  title: string
  field: string
  level?: 'strong' | 'good' | 'low'
  reason?: string
}

export type MentorAiProfile = {
  assessmentCompleted: boolean
  locale: Locale
  interests: string[]
  strengths: {
    stronger: string[]
    developing: string[]
    explore: string[]
  }
  workStyle: string[]
  skills: { name: string; rating: number }[]
  matchedCareers: {
    strong: MentorAiCareer[]
    good: MentorAiCareer[]
    low: MentorAiCareer[]
  }
  savedCareers: MentorAiCareer[]
}

export function buildMentorAiProfile(
  assessment: AssessmentResult | null,
  savedIds: string[],
  t: Messages,
  locale: Locale,
): MentorAiProfile {
  const ranked = assessment ? matchCareers(CAREERS, assessment) : []
  const pack = (level: 'strong' | 'good' | 'low', limit: number): MentorAiCareer[] =>
    ranked
      .filter((item) => item.match.level === level)
      .slice(0, limit)
      .map((item) => ({
        id: item.career.id,
        title: t.careers[item.career.id]?.title ?? item.career.id,
        field: t.explore.fields[item.career.field],
        level,
        reason: formatMatchReason(item.match.reason, t),
      }))

  const savedCareers = savedIds.slice(0, 8).flatMap((id) => {
    const career = CAREERS.find((item) => item.id === id)
    const copy = t.careers[id]
    if (!career || !copy) return []
    const match = ranked.find((item) => item.career.id === id)?.match
    return [
      {
        id,
        title: copy.title,
        field: t.explore.fields[career.field],
        level: match?.level,
        reason: match ? formatMatchReason(match.reason, t) : undefined,
      } satisfies MentorAiCareer,
    ]
  })

  if (!assessment) {
    return {
      assessmentCompleted: false,
      locale,
      interests: [],
      strengths: { stronger: [], developing: [], explore: [] },
      workStyle: [],
      skills: [],
      matchedCareers: { strong: [], good: [], low: [] },
      savedCareers,
    }
  }

  const scores = assessment.signals?.themes

  return {
    assessmentCompleted: true,
    locale,
    interests: assessment.interests.map((id) => t.assessment.interestNames[id]),
    strengths: {
      stronger: themesInBand(assessment.strengthThemes, 'high', scores).map((item) => t.assessment.themeNames[item.id]),
      developing: themesInBand(assessment.strengthThemes, 'medium', scores).map(
        (item) => t.assessment.themeNames[item.id],
      ),
      explore: themesInBand(assessment.strengthThemes, 'low', scores)
        .slice(0, 6)
        .map((item) => t.assessment.themeNames[item.id]),
    },
    workStyle: assessment.workStyle.map((id) => t.assessment.workStyleNames[id]),
    skills: (Object.entries(assessment.skills) as [keyof typeof t.assessment.skillNames, number][]).map(
      ([id, rating]) => ({ name: t.assessment.skillNames[id], rating }),
    ),
    matchedCareers: {
      strong: pack('strong', 6),
      good: pack('good', 5),
      low: pack('low', 4),
    },
    savedCareers,
  }
}
