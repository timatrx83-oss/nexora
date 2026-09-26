import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { useI18n } from '../../i18n/I18nProvider'

export function FinalCta() {
  const { t } = useI18n()

  return (
    <section className="final-cta">
      <Container>
        <Reveal>
          <p className="kicker">{t.home.cta.kicker}</p>
          <h2>{t.home.cta.title}</h2>
          <p className="lede">{t.home.cta.lede}</p>
          <div className="btn-row">
            <Button to="/assessment">{t.common.startJourney}</Button>
            <Button to="/explore" variant="ghost">
              {t.common.exploreCareers}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
