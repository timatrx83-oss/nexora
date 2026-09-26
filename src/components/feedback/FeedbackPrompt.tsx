import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getStoredDraft, getStoredResult, subscribeToAssessmentResult } from '../../assessment/storage'
import { markFeedbackPromptShown, wasFeedbackPromptShown } from '../../feedback/promptStorage'
import { useI18n } from '../../i18n/I18nProvider'
import { Button } from '../ui/Button'
import { FeedbackDialog } from './FeedbackDialog'
import '../../styles/feedback.css'

const ASSESSMENT_DELAY_MS = 1500
const BROWSE_DELAY_MS = 800
const BROWSE_VISITS = 2

export function FeedbackPrompt() {
  const { t } = useI18n()
  const { pathname } = useLocation()
  const headingId = useId()
  const messageId = useId()
  const cardRef = useRef<HTMLDivElement>(null)
  const opened = useRef(false)
  const entryPath = useRef<string | null>(null)
  const visits = useRef(0)
  const [visible, setVisible] = useState(false)
  const [formOpen, setFormOpen] = useState(false)

  const reveal = useCallback((reason: 'assessment' | 'browse') => {
    if (opened.current || wasFeedbackPromptShown()) return
    if (getStoredDraft()?.phase === 'questions') return
    if (reason === 'assessment' && !getStoredResult()) return
    opened.current = true
    markFeedbackPromptShown()
    setVisible(true)
  }, [])

  useEffect(() => {
    if (wasFeedbackPromptShown()) return
    let timer = 0
    const unsubscribe = subscribeToAssessmentResult(() => {
      if (!getStoredResult()) return
      window.clearTimeout(timer)
      timer = window.setTimeout(() => reveal('assessment'), ASSESSMENT_DELAY_MS)
    })
    return () => {
      window.clearTimeout(timer)
      unsubscribe()
    }
  }, [reveal])

  useEffect(() => {
    if (wasFeedbackPromptShown()) return
    if (entryPath.current === null) {
      entryPath.current = pathname
      return
    }
    if (pathname === entryPath.current) return
    visits.current += 1
    if (visits.current < BROWSE_VISITS) return
    if (pathname === '/assessment') return
    const timer = window.setTimeout(() => reveal('browse'), BROWSE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [pathname, reveal])

  useEffect(() => {
    if (!visible) return
    const card = cardRef.current
    card?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setVisible(false)
        return
      }
      if (event.key !== 'Tab' || !card) return
      const items = Array.from(
        card.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'),
      )
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible])

  const dismiss = () => setVisible(false)

  const giveFeedback = () => {
    setVisible(false)
    setFormOpen(true)
  }

  return (
    <>
      {visible ? (
        <div className="feedback-prompt">
          <div className="feedback-prompt__backdrop" onClick={dismiss} />
          <div
            ref={cardRef}
            className="feedback-prompt__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            aria-describedby={messageId}
            tabIndex={-1}
          >
            <button type="button" className="feedback-close" onClick={dismiss} aria-label={t.feedback.close}>
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
              </svg>
            </button>
            <h2 id={headingId}>{t.feedback.promptHeading}</h2>
            <p id={messageId}>{t.feedback.promptMessage}</p>
            <div className="feedback-prompt__actions">
              <Button type="button" onClick={giveFeedback}>
                {t.feedback.promptYes}
              </Button>
              <Button type="button" variant="secondary" onClick={dismiss}>
                {t.feedback.promptLater}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      {formOpen ? <FeedbackDialog onClose={() => setFormOpen(false)} /> : null}
    </>
  )
}
