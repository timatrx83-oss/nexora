import type { AssessmentResult, StrengthThemeLevel } from '../../assessment/types'
import { SKILL_IDS } from '../../assessment/types'
import { rankedThemes, themesInBand, type RankedTheme } from '../../assessment/score'
import { Button } from '../ui/Button'
import { useI18n } from '../../i18n/I18nProvider'

type AssessmentResultViewProps = {
  result: AssessmentResult
  onRetake: () => void
}

function workStyleSentence(
  ids: AssessmentResult['workStyle'],
  preferOne: string,
  preferTwo: string,
  hints: Record<string, string>,
) {
  const [first, second] = ids
  if (!first) return ''
  if (!second) return preferOne.replace('{item}', hints[first])
  return preferTwo.replace('{a}', hints[first]).replace('{b}', hints[second])
}

function profileSummary(
  highs: RankedTheme[],
  templates: {
    summaryThree: string
    summaryTwo: string
    summaryOne: string
    summaryOpen: string
  },
  essence: Record<string, string>,
) {
  const [a, b, c] = highs
  if (a && b && c) {
    return templates.summaryThree
      .replace('{a}', essence[a.id])
      .replace('{b}', essence[b.id])
      .replace('{c}', essence[c.id])
  }
  if (a && b) {
    return templates.summaryTwo.replace('{a}', essence[a.id]).replace('{b}', essence[b.id])
  }
  if (a) return templates.summaryOne.replace('{a}', essence[a.id])
  return templates.summaryOpen
}

export function AssessmentResultView({ result, onRetake }: AssessmentResultViewProps) {
  const { t } = useI18n()
  const copy = t.assessment.result
  const scores = result.signals?.themes
  const ranked = rankedThemes(result.strengthThemes, scores)
  const highs = themesInBand(result.strengthThemes, 'high', scores)
  const mediums = themesInBand(result.strengthThemes, 'medium', scores)
  const lows = themesInBand(result.strengthThemes, 'low', scores)
  const summary = profileSummary(highs, copy, t.assessment.themeEssence)
  const narrative = workStyleSentence(
    result.workStyle,
    t.assessment.workStylePreferOne,
    t.assessment.workStylePreferTwo,
    t.assessment.workStyleHints,
  )

  return (
    <section className="assess-result">
      <p className="kicker">{copy.kicker}</p>
      <h1>{summary}</h1>
      <p className="lede">{copy.lede}</p>

      <article className="assess-profile">
        <p className="meta">{copy.strengthsProfile}</p>
        <p className="assess-profile__lede">{copy.strengthsLede}</p>
        <div className="assess-constellation" role="img" aria-label={copy.vizLabel}>
          {ranked.map((item) => {
            const height = Math.max(14, item.score)
            return (
              <span
                key={item.id}
                className={`assess-star assess-star--${item.level}`}
                title={t.assessment.themeNames[item.id]}
                style={{ height: `${height}%` }}
              >
                <i />
              </span>
            )
          })}
        </div>
      </article>

      <ThemeBand band="high" items={highs} />
      <ThemeBand band="medium" items={mediums} />
      <ThemeBand band="low" items={lows} />

      <article className="assess-block">
        <p className="meta">{copy.interests}</p>
        <p className="assess-block__lede">{copy.interestsLede}</p>
        <ul className="assess-interest-list">
          {result.interests.map((id) => (
            <li key={id}>{t.assessment.interestNames[id]}</li>
          ))}
        </ul>
      </article>

      <article className="assess-block">
        <p className="meta">{copy.workStyle}</p>
        {narrative ? <p className="assess-block__lede">{narrative}</p> : null}
      </article>

      <article className="assess-block">
        <p className="meta">{copy.skills}</p>
        <p className="assess-block__lede">{copy.skillsLede}</p>
        <ul className="assess-skill-snap">
          {SKILL_IDS.map((id) => {
            const value = result.skills[id] ?? 1
            return (
              <li key={id}>
                <div>
                  <span>{t.assessment.skillNames[id]}</span>
                  <em>
                    {value}/5 · {t.assessment.scale[value as 1 | 2 | 3 | 4 | 5]}
                  </em>
                </div>
                <span className="assess-skill-snap__track">
                  <span style={{ width: `${(value / 5) * 100}%` }} />
                </span>
              </li>
            )
          })}
        </ul>
      </article>

      <div className="assess-result__cta">
        <h2>{copy.ready}</h2>
        <div className="btn-row">
          <Button to="/explore">{copy.explore}</Button>
          <Button variant="secondary" to="/mentor">
            {copy.mentor}
          </Button>
          <Button variant="ghost" onClick={onRetake}>
            {copy.retake}
          </Button>
        </div>
        <p className="assess-intro__note">{copy.disclaimer}</p>
      </div>
    </section>
  )
}

function ThemeBand({ band, items }: { band: StrengthThemeLevel; items: RankedTheme[] }) {
  const { t } = useI18n()
  const bandCopy = t.assessment.bands[band]
  if (items.length === 0) return null

  return (
    <section className={`assess-band assess-band--${band}`}>
      <header>
        <p className="meta">
          <span aria-hidden="true">{bandCopy.mark}</span> {bandCopy.title}
        </p>
        <p className="assess-band__lede">{bandCopy.lede}</p>
      </header>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={`assess-theme-card assess-theme-card--${band}`}>
            <div className="assess-theme-card__top">
              <h3>{t.assessment.themeNames[item.id]}</h3>
              <em>
                {t.assessment.themeLevels[band]}
                <span className="assess-theme-card__score">{item.score}</span>
              </em>
            </div>
            <p>{t.assessment.themeNotes[item.id]}</p>
            <span className="assess-theme-card__bar" aria-hidden="true">
              <span style={{ width: `${Math.max(10, item.score)}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
