import { SKILL_IDS, type SkillId } from '../../assessment/types'
import { Button } from '../ui/Button'
import { useI18n } from '../../i18n/I18nProvider'

type AssessmentSkillsProps = {
  values: Partial<Record<SkillId, number>>
  error: string | null
  onRate: (id: SkillId, value: number) => void
  onNext: () => void
  onBack: () => void
}

export function AssessmentSkills({ values, error, onRate, onNext, onBack }: AssessmentSkillsProps) {
  const { t } = useI18n()

  return (
    <div className="assess-q">
      <h2>{t.assessment.skillsPrompt}</h2>
      <p className="assess-hint">{t.assessment.skillsHint}</p>
      <ol className="assess-scale-legend" aria-hidden="true">
        {([1, 2, 3, 4, 5] as const).map((n) => (
          <li key={n}>
            <span>{n}</span>
            {t.assessment.scale[n]}
          </li>
        ))}
      </ol>
      <ul className="assess-skills">
        {SKILL_IDS.map((id) => (
          <li key={id} className="assess-skill">
            <p>{t.assessment.skillNames[id]}</p>
            <div className="assess-skill__scale" role="radiogroup" aria-label={t.assessment.skillNames[id]}>
              {([1, 2, 3, 4, 5] as const).map((value) => {
                const checked = values[id] === value
                return (
                  <label key={value} className={checked ? 'is-active' : undefined}>
                    <input
                      type="radio"
                      name={id}
                      value={value}
                      checked={checked}
                      onChange={() => onRate(id, value)}
                    />
                    <span>{value}</span>
                  </label>
                )
              })}
            </div>
          </li>
        ))}
      </ul>
      {error === 'rateAll' ? (
        <p className="assess-error" role="alert">
          {t.assessment.rateAll}
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
