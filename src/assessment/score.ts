import { QUESTIONS } from './questions'
import {
  DIRECTION_IDS,
  INTEREST_IDS,
  SKILL_IDS,
  STRENGTH_IDS,
  STRENGTH_THEME_IDS,
  WORK_STYLE_IDS,
  type AssessmentResult,
  type DirectionId,
  type InterestId,
  type SkillId,
  type StrengthId,
  type StrengthThemeId,
  type StrengthThemeLevel,
  type WorkStyleId,
} from './types'

function bump<T extends string>(map: Record<T, number>, keys: T[] | undefined, amount = 1) {
  if (!keys) return
  for (const key of keys) {
    map[key] = (map[key] ?? 0) + amount
  }
}

function addScore<T extends string>(map: Record<T, number>, key: T, amount: number) {
  if (amount === 0) return
  map[key] = (map[key] ?? 0) + amount
}

function topKeys<T extends string>(map: Record<T, number>, limit: number, pool: readonly T[]): T[] {
  return [...pool]
    .filter((key) => (map[key] ?? 0) > 0)
    .sort((a, b) => (map[b] ?? 0) - (map[a] ?? 0) || pool.indexOf(a) - pool.indexOf(b))
    .slice(0, limit)
}

export function isSkillsComplete(skills: Partial<Record<SkillId, number>>) {
  return SKILL_IDS.every((id) => typeof skills[id] === 'number')
}

export function knownIds<T extends string>(ids: readonly string[] | undefined, pool: readonly T[]): T[] {
  const set = new Set<string>(pool)
  return (ids ?? []).filter((id): id is T => set.has(id))
}

const STRENGTH_TO_THEMES: Partial<Record<StrengthId, StrengthThemeId[]>> = {
  curiosity: ['researcher'],
  creativity: ['creator'],
  analyticalThinking: ['criticalThinker'],
  problemSolving: ['problemSolver'],
  organization: ['organizer'],
  leadership: ['leader'],
  teamwork: ['connector'],
  communication: ['communicator'],
  empathy: ['empath'],
  initiative: ['achiever'],
  practicalThinking: ['practicalThinker'],
  adaptability: ['adaptable'],
}

/** Secondary theme signal from chosen strengths — never auto-boosts Impact or generic positivity. */
const STRENGTH_THEME_BLEND: Partial<Record<StrengthId, Partial<Record<StrengthThemeId, number>>>> = {
  curiosity: { researcher: 0.32, learner: 0.28 },
  creativity: { creator: 0.3 },
  analyticalThinking: { criticalThinker: 0.3, strategicThinker: 0.12 },
  problemSolving: { problemSolver: 0.32 },
  organization: { organizer: 0.32, strategicThinker: 0.14 },
  leadership: { leader: 0.32 },
  teamwork: { connector: 0.28 },
  communication: { communicator: 0.3 },
  empathy: { empath: 0.32 },
  initiative: { achiever: 0.26 },
  practicalThinking: { practicalThinker: 0.32 },
  adaptability: { adaptable: 0.3 },
}

/** Light interest → theme echo so unused themes still get an answer-based score. */
const INTEREST_THEME_BLEND: Partial<Record<InterestId, Partial<Record<StrengthThemeId, number>>>> = {
  creativity: { creator: 0.18 },
  media: { creator: 0.1, communicator: 0.1 },
  people: { connector: 0.14, empath: 0.1 },
  psychology: { empath: 0.14 },
  leadership: { leader: 0.16 },
  business: { leader: 0.08, achiever: 0.1 },
  technology: { practicalThinker: 0.12, problemSolver: 0.08 },
  engineering: { practicalThinker: 0.14, problemSolver: 0.1 },
  product: { creator: 0.08, practicalThinker: 0.08 },
  data: { criticalThinker: 0.16, researcher: 0.08 },
  science: { researcher: 0.16, learner: 0.08 },
  space: { researcher: 0.1, learner: 0.06 },
  biology: { researcher: 0.12 },
  education: { learner: 0.2, communicator: 0.08 },
  health: { impact: 0.16, empath: 0.08 },
  society: { impact: 0.14 },
  nature: { impact: 0.06, practicalThinker: 0.06 },
  problemSolving: { problemSolver: 0.14 },
  finance: { organizer: 0.08, criticalThinker: 0.06 },
  animals: { empath: 0.08, practicalThinker: 0.06 },
}

