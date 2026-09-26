export type MentorRole = 'user' | 'mentor'

export type MentorMessage = {
  id: string
  role: MentorRole
  text: string
  promptId?: string
  createdAt: string
}

export type MentorPromptId =
  | 'fit'
  | 'traits'
  | 'compare'
  | 'skills'
  | 'fields'
  | 'results'
  | 'aboutSaved'
  | 'compareSaved'

export type MentorRequest = {
  message: string
  promptId?: MentorPromptId
  history: MentorMessage[]
  locale: 'en' | 'ru' | 'kz'
}

export type MentorReply = {
  text: string
}

export type MentorService = {
  reply: (request: MentorRequest) => Promise<MentorReply>
}
