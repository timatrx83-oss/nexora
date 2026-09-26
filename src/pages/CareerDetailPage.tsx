import { Link, useParams } from 'react-router-dom'
import { CAREER_BY_ID, careerMatch, careerRelevance, formatMatchReason, getCareer, type Career } from '../careers'
import { CosmicField } from '../components/home/CosmicField'
import { CareerCard } from '../components/explore/CareerCard'
import { CareerSaveButton } from '../components/explore/CareerSaveButton'
import { Container } from '../components/ui/Container'
import { useAssessmentResult } from '../assessment/useAssessmentResult'
import { useI18n } from '../i18n/I18nProvider'
import '../styles/explore.css'

export function CareerDetailPage() {
  const { careerId = '' } = useParams()
  const { t } = useI18n()
  const result = useAssessmentResult()
  const career = getCareer(careerId)
  const copy = t.careers[careerId]

  if (!career || !copy) {
    return (
      <div className="explore-page">
        <CosmicField />
        <Container className="explore-detail">
          <Link to="/explore" className="explore-back">
            {t.explore.back}
          </Link>
          <h1>{t.explore.missing}</h1>
        </Container>
      </div>
    )
  }

  const match = result ? careerMatch(career, result) : null
  const relevance = match?.level ?? null
  const reason = match ? formatMatchReason(match.reason, t) : null
  const related = career.related
    .map((id) => CAREER_BY_ID[id])
    .filter((item): item is Career => Boolean(item))
    .slice(0, 3)

  return (
    <article className="explore-page explore-detail">
      <CosmicField />
      <Container>
        <Link to="/explore" className="explore-back">
          {t.explore.back}
        </Link>
        <div className="explore-detail__panel">
          <p className="kicker">{t.explore.fields[career.field]}</p>
          <div className="explore-detail__head">
            <h1>{copy.title}</h1>
            <CareerSaveButton careerId={career.id} title={copy.title} />
          </div>
          {relevance ? (
            <p className={`career-card__badge career-card__badge--${relevance}`}>
              {relevance === 'strong'
                ? t.explore.strong
                : relevance === 'good'
                  ? t.explore.good
                  : t.explore.low}
            </p>
          ) : null}
          {match ? (
            <span className={`career-card__meter career-card__meter--${match.level}`} aria-hidden="true">
              <span style={{ width: `${Math.max(8, Math.round(match.score * 100))}%` }} />
            </span>
          ) : null}
          <p className="lede">{copy.summary}</p>
          {reason ? (
            <p className="career-card__why career-card__why--detail">
              <span>{t.explore.why}</span>
              {reason}
            </p>
          ) : null}
          {result ? <p className="explore-note">{t.explore.relevanceNote}</p> : null}
        </div>

        <section className="explore-detail__block">
          <h2>{t.explore.about}</h2>
          <p>{copy.about}</p>
        </section>

        <section className="explore-detail__block">
          <h2>{t.explore.activities}</h2>
          <ul>
            {copy.activities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="explore-detail__block">
          <h2>{t.explore.skills}</h2>
          <ul className="explore-detail__skills">
            {career.skillTags.map((tag) => (
              <li key={tag}>{t.explore.skillTags[tag]}</li>
            ))}
          </ul>
        </section>

        <section className="explore-detail__block">
          <h2>{t.explore.enjoyIf}</h2>
          <p>{copy.enjoyIf}</p>
        </section>

        {related.length > 0 ? (
          <section className="explore-detail__block">
            <h2>{t.explore.related}</h2>
            <div className="explore-grid explore-grid--related">
              {related.map((item) => (
                <CareerCard
                  key={item.id}
                  career={item}
                  relevance={careerRelevance(item, result)}
                />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </article>
  )
}