export function emptyThemeScores() {
  return Object.fromEntries(STRENGTH_THEME_IDS.map((id) => [id, 0])) as Record<StrengthThemeId, number>
}

export function emptyInterestScores() {
  return Object.fromEntries(INTEREST_IDS.map((id) => [id, 0])) as Record<InterestId, number>
}

type RankedScore = { id: StrengthThemeId; score: number }

function sortThemeScores(scores: Record<StrengthThemeId, number>): RankedScore[] {
  return STRENGTH_THEME_IDS.map((id) => ({ id, score: scores[id] ?? 0 })).sort(
    (a, b) => b.score - a.score || STRENGTH_THEME_IDS.indexOf(a.id) - STRENGTH_THEME_IDS.indexOf(b.id),
  )
}

function gapAfter(ranked: RankedScore[], index: number) {
  if (index < 0 || index >= ranked.length - 1) return 0
  return ranked[index].score - ranked[index + 1].score
}

function pickCut(ranked: RankedScore[], minCount: number, maxCount: number, prefer: number) {
  let bestCount = prefer
  let best = Number.NEGATIVE_INFINITY
  for (let count = minCount; count <= maxCount; count++) {
    const gap = gapAfter(ranked, count - 1)
    const preferBonus = count === prefer ? 0.04 : 0
    const score = gap + preferBonus
    if (score > best) {
      best = score
      bestCount = count
    }
  }
  return bestCount
}

function blendThemeScores(
  direct: Record<StrengthThemeId, number>,
  strengthScores: Record<StrengthId, number>,
  interestScores: Record<InterestId, number>,
): Record<StrengthThemeId, number> {
  const scores = emptyThemeScores()
  for (const id of STRENGTH_THEME_IDS) scores[id] = direct[id] ?? 0

  for (const strength of STRENGTH_IDS) {
    const value = strengthScores[strength] ?? 0
    if (value <= 0) continue
    const mix = STRENGTH_THEME_BLEND[strength]
    if (!mix) continue
    for (const theme of STRENGTH_THEME_IDS) {
      const weight = mix[theme]
      if (weight) addScore(scores, theme, value * weight)
    }
  }

  for (const interest of INTEREST_IDS) {
    const value = interestScores[interest] ?? 0
    if (value <= 0) continue
    const mix = INTEREST_THEME_BLEND[interest]
    if (!mix) continue
    for (const theme of STRENGTH_THEME_IDS) {
      const weight = mix[theme]
      if (weight) addScore(scores, theme, value * weight)
    }
  }

  return scores
}

export function levelsFromThemeScores(
  scores: Record<StrengthThemeId, number>,
): Record<StrengthThemeId, StrengthThemeLevel> {
  const ranked = sortThemeScores(scores)
  const n = ranked.length
  const max = ranked[0]?.score ?? 0
  const min = ranked[n - 1]?.score ?? 0
  const spread = max - min

  let highCount = pickCut(ranked, 4, 5, 5)
  let exploreCount = 5
  let exploreGapBest = Number.NEGATIVE_INFINITY
  for (const count of [4, 5, 6] as const) {
    const gap = gapAfter(ranked, n - count - 1)
    const score = gap + (count === 5 ? 0.04 : 0)
    if (score > exploreGapBest) {
      exploreGapBest = score
      exploreCount = count
    }
  }

  if (spread > 0 && max > 0) {
    const relativeGapHigh = gapAfter(ranked, highCount - 1) / spread
    const relativeGapExplore = gapAfter(ranked, n - exploreCount - 1) / spread
    if (relativeGapHigh < 0.04 && highCount === 4) highCount = 5
    if (relativeGapExplore < 0.04 && exploreCount === 6) exploreCount = 5
  }

  let midCount = n - highCount - exploreCount
  if (midCount < 4) {
    const need = 4 - midCount
    const fromExplore = Math.min(need, Math.max(0, exploreCount - 4))
    exploreCount -= fromExplore
    midCount += fromExplore
    const still = 4 - midCount
    if (still > 0) {
      const fromHigh = Math.min(still, Math.max(0, highCount - 4))
      highCount -= fromHigh
      midCount += fromHigh
    }
  } else if (midCount > 5) {
    const extra = midCount - 5
    const toExplore = Math.min(extra, 6 - exploreCount)
    exploreCount += toExplore
    midCount -= toExplore
    const still = midCount - 5
    if (still > 0 && highCount < 5) {
      const toHigh = Math.min(still, 5 - highCount)
      highCount += toHigh
      midCount -= toHigh
    }
  }

  const levels = {} as Record<StrengthThemeId, StrengthThemeLevel>
  ranked.forEach((item, index) => {
    if (index < highCount) levels[item.id] = 'high'
    else if (index < highCount + midCount) levels[item.id] = 'medium'
    else levels[item.id] = 'low'
  })
  return levels
}

