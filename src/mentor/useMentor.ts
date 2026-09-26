import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAssessmentResult } from '../assessment/useAssessmentResult'
import { useSavedCareers } from '../careers/useSavedCareers'
import { useI18n } from '../i18n/I18nProvider'
import { buildMentorAiProfile } from './aiProfile'
import { createMentorService } from './service'
import { buildMentorSnapshot } from './snapshot'
import { mentorStarters } from './starters'
import { clearConversation, loadConversation, saveConversation } from './storage'
import type { MentorMessage, MentorPromptId } from './types'

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function useMentor() {
  const { t, locale } = useI18n()
  const assessment = useAssessmentResult()
  const saved = useSavedCareers()
  const snapshot = useMemo(
    () => buildMentorSnapshot(assessment, saved.ids),
    [assessment, saved.ids],
  )
  const profile = useMemo(
    () => buildMentorAiProfile(assessment, saved.ids, t, locale),
    [assessment, locale, saved.ids, t],
  )
  const service = useMemo(() => createMentorService({ profile, snapshot, t }), [profile, snapshot, t])
  const [messages, setMessages] = useState<MentorMessage[]>(() => loadConversation())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const pending = useRef(0)
  const lastUser = useRef<string | null>(null)

  useEffect(() => {
    saveConversation(messages)
  }, [messages])

  const send = useCallback(
    async (text: string, promptId?: MentorPromptId, options?: { retry?: boolean }) => {
      const trimmed = text.trim()
      if (!trimmed || loading) return
      const userMessage: MentorMessage = {
        id: makeId(),
        role: 'user',
        text: trimmed,
        promptId,
        createdAt: new Date().toISOString(),
      }
      const history = options?.retry ? messages : [...messages, userMessage]
      if (!options?.retry) setMessages(history)
      lastUser.current = trimmed
      setError(false)
      setLoading(true)
      pending.current += 1
      const token = pending.current
      try {
        const reply = await service.reply({
          message: trimmed,
          promptId,
          history,
          locale,
        })
        if (token !== pending.current) return
        setMessages((current) => [
          ...current,
          {
            id: makeId(),
            role: 'mentor',
            text: reply.text,
            createdAt: new Date().toISOString(),
          },
        ])
      } catch {
        if (token !== pending.current) return
        setError(true)
      } finally {
        if (token === pending.current) setLoading(false)
      }
    },
    [loading, locale, messages, service],
  )

  const retry = useCallback(() => {
    const text = lastUser.current
    if (!text || loading) return
    void send(text, undefined, { retry: true })
  }, [loading, send])

  const clear = useCallback(() => {
    pending.current += 1
    lastUser.current = null
    setError(false)
    setLoading(false)
    setMessages([])
    clearConversation()
  }, [])

  return {
    snapshot,
    messages,
    loading,
    error,
    starters: mentorStarters(t, snapshot),
    send,
    retry,
    clear,
    hasChat: messages.some((item) => item.role === 'user'),
  }
}
