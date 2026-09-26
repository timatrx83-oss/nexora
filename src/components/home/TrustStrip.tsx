import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { useI18n } from '../../i18n/I18nProvider'

export function TrustStrip() {
  const { t } = useI18n()

  return (
    <section className="trust" aria-labelledby="trust-heading">
      <Container>
        <Reveal>
          <p id="trust-heading" className="trust__line">
            {t.home.trust.heading}
          </p>
          <p className="trust__support">{t.home.trust.support}</p>
        </Reveal>
      </Container>
    </section>
  )
}