export function themeExpressionScores(
  scores: Record<StrengthThemeId, number>,
  levels?: Record<StrengthThemeId, StrengthThemeLevel>,
): Record<StrengthThemeId, number> {
  const ranked = sortThemeScores(scores)
  const max = ranked[0]?.score ?? 0
  const min = ranked[ranked.length - 1]?.score ?? 0
  const spread = max - min
  const close = max <= 0 || spread / Math.max(max, 0.0001) < 0.22
  const out = emptyThemeScores()

  if (close || !levels) {
    const floor = close ? 58 : 46
    const ceil = close ? 82 : 94
    ranked.forEach((item, index) => {
      const rel = spread <= 0 ? 0.5 : (item.score - min) / spread
      const rankRel = 1 - index / Math.max(1, ranked.length - 1)
      const mixed = close ? 0.45 * rel + 0.55 * (0.42 + rankRel * 0.16) : 0.84 * rel + 0.16 * rankRel
      out[item.id] = Math.round(floor + mixed * (ceil - floor))
    })
    return out
  }

  const ranges: Record<StrengthThemeLevel, [number, number]> = {
    high: [74, 94],
    medium: [60, 73],
    low: [46, 59],
  }

  for (const band of ['high', 'medium', 'low'] as const) {
    const group = ranked.filter((item) => (levels[item.id] ?? 'low') === band)
    if (group.length === 0) continue
    const hi = group[0].score
    const lo = group[group.length - 1].score
    const [floor, ceil] = ranges[band]
    const inner = hi - lo
    for (const item of group) {
      const rel = inner <= 0.0001 ? 0.55 : (item.score - lo) / inner
      out[item.id] = Math.round(floor + rel * (ceil - floor))
    }
  }
  return out
}

export function deriveStrengthThemes(strengths: StrengthId[]): Record<StrengthThemeId, StrengthThemeLevel> {
  const scores = emptyThemeScores()
  for (const strength of strengths) {
    bump(scores, STRENGTH_TO_THEMES[strength], 2)
  }
  return levelsFromThemeScores(scores)
}

export type RankedTheme = {
  id: StrengthThemeId
  level: StrengthThemeLevel
  score: number
  raw?: number
}

export function scoreForLevel(level: StrengthThemeLevel) {
  if (level === 'high') return 3
  if (level === 'medium') return 2
  return 1
}

export function rankedThemes(
  themes: Record<StrengthThemeId, StrengthThemeLevel>,
  scores?: Partial<Record<StrengthThemeId, number>>,
): RankedTheme[] {
  const raw = emptyThemeScores()
  for (const id of STRENGTH_THEME_IDS) {
    raw[id] = scores?.[id] ?? scoreForLevel(themes[id] ?? 'low')
  }
  const display = themeExpressionScores(raw, themes)
  return STRENGTH_THEME_IDS.map((id) => ({
    id,
    level: themes[id] ?? 'low',
    score: display[id],
    raw: raw[id],
  })).sort(
    (a, b) =>
      (b.raw ?? b.score) - (a.raw ?? a.score) ||
      scoreForLevel(b.level) - scoreForLevel(a.level) ||
      STRENGTH_THEME_IDS.indexOf(a.id) - STRENGTH_THEME_IDS.indexOf(b.id),
  )
}

