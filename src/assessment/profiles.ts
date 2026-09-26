import { buildResult } from './score'
import { SKILL_IDS, type SkillId, type StrengthThemeId } from './types'

const evenSkills = Object.fromEntries(SKILL_IDS.map((id) => [id, 3])) as Record<SkillId, number>

function resultFor(answers: Record<string, string>) {
  return buildResult(answers, evenSkills)
}

function highs(answers: Record<string, string>) {
  const themes = resultFor(answers).strengthThemes
  return (Object.entries(themes) as [StrengthThemeId, string][])
    .filter(([, level]) => level === 'high')
    .map(([id]) => id)
}

function bandCounts(answers: Record<string, string>) {
  const themes = resultFor(answers).strengthThemes
  const counts = { high: 0, medium: 0, low: 0 }
  for (const level of Object.values(themes)) counts[level] += 1
  return counts
}

export const PROFILE_ANSWERS = {
  creative: {
    attract: 'ideas',
    enjoy: 'shape',
    challenge: 'understand',
    world: 'studio',
    texture: 'stories',
    rely: 'another',
    stuck: 'path',
    best: 'original',
    make: 'create',
    group: 'voice',
    decide: 'try',
    energy: 'imagine',
    prefer: 'flex',
    unclear: 'experiment',
    projects: 'create',
    motive: 'build',
  },
  research: {
    attract: 'data',
    enjoy: 'how',
    challenge: 'living',
    world: 'lab',
    texture: 'living',
    rely: 'question',
    stuck: 'apart',
    best: 'sense',
    make: 'research',
    group: 'research',
    decide: 'evidence',
    energy: 'learn',
    prefer: 'alone',
    unclear: 'map',
    projects: 'improve',
    motive: 'discover',
  },
  leadership: {
    attract: 'people',
    enjoy: 'own',
    challenge: 'gather',
    world: 'market',
    texture: 'numbers',
    rely: 'plan',
    stuck: 'coordinate',
    best: 'together',
    make: 'start',
    group: 'lead',
    decide: 'long',
    energy: 'lead',
    prefer: 'lead',
    unclear: 'map',
    projects: 'lead',
    motive: 'win',
  },
  people: {
    attract: 'people',
    enjoy: 'care',
    challenge: 'understand',
    world: 'clinic',
    texture: 'minds',
    rely: 'calm',
    stuck: 'ask',
    best: 'understood',
    make: 'help',
    group: 'connect',
    decide: 'people',
    energy: 'connect',
    prefer: 'small',
    unclear: 'ask',
    projects: 'contribute',
    motive: 'impact',
  },
  practical: {
    attract: 'making',
    enjoy: 'make',
    challenge: 'tool',
    world: 'workshop',
    texture: 'machines',
    rely: 'details',
    stuck: 'apart',
    best: 'works',
    make: 'improve',
    group: 'practical',
    decide: 'steps',
    energy: 'solve',
    prefer: 'alone',
    unclear: 'build',
    projects: 'improve',
    motive: 'craft',
  },
} as const

export function assertDistinctProfiles() {
  const creative = highs(PROFILE_ANSWERS.creative)
  const research = highs(PROFILE_ANSWERS.research)
  const leadership = highs(PROFILE_ANSWERS.leadership)
  const people = highs(PROFILE_ANSWERS.people)
  const practical = highs(PROFILE_ANSWERS.practical)

  const problems: string[] = []
  if (!creative.includes('creator')) problems.push(`creative missing creator: ${creative.join(',')}`)
  if (!research.includes('researcher')) problems.push(`research missing researcher: ${research.join(',')}`)
  if (!leadership.includes('leader')) problems.push(`leadership missing leader: ${leadership.join(',')}`)
  if (!people.includes('empath') && !people.includes('connector')) {
    problems.push(`people missing empath/connector: ${people.join(',')}`)
  }
  if (resultFor(PROFILE_ANSWERS.people).strengthThemes.impact === 'low') {
    problems.push('people impact should not be low')
  }
  if (!practical.includes('problemSolver') && !practical.includes('practicalThinker')) {
    problems.push(`practical missing core: ${practical.join(',')}`)
  }
  if (creative.includes('learner') && creative.length === 1) problems.push('creative learner-only')
  const learnerHighEverywhere = [creative, research, leadership, people, practical].every((ids) =>
    ids.includes('learner'),
  )
  if (learnerHighEverywhere) problems.push('learner is high for every profile')
  if (creative.includes('learner')) problems.push('creative should not auto-rank learner high')
  if (leadership.includes('impact') && resultFor(PROFILE_ANSWERS.leadership).strengthThemes.impact === 'high') {
    const peopleImpact = resultFor(PROFILE_ANSWERS.people).strengthThemes.impact
    if (peopleImpact !== 'high') problems.push('impact should be higher for people than leadership')
  }

  for (const [name, answers] of Object.entries(PROFILE_ANSWERS)) {
    const counts = bandCounts(answers)
    if (counts.high < 4 || counts.high > 6) problems.push(`${name} high count ${counts.high}`)
    if (counts.medium < 4 || counts.medium > 6) problems.push(`${name} medium count ${counts.medium}`)
    if (counts.low < 4 || counts.low > 6) problems.push(`${name} low count ${counts.low}`)
  }

  const signatures = [creative, research, leadership, people, practical].map((ids) => ids.slice().sort().join('|'))
  if (new Set(signatures).size < 4) problems.push(`profiles too similar: ${signatures.join(' / ')}`)

  return {
    problems,
    creative,
    research,
    leadership,
    people,
    practical,
    counts: {
      creative: bandCounts(PROFILE_ANSWERS.creative),
      research: bandCounts(PROFILE_ANSWERS.research),
      leadership: bandCounts(PROFILE_ANSWERS.leadership),
      people: bandCounts(PROFILE_ANSWERS.people),
      practical: bandCounts(PROFILE_ANSWERS.practical),
    },
  }
}
