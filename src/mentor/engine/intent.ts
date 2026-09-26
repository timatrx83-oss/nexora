import { CAREERS } from '../../careers'
import type { Career, CareerFieldId } from '../../careers/types'
import { findCareersInText, findFieldsInText, normalizeMentorText } from '../detect'
import type { MentorSnapshot } from '../snapshot'
import type { MentorPromptId, MentorRequest } from '../types'

export type MentorIntent =
  | 'fit'
  | 'whyMatch'
  | 'whyCareer'
  | 'traits'
  | 'develop'
  | 'explore'
  | 'compare'
  | 'skills'
  | 'profile'
  | 'career'
  | 'generic'

export type ResolvedIntent = {
  intent: MentorIntent
  careers: Career[]
  fields: CareerFieldId[]
}

const FIT =
  /match my strength|careers match|careers fit|fit my profile|what careers|какие професс|какие карьер|мамандық.*жақын|қандай мамандық|which careers/i
const WHY_MATCH =
  /why am i matched|why are these|why did i get these|why these career|почему мне так|почему совпал|неге маған|неге сәйкес/i
const WHY = /\bwhy\b|почему|неге|зачем/i
const TRAITS = /strongest|qualities|strength theme|мои сильн|самые сильн|мықты жақ/i
const DEVELOP = /should i develop|what should i improve|developing|стоит развив|что улучшить|дамыт|жетілдір/i
const EXPLORE = /explore next|should i explore|areas might|what am i missing|исследовать дальше|что дальше|келесі не|не зерттеу|чего мне не хват/i
const COMPARE = /compar|сравни|салыстыр|difference between|чем отлича|айырма|\bvs\.?\b| versus | или /i
const SKILLS = /what skills|какие навык|қандай дағды|skills could|skills should|skills are useful/i
const PROFILE = /about my profile|assessment say|why did i get these results|tell me about my|мой профиль|что говорит оценк|бағалау не дейді|профилім/i

function fromPrompt(id: MentorPromptId | undefined): MentorIntent | null {
  if (!id) return null
  if (id === 'fit') return 'fit'
  if (id === 'results') return 'whyMatch'
  if (id === 'traits') return 'develop'
  if (id === 'fields') return 'explore'
  if (id === 'compare' || id === 'compareSaved') return 'compare'
  if (id === 'skills') return 'skills'
  if (id === 'aboutSaved') return 'career'
  return null
}

function careersFromHistory(history: MentorRequest['history']) {
  const recent = history
    .slice(-6)
    .map((item) => item.text)
    .join(' \n ')
  return findCareersInText(recent)
}

export function resolveIntent(request: MentorRequest, snapshot: MentorSnapshot): ResolvedIntent {
  const message = request.message
  const mentioned = findCareersInText(message)
  const fields = findFieldsInText(message)
  const historyCareers = careersFromHistory(request.history)
  const promptIntent = fromPrompt(request.promptId)

  let careers = mentioned
  if (promptIntent === 'career' && snapshot.savedCareers[0] && careers.length === 0) {
    careers = [snapshot.savedCareers[0]]
  }

  if (promptIntent === 'compare' || COMPARE.test(message)) {
    if (careers.length < 2) {
      const saved = snapshot.savedCareers.slice(0, 2)
      careers = saved.length >= 2 ? saved : careers
    }
    return { intent: 'compare', careers, fields }
  }

  if (promptIntent) return { intent: promptIntent, careers, fields }

  if (WHY_MATCH.test(message)) return { intent: 'whyMatch', careers, fields }

  const whyCareerSource = careers[0] ?? historyCareers[0]
  if (WHY.test(normalizeMentorText(message)) && (whyCareerSource || fields[0])) {
    return { intent: 'whyCareer', careers: careers[0] ? careers.slice(0, 1) : whyCareerSource ? [whyCareerSource] : [], fields }
  }

  if (FIT.test(message)) return { intent: 'fit', careers, fields }
  if (DEVELOP.test(message)) return { intent: 'develop', careers, fields }
  if (TRAITS.test(message)) return { intent: 'traits', careers, fields }
  if (SKILLS.test(message)) return { intent: 'skills', careers, fields }
  if (EXPLORE.test(message)) return { intent: 'explore', careers, fields }
  if (PROFILE.test(message)) return { intent: 'profile', careers, fields }
  if (careers.length === 1) return { intent: 'career', careers, fields }
  if (fields.length) {
    const fromField = CAREERS.filter((item) => fields.includes(item.field)).slice(0, 1)
    if (fromField.length) return { intent: 'career', careers: fromField, fields }
  }
  return { intent: 'generic', careers, fields }
}
