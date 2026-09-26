export const SKILL_IDS = [
  'communication',
  'creativity',
  'leadership',
  'analyticalThinking',
  'adaptability',
  'digitalSkills',
] as const

export type SkillId = (typeof SKILL_IDS)[number]

export const INTEREST_IDS = [
  'problemSolving',
  'creativity',
  'people',
  'leadership',
  'technology',
  'data',
  'product',
  'business',
  'science',
  'nature',
  'health',
  'engineering',
  'education',
  'society',
  'media',
  'biology',
  'finance',
  'psychology',
  'space',
  'animals',
] as const

export type InterestId = (typeof INTEREST_IDS)[number]

export const STRENGTH_IDS = [
  'communication',
  'creativity',
  'leadership',
  'analyticalThinking',
  'adaptability',
  'problemSolving',
  'teamwork',
  'organization',
  'curiosity',
  'empathy',
  'initiative',
  'practicalThinking',
] as const

export type StrengthId = (typeof STRENGTH_IDS)[number]

export const WORK_STYLE_IDS = [
  'independent',
  'collaborative',
  'curious',
  'projectOriented',
  'leading',
  'flexible',
] as const

export type WorkStyleId = (typeof WORK_STYLE_IDS)[number]

export const DIRECTION_IDS = [
  'business',
  'tech',
  'marketing',
  'creative',
  'finance',
  'product',
] as const

export type DirectionId = (typeof DIRECTION_IDS)[number]

export const STRENGTH_THEME_IDS = [
  'creator',
  'impact',
  'strategicThinker',
  'problemSolver',
  'learner',
  'leader',
  'connector',
  'researcher',
  'empath',
  'organizer',
  'achiever',
  'practicalThinker',
  'communicator',
  'criticalThinker',
  'adaptable',
] as const

export type StrengthThemeId = (typeof STRENGTH_THEME_IDS)[number]

export type StrengthThemeLevel = 'high' | 'medium' | 'low'

export type AssessmentSection = 'interests' | 'strengths' | 'workStyle' | 'skills'

export type AssessmentAnswers = {
  questions: Record<string, string>
  skills: Record<SkillId, number>
}

export type AssessmentSignals = {
  interests: Record<InterestId, number>
  themes: Record<StrengthThemeId, number>
}

export type AssessmentResult = {
  completedAt: string
  version: 1
  answers: AssessmentAnswers
  interests: InterestId[]
  strengths: StrengthId[]
  strengthThemes: Record<StrengthThemeId, StrengthThemeLevel>
  workStyle: WorkStyleId[]
  skills: Record<SkillId, number>
  skillsToDevelop: SkillId[]
  directions: DirectionId[]
  signals?: AssessmentSignals
}

export type AssessmentPhase = 'intro' | 'questions' | 'result'

export const ASSESSMENT_SCHEMA = 2

export type AssessmentDraft = {
  phase: AssessmentPhase
  questionIndex: number
  answers: Record<string, string>
  skills: Partial<Record<SkillId, number>>
  result: AssessmentResult | null
  contentVersion?: number
}

export type OptionWeight = {
  interests?: InterestId[]
  strengths?: StrengthId[]
  themes?: StrengthThemeId[]
  workStyle?: WorkStyleId[]
  directions?: DirectionId[]
  skillBoost?: SkillId[]
}

export type ChoiceQuestion = {
  id: string
  section: Exclude<AssessmentSection, 'skills'>
  options: { id: string; weight: OptionWeight }[]
}
