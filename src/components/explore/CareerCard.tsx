import { Link } from 'react-router-dom'
import type { Career } from '../../careers/types'
import type { CareerMatch, CareerRelevance } from '../../careers/match'
import { formatMatchReason } from '../../careers/reason'
import { useI18n } from '../../i18n/I18nProvider'
import { CareerSaveButton } from './CareerSaveButton'

type CareerCardProps = {
  career: Career
  relevance: CareerRelevance
  match?: CareerMatch
  showLow?: boolean
  variant?: 'catalog' | 'personalized'
}

export function CareerCard({
  career,
  relevance,
  match,
  showLow = false,
  variant = 'catalog',
}: CareerCardProps) {
  const { t } = useI18n()
  const copy = t.careers[career.id]
  if (!copy) return null

  const level = match?.level ?? relevance
  const showBadge = level === 'strong' || level === 'good' || (showLow && level === 'low') || variant === 'personalized'
  const badgeLabel =
    level === 'strong' ? t.explore.strong : level === 'good' ? t.explore.good : t.explore.low
  const reason = match ? formatMatchReason(match.reason, t) : null
  const signals = [
    ...career.interests.slice(0, 2).map((id) => t.assessment.interestNames[id]),
    ...career.themes.slice(0, 1).map((id) => t.assessment.themeNames[id]),
  ]
  const tags =
    variant === 'personalized'
      ? signals
      : career.skillTags.map((tag) => t.explore.skillTags[tag])

  return (
    <article
      className={`career-card${variant === 'personalized' && level ? ` career-card--${level}` : ''}`}
    >
      <Link to={`/explore/${career.id}`} className="career-card__link">
        <p className="career-card__field">{t.explore.fields[career.field]}</p>
        <h3 className="career-card__title">{copy.title}</h3>
        {showBadge && level ? (
          <p className={`career-card__badge career-card__badge--${level}`}>{badgeLabel}</p>
        ) : null}
        {variant === 'personalized' && match ? (
          <span className="career-card__meter" aria-hidden="true">
            <span style={{ width: `${Math.max(8, Math.round(match.score * 100))}%` }} />
          </span>
        ) : null}
        {variant === 'personalized' && reason ? (
          <p className="career-card__why">
            <span>{t.explore.why}</span>
            {reason}
          </p>
        ) : (
          <p className="career-card__summary">{copy.summary}</p>
        )}
        <p className="career-card__skills">
          {tags.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </p>
        <p className="career-card__details">{t.explore.details}</p>
      </Link>
      <div className="career-card__actions">
        <CareerSaveButton careerId={career.id} title={copy.title} />
      </div>
    </article>
  )
}
