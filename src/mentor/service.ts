import type { Messages } from '../i18n/en'
import type { MentorAiProfile } from './aiProfile'
import { runLocalMentorEngine } from './engine'
import type { MentorSnapshot } from './snapshot'
import type { MentorRequest, MentorService } from './types'

export type MentorServiceInput = {
  profile: MentorAiProfile
  snapshot: MentorSnapshot
  t: Messages
}

function openaiMentorEnabled() {
  return import.meta.env.VITE_MENTOR_ENGINE === 'openai'
}

export function createMentorService(input: MentorServiceInput): MentorService {
  return {
    async reply(request: MentorRequest) {
      if (openaiMentorEnabled()) {
        try {
          const { requestMentorReply } = await import('./api')
          return await requestMentorReply({
            message: request.message,
            locale: request.locale,
            history: request.history,
            profile: input.profile,
          })
        } catch {
          return runLocalMentorEngine(request, input.snapshot, input.t)
        }
      }
      return runLocalMentorEngine(request, input.snapshot, input.t)
    },
  }
}
