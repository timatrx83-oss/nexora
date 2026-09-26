import { useCallback, useEffect, useState } from 'react'
import { QUESTIONS, QUESTION_COUNT, SKILL_STEP_INDEX, stepNumberForIndex } from './questions'
import { buildResult, isSkillsComplete } from './score'
import { clearAssessment, emptyDraft, getStoredDraft, getStoredResult, saveDraft, saveResult } from './storage'
import { ASSESSMENT_SCHEMA, SKILL_IDS, type AssessmentDraft, type SkillId } from './types'

function hydrate(): AssessmentDraft {
  const draft = getStoredDraft()
  const result = getStoredResult()
  if (draft?.phase === 'questions') return draft
  if (result) {
    return {
      phase: 'result',
      questionIndex: 0,
      answers: result.answers.questions,
      skills: result.skills,
      result,
      contentVersion: ASSESSMENT_SCHEMA,
    }
  }
  return draft ?? emptyDraft()
}

export function useAssessment() {
  const [draft, setDraft] = useState<AssessmentDraft>(hydrate)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    saveDraft(draft)
  }, [draft])

  const question =
    draft.phase === 'questions' && draft.questionIndex < QUESTIONS.length
      ? QUESTIONS[draft.questionIndex]
      : null

  const start = useCallback(() => {
    clearAssessment()
    setError(null)
    setDraft({
      phase: 'questions',
      questionIndex: 0,
      answers: {},
      skills: {},
      result: null,
      contentVersion: ASSESSMENT_SCHEMA,
    })
  }, [])

  const resume = useCallback(() => {
    setError(null)
    setDraft((current) => ({ ...current, phase: 'questions' }))
  }, [])

  const viewResult = useCallback(() => {
    const stored = getStoredResult()
    if (!stored) return
    setError(null)
    setDraft({
      phase: 'result',
      questionIndex: 0,
      answers: stored.answers.questions,
      skills: stored.skills,
      result: stored,
      contentVersion: ASSESSMENT_SCHEMA,
    })
  }, [])

  const selectOption = useCallback((questionId: string, optionId: string) => {
    setError(null)
    setDraft((current) => ({
      ...current,
      answers: { ...current.answers, [questionId]: optionId },
    }))
  }, [])

  const rateSkill = useCallback((id: SkillId, value: number) => {
    setError(null)
    setDraft((current) => ({
      ...current,
      skills: { ...current.skills, [id]: value },
    }))
  }, [])

  const next = useCallback(() => {
    if (draft.phase !== 'questions') return
    const index = draft.questionIndex
    if (index < QUESTIONS.length) {
      if (!draft.answers[QUESTIONS[index].id]) {
        setError('choose')
        return
      }
      setError(null)
      setDraft({ ...draft, questionIndex: index + 1 })
      return
    }
    if (!isSkillsComplete(draft.skills)) {
      setError('rateAll')
      return
    }
    const skills = Object.fromEntries(
      SKILL_IDS.map((skill) => [skill, draft.skills[skill] ?? 1]),
    ) as Record<SkillId, number>
    const result = buildResult(draft.answers, skills)
    saveResult(result)
    setError(null)
    setDraft({ ...draft, phase: 'result', result, skills })
  }, [draft])

  const back = useCallback(() => {
    setError(null)
    setDraft((current) => {
      if (current.phase === 'questions' && current.questionIndex === 0) {
        return { ...current, phase: 'intro' }
      }
      if (current.phase === 'questions') {
        return { ...current, questionIndex: current.questionIndex - 1 }
      }
      return current
    })
  }, [])

  const retake = useCallback(() => {
    clearAssessment()
    setError(null)
    setDraft(emptyDraft())
  }, [])

  const storedResult = draft.result ?? getStoredResult()

  return {
    draft,
    error,
    question,
    isSkillStep: draft.phase === 'questions' && draft.questionIndex === SKILL_STEP_INDEX,
    progressCurrent: draft.phase === 'result' ? 5 : stepNumberForIndex(draft.questionIndex),
    progressTotal: 5,
    questionTotal: QUESTION_COUNT,
    start,
    resume,
    viewResult,
    selectOption,
    rateSkill,
    next,
    back,
    retake,
    canResume:
      draft.phase === 'intro' && Object.keys(draft.answers).length > 0 && !getStoredResult(),
    hasResult: Boolean(storedResult),
  }
}
