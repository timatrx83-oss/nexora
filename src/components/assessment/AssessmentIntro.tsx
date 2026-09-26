import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { useI18n } from '../../i18n/I18nProvider'

type AssessmentIntroProps = {
  onStart: () => void
  onResume?: () => void
  onViewResult?: () => void
  canResume: boolean
  hasResult: boolean
}

export function AssessmentIntro({
  onStart,
  onResume,
  onViewResult,
  canResume,
  hasResult,
}: AssessmentIntroProps) {
  const { t } = useI18n()
  const copy = t.assessment.intro

  return (
    <section className="assess-intro">
      <Container>
        <p className="kicker">{copy.kicker}</p>
        <h1>{copy.heading}</h1>
        <p className="lede">{copy.lede}</p>
        <p className="assess-intro__time">{copy.time}</p>
        <div className="btn-row">
          <Button onClick={onStart}>{copy.start}</Button>
          {canResume && onResume ? (
            <Button variant="secondary" onClick={onResume}>
              {copy.resume}
            </Button>
          ) : null}
          {hasResult && !canResume && onViewResult ? (
            <Button variant="secondary" onClick={onViewResult}>
              {copy.viewResult}
            </Button>
          ) : null}
        </div>
        <p className="assess-intro__note">{copy.note}</p>
      </Container>
    </section>
  )
}
