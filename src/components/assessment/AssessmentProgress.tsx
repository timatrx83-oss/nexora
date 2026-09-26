import { sectionForIndex } from '../../assessment/questions'
import { useI18n } from '../../i18n/I18nProvider'

type AssessmentProgressProps = {
  current: number
  total: number
  questionIndex: number
  questionTotal: number
}

export function AssessmentProgress({
  current,
  total,
  questionIndex,
  questionTotal,
}: AssessmentProgressProps) {
  const { t } = useI18n()
  const section = sectionForIndex(questionIndex)
  const percent = Math.round(((questionIndex + 1) / questionTotal) * 100)

  return (
    <div className="assess-progress">
      <div className="assess-progress__meta">
        <p className="kicker">{t.assessment.sections[section]}</p>
        <p className="meta">
          {t.assessment.progress.replace('{current}', String(current)).replace('{total}', String(total))}
        </p>
      </div>
      <div
        className="assess-progress__track"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={questionTotal}
        aria-valuenow={questionIndex + 1}
        aria-label={t.assessment.questionProgress
          .replace('{current}', String(questionIndex + 1))
          .replace('{total}', String(questionTotal))}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
      <p className="assess-progress__q">
        {t.assessment.questionProgress
          .replace('{current}', String(questionIndex + 1))
          .replace('{total}', String(questionTotal))}
      </p>
    </div>
  )
}