export function themesInBand(
  themes: Record<StrengthThemeId, StrengthThemeLevel>,
  band: StrengthThemeLevel,
  scores?: Partial<Record<StrengthThemeId, number>>,
) {
  return rankedThemes(themes, scores).filter((item) => item.level === band)
}

export function featuredThemes(
  themes: Record<StrengthThemeId, StrengthThemeLevel>,
  scores?: Partial<Record<StrengthThemeId, number>>,
) {
  const highs = themesInBand(themes, 'high', scores).slice(0, 3)
  const mediums = themesInBand(themes, 'medium', scores).slice(0, 2)
  const featured = [...highs]
  for (const item of mediums) {
    if (featured.length >= 3) break
    featured.push(item)
  }
  return featured.slice(0, 4)
}

export function collectSignals(answers: Record<string, string>) {
  const interestScores = emptyInterestScores()
  const workScores = Object.fromEntries(WORK_STYLE_IDS.map((id) => [id, 0])) as Record<WorkStyleId, number>
  const directionScores = Object.fromEntries(DIRECTION_IDS.map((id) => [id, 0])) as Record<DirectionId, number>
  const skillBoost = Object.fromEntries(SKILL_IDS.map((id) => [id, 0])) as Record<SkillId, number>
  const strengthScores = Object.fromEntries(STRENGTH_IDS.map((id) => [id, 0])) as Record<StrengthId, number>
  const themeDirect = emptyThemeScores()

  for (const question of QUESTIONS) {
    const selected = answers[question.id]
    const option = question.options.find((item) => item.id === selected)
    if (!option) continue
    bump(interestScores, option.weight.interests)
    bump(workScores, option.weight.workStyle)
    bump(directionScores, option.weight.directions)
    bump(skillBoost, option.weight.skillBoost)
    bump(strengthScores, option.weight.strengths)
    bump(themeDirect, option.weight.themes)
  }

  const themeScores = blendThemeScores(themeDirect, strengthScores, interestScores)

  return { interestScores, workScores, directionScores, skillBoost, strengthScores, themeScores }
}

export function buildResult(
  answers: Record<string, string>,
  skills: Record<SkillId, number>,
): AssessmentResult {
  const { interestScores, workScores, directionScores, skillBoost, strengthScores, themeScores } =
    collectSignals(answers)

  for (const id of SKILL_IDS) {
    if (skills[id] >= 4 && (STRENGTH_IDS as readonly string[]).includes(id)) {
      bump(strengthScores, [id as StrengthId], 0.8)
    }
  }

  const rankedSkills = [...SKILL_IDS].sort(
    (a, b) => skills[b] + skillBoost[b] * 0.35 - (skills[a] + skillBoost[a] * 0.35),
  )

  let strengths = topKeys(strengthScores, 3, STRENGTH_IDS)
  if (strengths.length < 2) {
    const extra = rankedSkills.filter(
      (id) => (STRENGTH_IDS as readonly string[]).includes(id) && !strengths.includes(id as StrengthId),
    ) as StrengthId[]
    strengths = [...strengths, ...extra].slice(0, 3)
  }

  const skillsToDevelop = [...SKILL_IDS]
    .filter((id) => skills[id] <= 3)
    .sort((a, b) => skills[a] - skills[b] || skillBoost[a] - skillBoost[b])
    .slice(0, 2)

  const interests = topKeys(interestScores, 4, INTEREST_IDS)
  const workStyle = topKeys(workScores, 2, WORK_STYLE_IDS)
  const directions = topKeys(directionScores, 3, DIRECTION_IDS)

  return {
    completedAt: new Date().toISOString(),
    version: 1,
    answers: { questions: answers, skills },
    interests,
    strengths,
    strengthThemes: levelsFromThemeScores(themeScores),
    workStyle: workStyle.length > 0 ? workStyle : ['flexible'],
    skills,
    skillsToDevelop: skillsToDevelop.length > 0 ? skillsToDevelop : rankedSkills.slice(-2).reverse(),
    directions,
    signals: {
      interests: interestScores,
      themes: themeScores,
    },
  }
}
