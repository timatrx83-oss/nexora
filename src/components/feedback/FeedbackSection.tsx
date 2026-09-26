import { useId, useState } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { FeedbackDialog } from './FeedbackDialog'
import '../../styles/feedback.css'

export function FeedbackSection() {
  const { t } = useI18n()
  const headingId = useId()
  const [open, setOpen] = useState(false)

  return (
    <section className="feedback-invite" aria-labelledby={headingId}>
      <Container>
        <div className="feedback-invite__card">
          <div className="feedback-invite__copy">
            <h2 id={headingId}>{t.feedback.sectionHeading}</h2>
            <p>{t.feedback.sectionSupport}</p>
          </div>
          <Button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            {t.feedback.open}
          </Button>
        </div>
      </Container>
      {open ? <FeedbackDialog onClose={() => setOpen(false)} /> : null}
    </section>
  )
}
