import type { ChoiceQuestion } from './types'
import { SKILL_IDS } from './types'

export const QUESTIONS: ChoiceQuestion[] = [
  {
    id: 'attract',
    section: 'interests',
    options: [
      {
        id: 'ideas',
        weight: {
          interests: ['creativity', 'media'],
          strengths: ['creativity', 'initiative'],
          themes: ['creator', 'strategicThinker'],
        },
      },
      {
        id: 'people',
        weight: {
          interests: ['people', 'psychology'],
          strengths: ['empathy', 'communication'],
          themes: ['connector', 'empath'],
        },
      },
      {
        id: 'data',
        weight: {
          interests: ['data', 'problemSolving'],
          strengths: ['analyticalThinking'],
          themes: ['criticalThinker', 'researcher'],
        },
      },
      {
        id: 'tech',
        weight: {
          interests: ['technology'],
          strengths: ['practicalThinking'],
          skillBoost: ['digitalSkills'],
          themes: ['practicalThinker', 'problemSolver'],
        },
      },
      {
        id: 'nature',
        weight: {
          interests: ['nature', 'biology'],
          strengths: ['curiosity'],
          themes: ['researcher', 'practicalThinker'],
        },
      },
      {
        id: 'making',
        weight: {
          interests: ['engineering', 'product'],
          strengths: ['practicalThinking', 'problemSolving'],
          themes: ['practicalThinker', 'creator'],
        },
      },
    ],
  },
  {
    id: 'enjoy',
    section: 'interests',
    options: [
      {
        id: 'how',
        weight: {
          interests: ['science', 'problemSolving'],
          strengths: ['curiosity', 'analyticalThinking'],
          themes: ['researcher', 'criticalThinker'],
        },
      },
      {
        id: 'make',
        weight: {
          interests: ['engineering', 'product'],
          strengths: ['practicalThinking', 'problemSolving'],
          themes: ['practicalThinker', 'problemSolver'],
        },
      },
      {
        id: 'care',
        weight: {
          interests: ['health', 'people'],
          strengths: ['empathy', 'communication'],
          themes: ['empath', 'impact', 'impact'],
        },
      },
      {
        id: 'shape',
        weight: {
          interests: ['creativity', 'media'],
          strengths: ['creativity', 'initiative'],
          themes: ['creator'],
        },
      },
      {
        id: 'own',
        weight: {
          interests: ['business', 'leadership'],
          strengths: ['leadership', 'initiative'],
          themes: ['leader', 'achiever'],
          directions: ['business'],
        },
      },
      {
        id: 'tools',
        weight: {
          interests: ['technology'],
          strengths: ['practicalThinking'],
          skillBoost: ['digitalSkills'],
          themes: ['practicalThinker', 'adaptable'],
        },
      },
    ],
  },
  {
    id: 'challenge',
    section: 'interests',
    options: [
      {
        id: 'living',
        weight: {
          interests: ['science', 'biology'],
          strengths: ['curiosity', 'analyticalThinking'],
          themes: ['researcher'],
        },
      },
      {
        id: 'place',
        weight: {
          interests: ['nature', 'health'],
          strengths: ['practicalThinking', 'empathy'],
          themes: ['impact', 'practicalThinker'],
        },
      },
      {
        id: 'understand',
        weight: {
          interests: ['psychology', 'society', 'people'],
          strengths: ['empathy', 'communication'],
          themes: ['empath', 'connector'],
        },
      },
      {
        id: 'teach',
        weight: {
          interests: ['education', 'people'],
          strengths: ['communication', 'empathy'],
          themes: ['communicator', 'impact'],
        },
      },
      {
        id: 'tool',
        weight: {
          interests: ['engineering', 'technology'],
          strengths: ['practicalThinking', 'problemSolving'],
          themes: ['problemSolver', 'practicalThinker'],
        },
      },
      {
        id: 'gather',
        weight: {
          interests: ['leadership', 'people'],
          strengths: ['leadership', 'organization'],
          themes: ['leader', 'connector'],
        },
      },
    ],
  },
  {
    id: 'world',
    section: 'interests',
    options: [
      {
        id: 'lab',
        weight: {
          interests: ['science', 'biology'],
          strengths: ['curiosity'],
          themes: ['researcher'],
        },
      },
      {
        id: 'studio',
        weight: {
          interests: ['creativity', 'media'],
          strengths: ['creativity'],
          themes: ['creator', 'communicator'],
        },
      },
      {
        id: 'clinic',
        weight: {
          interests: ['health', 'people'],
          strengths: ['empathy'],
          themes: ['empath', 'impact', 'impact'],
        },
      },
      {
        id: 'workshop',
        weight: {
          interests: ['engineering', 'product'],
          strengths: ['practicalThinking'],
          themes: ['practicalThinker', 'problemSolver'],
        },
      },
      {
        id: 'market',
        weight: {
          interests: ['business', 'finance'],
          strengths: ['leadership', 'initiative'],
          themes: ['leader', 'achiever'],
          directions: ['business', 'finance'],
        },
      },
      {
        id: 'field',
        weight: {
          interests: ['nature', 'animals'],
          strengths: ['practicalThinking', 'curiosity'],
          themes: ['practicalThinker', 'empath'],
        },
      },
    ],
  },
  {
    id: 'texture',
    section: 'interests',
    options: [
      {
        id: 'living',
        weight: {
          interests: ['biology', 'science'],
          strengths: ['curiosity'],
          themes: ['researcher'],
        },
      },
      {
        id: 'numbers',
        weight: {
          interests: ['finance', 'data'],
          strengths: ['analyticalThinking'],
          themes: ['criticalThinker', 'organizer'],
          directions: ['finance'],
        },
      },
      {
        id: 'stories',
        weight: {
          interests: ['media', 'creativity'],
          strengths: ['communication', 'creativity'],
          themes: ['communicator', 'creator'],
          directions: ['creative', 'marketing'],
        },
      },
      {
        id: 'minds',
        weight: {
          interests: ['psychology', 'society'],
          strengths: ['empathy', 'curiosity'],
          themes: ['empath', 'researcher'],
        },
      },
      {
        id: 'machines',
        weight: {
          interests: ['technology', 'engineering'],
          strengths: ['problemSolving'],
          skillBoost: ['digitalSkills'],
          themes: ['problemSolver', 'practicalThinker'],
          directions: ['tech'],
        },
      },
      {
        id: 'beyond',
        weight: {
          interests: ['space', 'science'],
          strengths: ['curiosity', 'analyticalThinking'],
          themes: ['strategicThinker', 'researcher'],
        },
      },
    ],
  },
  {
    id: 'rely',
    section: 'strengths',
    options: [
      {
        id: 'explain',
        weight: {
          strengths: ['communication'],
          skillBoost: ['communication'],
          themes: ['communicator'],
        },
      },
      {
        id: 'details',
        weight: {
          strengths: ['analyticalThinking', 'organization'],
          skillBoost: ['analyticalThinking'],
          themes: ['researcher', 'organizer'],
        },
      },
      {
        id: 'another',
        weight: {
          strengths: ['creativity', 'initiative'],
          skillBoost: ['creativity'],
          themes: ['creator', 'problemSolver'],
        },
      },
      {
        id: 'calm',
        weight: {
          strengths: ['empathy', 'communication'],
          skillBoost: ['communication'],
          themes: ['empath'],
        },
      },
      {
        id: 'plan',
        weight: {
          strengths: ['organization', 'leadership'],
          skillBoost: ['leadership'],
          themes: ['organizer', 'strategicThinker'],
        },
      },
      {
        id: 'question',
        weight: {
          strengths: ['curiosity', 'analyticalThinking'],
          skillBoost: ['analyticalThinking'],
          themes: ['criticalThinker', 'researcher'],
        },
      },
    ],
  },
  {
    id: 'stuck',
    section: 'strengths',
    options: [
      {
        id: 'apart',
        weight: {
          strengths: ['analyticalThinking', 'practicalThinking', 'problemSolving'],
          skillBoost: ['analyticalThinking'],
          themes: ['problemSolver', 'researcher'],
        },
      },
      {
        id: 'path',
        weight: {
          strengths: ['adaptability', 'initiative'],
          skillBoost: ['adaptability'],
          themes: ['adaptable', 'creator'],
        },
      },
      {
        id: 'ask',
        weight: {
          strengths: ['teamwork', 'communication'],
          skillBoost: ['communication'],
          themes: ['connector', 'communicator'],
        },
      },
      {
        id: 'small',
        weight: {
          strengths: ['curiosity', 'practicalThinking'],
          skillBoost: ['adaptability'],
          themes: ['practicalThinker', 'adaptable'],
        },
      },
      {
        id: 'coordinate',
        weight: {
          strengths: ['leadership', 'organization'],
          skillBoost: ['leadership'],
          themes: ['leader', 'organizer'],
        },
      },
    ],
  },
  {
    id: 'best',
    section: 'strengths',
    options: [
      {
        id: 'understood',
        weight: {
          strengths: ['empathy', 'communication'],
          skillBoost: ['communication'],
          themes: ['empath', 'communicator'],
        },
      },
      {
        id: 'sense',
        weight: {
          strengths: ['analyticalThinking', 'curiosity'],
          skillBoost: ['analyticalThinking'],
          themes: ['problemSolver', 'criticalThinker'],
        },
      },
      {
        id: 'works',
        weight: {
          strengths: ['practicalThinking', 'problemSolving'],
          themes: ['practicalThinker', 'achiever'],
        },
      },
      {
        id: 'together',
        weight: {
          strengths: ['teamwork', 'leadership'],
          skillBoost: ['leadership'],
          themes: ['connector', 'leader'],
        },
      },
      {
        id: 'original',
        weight: {
          strengths: ['creativity', 'initiative'],
          skillBoost: ['creativity'],
          themes: ['creator'],
        },
      },
      {
        id: 'matter',
        weight: {
          interests: ['health', 'society'],
          strengths: ['empathy', 'initiative'],
          themes: ['impact', 'achiever'],
        },
      },
    ],
  },
  {
    id: 'make',
    section: 'strengths',
    options: [
      {
        id: 'create',
        weight: {
          strengths: ['creativity', 'initiative'],
          themes: ['creator'],
          workStyle: ['curious'],
        },
      },
      {
        id: 'improve',
        weight: {
          strengths: ['practicalThinking', 'problemSolving'],
          themes: ['practicalThinker', 'problemSolver'],
        },
      },
      {
        id: 'research',
        weight: {
          strengths: ['curiosity', 'analyticalThinking'],
          themes: ['researcher', 'learner'],
        },
      },
      {
        id: 'help',
        weight: {
          interests: ['people', 'health'],
          strengths: ['empathy'],
          themes: ['empath', 'impact', 'impact'],
        },
      },
      {
        id: 'organize',
        weight: {
          strengths: ['organization'],
          themes: ['organizer'],
        },
      },
      {
        id: 'start',
        weight: {
          strengths: ['leadership', 'initiative'],
          themes: ['leader', 'achiever'],
        },
      },
    ],
  },
  {
    id: 'group',
    section: 'strengths',
    options: [
      {
        id: 'lead',
        weight: {
          themes: ['leader'],
          strengths: ['leadership'],
          workStyle: ['leading'],
        },
      },
      {
        id: 'connect',
        weight: {
          themes: ['connector'],
          strengths: ['teamwork', 'communication'],
        },
      },
      {
        id: 'research',
        weight: {
          themes: ['researcher'],
          strengths: ['curiosity', 'analyticalThinking'],
        },
      },
      {
        id: 'finish',
        weight: {
          themes: ['achiever'],
          strengths: ['initiative', 'organization'],
        },
      },
      {
        id: 'practical',
        weight: {
          themes: ['practicalThinker'],
          strengths: ['practicalThinking'],
        },
      },
      {
        id: 'voice',
        weight: {
          themes: ['communicator'],
          strengths: ['communication'],
          skillBoost: ['communication'],
        },
      },
    ],
  },
  {
    id: 'decide',
    section: 'strengths',
    options: [
      {
        id: 'people',
        weight: {
          strengths: ['empathy', 'teamwork'],
          themes: ['empath', 'connector'],
        },
      },
      {
        id: 'evidence',
        weight: {
          strengths: ['analyticalThinking', 'curiosity'],
          themes: ['criticalThinker', 'researcher'],
        },
      },
      {
        id: 'long',
        weight: {
          strengths: ['analyticalThinking', 'organization'],
          themes: ['strategicThinker'],
        },
      },
      {
        id: 'try',
        weight: {
          strengths: ['adaptability', 'initiative'],
          skillBoost: ['adaptability'],
          themes: ['adaptable'],
        },
      },
      {
        id: 'values',
        weight: {
          interests: ['society', 'health'],
          strengths: ['empathy'],
          themes: ['impact', 'impact'],
        },
      },
      {
        id: 'steps',
        weight: {
          strengths: ['organization'],
          themes: ['organizer', 'practicalThinker'],
        },
      },
    ],
  },
  {
    id: 'energy',
    section: 'strengths',
    options: [
      { id: 'learn', weight: { themes: ['learner'], strengths: ['curiosity'] } },
      { id: 'finish', weight: { themes: ['achiever'], strengths: ['initiative'] } },
      { id: 'connect', weight: { themes: ['connector'], strengths: ['communication', 'teamwork'] } },
      { id: 'imagine', weight: { themes: ['creator'], strengths: ['creativity'] } },
      { id: 'solve', weight: { themes: ['problemSolver'], strengths: ['problemSolving'] } },
      { id: 'lead', weight: { themes: ['leader'], strengths: ['leadership'] } },
    ],
  },
  {
    id: 'prefer',
    section: 'workStyle',
    options: [
      { id: 'alone', weight: { workStyle: ['independent'] } },
      { id: 'small', weight: { workStyle: ['collaborative'] } },
      { id: 'large', weight: { workStyle: ['collaborative', 'projectOriented'] } },
      { id: 'lead', weight: { workStyle: ['leading'], themes: ['leader'], strengths: ['leadership'] } },
      { id: 'flex', weight: { workStyle: ['flexible'], themes: ['adaptable'], strengths: ['adaptability'] } },
    ],
  },
  {
    id: 'unclear',
    section: 'workStyle',
    options: [
      {
        id: 'map',
        weight: {
          workStyle: ['projectOriented'],
          strengths: ['organization', 'analyticalThinking'],
          themes: ['strategicThinker', 'organizer'],
        },
      },
      {
        id: 'experiment',
        weight: {
          workStyle: ['curious', 'flexible'],
          strengths: ['creativity', 'adaptability'],
          themes: ['creator', 'adaptable'],
        },
      },
      {
        id: 'ask',
        weight: {
          workStyle: ['collaborative'],
          strengths: ['communication', 'teamwork'],
          themes: ['connector', 'communicator'],
        },
      },
      {
        id: 'rules',
        weight: {
          workStyle: ['projectOriented'],
          strengths: ['organization'],
          themes: ['organizer'],
        },
      },
      {
        id: 'build',
        weight: {
          workStyle: ['independent'],
          strengths: ['practicalThinking', 'initiative'],
          themes: ['practicalThinker'],
        },
      },
    ],
  },
  {
    id: 'projects',
    section: 'workStyle',
    options: [
      {
        id: 'create',
        weight: {
          workStyle: ['curious'],
          strengths: ['creativity', 'initiative'],
          themes: ['creator'],
        },
      },
      {
        id: 'improve',
        weight: {
          workStyle: ['projectOriented'],
          strengths: ['practicalThinking'],
          themes: ['practicalThinker', 'problemSolver'],
        },
      },
      {
        id: 'plan',
        weight: {
          workStyle: ['projectOriented'],
          strengths: ['organization'],
          themes: ['organizer', 'strategicThinker'],
        },
      },
      {
        id: 'adapt',
        weight: {
          workStyle: ['flexible'],
          strengths: ['adaptability'],
          skillBoost: ['adaptability'],
          themes: ['adaptable'],
        },
      },
      {
        id: 'lead',
        weight: { workStyle: ['leading'], strengths: ['leadership'], themes: ['leader'] },
      },
      {
        id: 'contribute',
        weight: { workStyle: ['collaborative'], strengths: ['teamwork'], themes: ['connector'] },
      },
    ],
  },
  {
    id: 'motive',
    section: 'workStyle',
    options: [
      {
        id: 'impact',
        weight: {
          interests: ['health', 'society', 'education'],
          strengths: ['empathy', 'initiative'],
          themes: ['impact', 'impact'],
        },
      },
      {
        id: 'craft',
        weight: {
          strengths: ['practicalThinking'],
          themes: ['practicalThinker', 'achiever'],
        },
      },
      {
        id: 'discover',
        weight: {
          workStyle: ['curious'],
          strengths: ['curiosity'],
          themes: ['researcher', 'learner'],
        },
      },
      {
        id: 'belong',
        weight: {
          interests: ['people'],
          strengths: ['teamwork', 'communication'],
          themes: ['connector', 'empath'],
        },
      },
      {
        id: 'build',
        weight: {
          interests: ['product', 'engineering'],
          strengths: ['creativity', 'practicalThinking'],
          themes: ['creator', 'practicalThinker'],
        },
      },
      {
        id: 'win',
        weight: {
          interests: ['business', 'leadership'],
          strengths: ['initiative', 'leadership'],
          themes: ['achiever', 'leader'],
        },
      },
    ],
  },
]

export const QUESTION_COUNT = QUESTIONS.length + 1
export const SECTION_COUNT = 5

export const SKILL_STEP_INDEX = QUESTIONS.length

export function sectionForIndex(index: number) {
  if (index >= QUESTIONS.length) return 'skills' as const
  return QUESTIONS[index].section
}

export function stepNumberForIndex(index: number) {
  const section = sectionForIndex(index)
  if (section === 'interests') return 1
  if (section === 'strengths') return 2
  if (section === 'workStyle') return 3
  return 4
}

export { SKILL_IDS }
