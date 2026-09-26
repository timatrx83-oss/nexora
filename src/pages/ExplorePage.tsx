import { useMemo, useState } from 'react'
import { CAREERS, CAREER_FIELD_IDS, careerMatch, careerRelevance, matchCareers } from '../careers'
import { filterCareers } from '../careers/search'
import type { CareerFieldId } from '../careers/types'
import type { CareerMatch } from '../careers/match'
import { CosmicField } from '../components/home/CosmicField'
import { CareerCard } from '../components/explore/CareerCard'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { useAssessmentResult } from '../assessment/useAssessmentResult'
import { useI18n } from '../i18n/I18nProvider'
import '../styles/explore.css'

const GOOD_CAP = 9
const LOW_CAP = 6

export function ExplorePage() {
  const { t } = useI18n()
  const result = useAssessmentResult()
  const [query, setQuery] = useState('')
  const [field, setField] = useState<CareerFieldId | 'all'>('all')

  const filtered = useMemo(
    () => filterCareers(CAREERS, field, query, t),
    [field, query, t],
  )

  const ranked = useMemo(() => {
    if (!result) {
      return filtered.map((career) => ({ career, relevance: careerRelevance(career, null), match: undefined }))
    }
    return filtered
      .map((career) => {
        const match = careerMatch(career, result)
        return { career, relevance: match.level, match }
      })
      .sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0))
  }, [filtered, result])

  const personalized = useMemo(() => {
    if (!result) return { strong: [], good: [], low: [] }
    const rankedAll = matchCareers(CAREERS, result)
    return {
      strong: rankedAll.filter((item) => item.match.level === 'strong').slice(0, 9),
      good: rankedAll.filter((item) => item.match.level === 'good').slice(0, GOOD_CAP),
      low: rankedAll.filter((item) => item.match.level === 'low').slice(0, LOW_CAP),
    }
  }, [result])

  const showEmpty = filtered.length === 0

  return (
    <div className="explore-page">
      <CosmicField />
      <header className="explore-hero">
        <Container>
          <div className="explore-hero__panel">
            <div className="explore-thread" aria-hidden="true">
              <span />
              <i />
              <span />
              <i />
              <span />
              <i />
              <span />
            </div>
            <p className="kicker">{t.explore.kicker}</p>
            <h1>{t.explore.heading}</h1>
            <p className="lede">{t.explore.lede}</p>
            <p className="explore-hero__idea">{t.explore.idea}</p>
          </div>
        </Container>
      </header>

      <Container>
        {result ? (
          <section className="explore-matching" aria-labelledby="explore-matching">
            <h2 id="explore-matching">{t.explore.matching}</h2>
            <p className="explore-section__lede">{t.explore.matchingLede}</p>
            <p className="explore-note">{t.explore.matchingNote}</p>

            <MatchBand
              mark="✦"
              title={t.explore.strong}
              level="strong"
              items={personalized.strong}
            />
            <MatchBand mark="◈" title={t.explore.good} level="good" items={personalized.good} />
            <MatchBand mark="○" title={t.explore.low} level="low" items={personalized.low} />
          </section>
        ) : (
          <section className="explore-matching explore-matching--empty" aria-labelledby="explore-matching-empty">
            <h2 id="explore-matching-empty">{t.explore.matchingEmptyTitle}</h2>
            <p className="explore-section__lede">{t.explore.matchingEmptyLede}</p>
            <Button to="/assessment">{t.explore.takeAssessment}</Button>
          </section>
        )}

        <section className="explore-section" aria-labelledby="explore-all">
            <h2 id="explore-all">{t.explore.allCareers}</h2>
            {result ? <p className="explore-section__lede">{t.explore.allCareersLede}</p> : null}

            <label className="explore-search">
              <span className="sr-only">{t.explore.searchLabel}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.explore.search}
                autoComplete="off"
                enterKeyHint="search"
              />
            </label>

            <div className="explore-toolbar">
              <div className="explore-chips" role="radiogroup" aria-label={t.explore.filtersLabel}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={field === 'all'}
                  className={field === 'all' ? 'is-active' : undefined}
                  onClick={() => setField('all')}
                >
                  {t.explore.all}
                </button>
                {CAREER_FIELD_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    role="radio"
                    aria-checked={field === id}
                    className={field === id ? 'is-active' : undefined}
                    onClick={() => setField(id)}
                  >
                    {t.explore.filters[id]}
                  </button>
                ))}
              </div>
              <p className="explore-count">{t.explore.count.replace('{count}', String(filtered.length))}</p>
            </div>

            {showEmpty ? (
              <div className="explore-empty" role="status">
                <h2>{t.explore.empty}</h2>
                <p>{t.explore.emptyLede}</p>
              </div>
            ) : (
              <div className="explore-grid">
                {ranked.map(({ career, relevance, match }) => (
                  <CareerCard key={career.id} career={career} relevance={relevance} match={match} />
                ))}
              </div>
            )}
          </section>
      </Container>
    </div>
  )
}

function MatchBand({
  mark,
  title,
  level,
  items,
}: {
  mark: string
  title: string
  level: 'strong' | 'good' | 'low'
  items: { career: ReturnType<typeof matchCareers>[number]['career']; match: CareerMatch }[]
}) {
  if (items.length === 0) return null
  return (
    <div className={`explore-group explore-group--${level}`}>
      <h3>
        <span aria-hidden="true">{mark}</span> {title}
      </h3>
      <div className="explore-grid">
        {items.map(({ career, match }) => (
          <CareerCard
            key={career.id}
            career={career}
            relevance={match.level}
            match={match}
            showLow
            variant="personalized"
          />
        ))}
      </div>
    </div>
  )
}
