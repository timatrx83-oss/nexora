import {
  DIRECTION_IDS,
  INTEREST_IDS,
  SKILL_IDS,
  WORK_STYLE_IDS,
  type AssessmentResult,
  type DirectionId,
  type InterestId,
  type SkillId,
  type WorkStyleId,
} from '../assessment/types'

export type WorkAxisId = 'social' | 'structure' | 'pace' | 'role'

export type WorkAxisLean = 'left' | 'right' | 'balanced'

export type WorkAxisPreference = {
  id: WorkAxisId
  lean: WorkAxisLean
}

export type ProfileSnapshot = {
  source: 'assessment'
  completedAt: string
  interests: InterestId[]
  strengths: SkillId[]
  workStyle: WorkStyleId[]
  skills: Partial<Record<SkillId, number>>
  strongestSkills: SkillId[]
  skillsToDevelop: SkillId[]
  directions: DirectionId[]
  workAxes: WorkAxisPreference[]
}

const WORK_AXIS_MAP: { id: WorkAxisId; left: WorkStyleId; right: WorkStyleId }[] = [
  { id: 'social', left: 'independent', right: 'collaborative' },
  { id: 'structure', left: 'projectOriented', right: 'flexible' },
  { id: 'pace', left: 'projectOriented', right: 'curious' },
  { id: 'role', left: 'leading', right: 'collaborative' },
]

function known<T extends string>(ids: readonly string[] | undefined, pool: readonly T[]): T[] {
  const set = new Set<string>(pool)
  return (ids ?? []).filter((id): id is T => set.has(id))
}

function clampSkill(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return null
  return Math.min(5, Math.max(1, Math.round(value)))
}

function leanFor(styles: WorkStyleId[], left: WorkStyleId, right: WorkStyleId): WorkAxisLean | null {
  const hasLeft = styles.includes(left)
  const hasRight = styles.includes(right)
  if (hasLeft && hasRight) return 'balanced'
  if (hasLeft) return 'left'
  if (hasRight) return 'right'
  return null
}

export function profileFromAssessment(result: AssessmentResult): ProfileSnapshot {
  const interests = known(result.interests, INTEREST_IDS)
  const strengths = known(result.strengths, SKILL_IDS)
  const workStyle = known(result.workStyle, WORK_STYLE_IDS)
  const skillsToDevelop = known(result.skillsToDevelop, SKILL_IDS)
  const directions = known(result.directions, DIRECTION_IDS)

  const skills: Partial<Record<SkillId, number>> = {}
  for (const id of SKILL_IDS) {
    const value = clampSkill(result.skills?.[id])
    if (value !== null) skills[id] = value
  }

  const ranked = SKILL_IDS.filter((id) => typeof skills[id] === 'number').sort(
    (a, b) => (skills[b] ?? 0) - (skills[a] ?? 0),
  )
  const strongestSkills = ranked.filter((id) => (skills[id] ?? 0) >= 4).slice(0, 3)
  const topSkills = strongestSkills.length > 0 ? strongestSkills : ranked.slice(0, 3)

  const workAxes = WORK_AXIS_MAP.flatMap((axis) => {
    const lean = leanFor(workStyle, axis.left, axis.right)
    return lean ? [{ id: axis.id, lean }] : []
  })

  return {
    source: 'assessment',
    completedAt: result.completedAt,
    interests,
    strengths,
    workStyle,
    skills,
    strongestSkills: topSkills,
    skillsToDevelop,
    directions,
    workAxes,
  }
}
