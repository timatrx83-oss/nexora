import type { Messages } from '../i18n/en'
import { runLocalMentorEngine } from './engine'
import type { MentorSnapshot } from './snapshot'
import type { MentorReply, MentorRequest } from './types'

/** @deprecated Use runLocalMentorEngine. Kept as a stable alias for the local Mentor Engine. */
export async function localMentorReply(
  request: MentorRequest,
  t: Messages,
  snapshot: MentorSnapshot,
): Promise<MentorReply> {
  return runLocalMentorEngine(request, snapshot, t)
}
