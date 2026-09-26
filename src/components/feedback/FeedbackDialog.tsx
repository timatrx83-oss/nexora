import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react'
import { insertFeedback } from '../../feedback/submit'
import { saveFeedback, ratingsAreComplete, type RatingKey, type RecommendationAnswer, type StarRatingValue } from '../../feedback/storage'
import { useI18n } from '../../i18n/I18nProvider'
import { Button } from '../ui/Button'
import '../../styles/feedback.css'

const STARS = [1, 2, 3, 4, 5] as const
const RECOMMENDATIONS = ['yes', 'maybe', 'no'] as const

type RatingsState = Record<RatingKey, StarRatingValue | null>

const EMPTY_RATINGS: RatingsState = {
  overallExperience: null,
  easeOfUse: null,
  visualDesign: null,
  assessmentExperience: null,
  likelihoodToUseAgain: null,
}

type FeedbackDialogProps = {
  onClose: () => void
}

export function FeedbackDialog({ onClose }: FeedbackDialogProps) {
  const { t, locale } = useI18n()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const onCloseRef = useRef(onClose)
  const titleId = useId()
  const hintId = useId()
  const likedId = useId()
  const improveId = useId()
  const recommendId = useId()

  const [ratings, setRatings] = useState<RatingsState>(EMPTY_RATINGS)
  const [likedMost, setLikedMost] = useState('')
  const [improve, setImprove] = useState('')
  const [recommendation, setRecommendation] = useState<RecommendationAnswer | null>(null)
  const [error, setError] = useState(false)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!dialog.open) dialog.showModal()
    const handleClose = () => onCloseRef.current()
    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('close', handleClose)
    }
  }, [])

  const ratingFields: { key: RatingKey; label: string }[] = [
    { key: 'overallExperience', label: t.feedback.overall },
    { key: 'easeOfUse', label: t.feedback.ease },
    { key: 'visualDesign', label: t.feedback.design },
    { key: 'assessmentExperience', label: t.feedback.assessment },
    { key: 'likelihoodToUseAgain', label: t.feedback.return },
  ]

  const ready = ratingsAreComplete(ratings)

  function requestClose() {
    dialogRef.current?.close()
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!ratingsAreComplete(ratings) || submittingRef.current) return
    const draft = {
      locale,
      ratings,
      likedMost,
      improve,
      recommendation,
    }
    submittingRef.current = true
    setSubmitting(true)
    setError(false)
    const inserted = await insertFeedback(draft)
    if (!inserted) {
      submittingRef.current = false
      setSubmitting(false)
      setError(true)
      return
    }
    saveFeedback(draft)
    setError(false)
    setDone(true)
  }

  function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    const dialog = event.currentTarget
    const rect = dialog.getBoundingClientRect()
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    if (!inside) dialog.close()
  }

  return (
    <dialog
      ref={dialogRef}
      className="feedback-dialog"
      aria-labelledby={titleId}
      onClick={onBackdropClick}
    >
      <div className="feedback-dialog__panel">
        <header className="feedback-dialog__head">
          <div>
            <h2 id={titleId}>{done ? t.feedback.successTitle : t.feedback.title}</h2>
            {done ? null : <p className="feedback-lede">{t.feedback.lede}</p>}
          </div>
          <button type="button" className="feedback-close" onClick={requestClose} aria-label={t.feedback.close}>
            <CloseIcon />
          </button>
        </header>

        {done ? (
          <div className="feedback-success" role="status">
            <p>{t.feedback.successBody}</p>
            <Button type="button" onClick={requestClose}>
              {t.feedback.done}
            </Button>
          </div>
        ) : (
          <form className="feedback-form" onSubmit={onSubmit}>
            <div className="feedback-dialog__body">
              <div className="feedback-ratings">
                {ratingFields.map((field) => (
                  <StarRating
                    key={field.key}
                    label={field.label}
                    value={ratings[field.key]}
                    valueLabel={(n) => t.feedback.star.replace('{n}', String(n))}
                    onChange={(value) => {
                      setRatings((current) => ({ ...current, [field.key]: value }))
                      setError(false)
                    }}
                  />
                ))}
              </div>

              <div className="feedback-field">
                <label htmlFor={likedId}>
                  {t.feedback.liked}
                  <span className="feedback-optional">{t.feedback.optional}</span>
                </label>
                <textarea
                  id={likedId}
                  name="likedMost"
                  maxLength={2000}
                  autoComplete="off"
                  value={likedMost}
                  onChange={(event) => setLikedMost(event.target.value)}
                />
              </div>

              <div className="feedback-field">
                <label htmlFor={improveId}>
                  {t.feedback.improve}
                  <span className="feedback-optional">{t.feedback.optional}</span>
                </label>
                <textarea
                  id={improveId}
                  name="improve"
                  maxLength={2000}
                  autoComplete="off"
                  value={improve}
                  onChange={(event) => setImprove(event.target.value)}
                />
              </div>

              <div className="feedback-field">
                <p id={recommendId} className="feedback-field__label">
                  {t.feedback.recommend}
                  <span className="feedback-optional">{t.feedback.optional}</span>
                </p>
                <RecommendationChoice
                  labelledBy={recommendId}
                  value={recommendation}
                  labels={{
                    yes: t.feedback.yes,
                    maybe: t.feedback.maybe,
                    no: t.feedback.no,
                  }}
                  onChange={setRecommendation}
                />
              </div>
            </div>

            <div className="feedback-actions">
              <p id={hintId} className="feedback-hint">
                {t.feedback.hint}
              </p>
              {error ? (
                <p className="feedback-error" role="alert">
                  {t.feedback.error}
                </p>
              ) : null}
              <Button type="submit" disabled={!ready || submitting} aria-describedby={hintId}>
                {t.feedback.submit}
              </Button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  )
}

function StarRating({
  label,
  value,
  valueLabel,
  onChange,
}: {
  label: string
  value: StarRatingValue | null
  valueLabel: (n: number) => string
  onChange: (value: StarRatingValue) => void
}) {
  const labelId = useId()
  const [hover, setHover] = useState<StarRatingValue | null>(null)
  const shown = hover ?? value ?? 0

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const current = value ?? 0
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      onChange(Math.min(5, current + 1) as StarRatingValue)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      onChange(Math.max(1, (current || 1) - 1) as StarRatingValue)
    } else if (event.key === 'Home') {
      event.preventDefault()
      onChange(1)
    } else if (event.key === 'End') {
      event.preventDefault()
      onChange(5)
    }
  }

  function onPointerEnter(event: PointerEvent<HTMLButtonElement>, star: StarRatingValue) {
    if (event.pointerType === 'mouse') setHover(star)
  }

  return (
    <div className="feedback-rating">
      <span id={labelId} className="feedback-rating__label">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-required="true"
        className="feedback-stars"
        onKeyDown={onKeyDown}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setHover(null)
        }}
      >
        {STARS.map((star) => {
          const selected = value === star
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={valueLabel(star)}
              tabIndex={value === null ? (star === 1 ? 0 : -1) : selected ? 0 : -1}
              className={star <= shown ? 'feedback-star is-lit' : 'feedback-star'}
              onPointerEnter={(event) => onPointerEnter(event, star)}
              onClick={() => onChange(star)}
            >
              <StarIcon />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RecommendationChoice({
  labelledBy,
  value,
  labels,
  onChange,
}: {
  labelledBy: string
  value: RecommendationAnswer | null
  labels: Record<RecommendationAnswer, string>
  onChange: (value: RecommendationAnswer | null) => void
}) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = value ? RECOMMENDATIONS.indexOf(value) : -1
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      onChange(RECOMMENDATIONS[Math.min(RECOMMENDATIONS.length - 1, index + 1)] ?? 'yes')
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      onChange(RECOMMENDATIONS[Math.max(0, index <= 0 ? 0 : index - 1)] ?? 'yes')
    } else if (event.key === 'Home') {
      event.preventDefault()
      onChange('yes')
    } else if (event.key === 'End') {
      event.preventDefault()
      onChange('no')
    }
  }

  return (
    <div role="radiogroup" aria-labelledby={labelledBy} className="feedback-choice" onKeyDown={onKeyDown}>
      {RECOMMENDATIONS.map((option) => {
        const selected = value === option
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={value === null ? (option === 'yes' ? 0 : -1) : selected ? 0 : -1}
            className={selected ? 'feedback-choice__option is-selected' : 'feedback-choice__option'}
            onClick={() => onChange(selected ? null : option)}
          >
            {labels[option]}
          </button>
        )
      })}
    </div>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.1 14.7 8.7l6.1.9-4.4 4.3 1 6.1L12 17.1 6.6 20l1-6.1L3.2 9.6l6.1-.9L12 3.1z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" />
    </svg>
  )
}
