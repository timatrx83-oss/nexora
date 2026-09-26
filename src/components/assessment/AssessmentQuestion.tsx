import { useEffect, useRef } from 'react'
import type { ChoiceQuestion } from '../../assessment/types'
import { Button } from '../ui/Button'
import { useI18n } from '../../i18n/I18nProvider'

type AssessmentQuestionProps = {
  question: ChoiceQuestion
  selected?: string
  error: string | null
  onSelect: (optionId: string) => void
  onNext: () => void
  onBack: () => void
}

export function AssessmentQuestion({
  question,
  selected,
  error,
  onSelect,
  onNext,
  onBack,
}: AssessmentQuestionProps) {
  const { t } = useI18n()
  const copy = t.assessment.questions[question.id as keyof typeof t.assessment.questions]
  const variant = question.options.length > 4 ? 'assess-options--split' : ''
  const groupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && selected) {
        const target = event.target as HTMLElement | null
        if (target && (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT')) return
        event.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onNext, selected])

  return (
    <div className="assess-q">
      <h2>{copy.prompt}</h2>
      <div
        ref={groupRef}
        className={`assess-options ${variant}`.trim()}
        role="listbox"
        aria-label={copy.prompt}
      >
        {question.options.map((option, index) => {
          const active = selected === option.id
          const label = copy.options[option.id as keyof typeof copy.options]
          return (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={active}
              className={active ? 'assess-option is-active' : 'assess-option'}
              onClick={() => onSelect(option.id)}
              onKeyDown={(event) => {
                if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
                event.preventDefault()
                const delta = event.key === 'ArrowDown' ? 1 : -1
                const next = question.options[(index + delta + question.options.length) % question.options.length]
                const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('button')
                buttons?.[(index + delta + question.options.length) % question.options.length]?.focus()
                onSelect(next.id)
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
      {error === 'choose' ? (
        <p className="assess-error" role="alert">
          {t.assessment.choose}
        </p>
      ) : null}
      <div className="assess-nav">
        <Button variant="ghost" onClick={onBack}>
          {t.assessment.back}
        </Button>
        <Button onClick={onNext}>{t.assessment.continue}</Button>
      </div>
    </div>
  )
}
