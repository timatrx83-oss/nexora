import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { CosmicField } from '../home/CosmicField'
import { useI18n } from '../../i18n/I18nProvider'

export function ProfileEmpty() {
  const { t } = useI18n()
  const copy = t.profile.empty

  return (
    <div className="profile-page">
      <CosmicField />
      <section className="profile-empty">
        <Container>
          <div className="profile-hero__panel">
            <div className="profile-thread" aria-hidden="true">
              <span />
              <i />
              <span />
              <i />
              <span />
              <i />
              <span />
            </div>
            <p className="kicker">{t.profile.kicker}</p>
            <h1>{copy.heading}</h1>
            <p className="lede">{copy.lede}</p>
            <Button to="/assessment">{copy.cta}</Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
