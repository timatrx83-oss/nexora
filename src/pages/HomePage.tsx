import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { CareerDirections } from '../components/home/CareerDirections'
import { CosmicField } from '../components/home/CosmicField'
import { FinalCta } from '../components/home/FinalCta'
import { JourneyPreview } from '../components/home/JourneyPreview'
import { MentorPreview } from '../components/home/MentorPreview'
import { ProductViz } from '../components/home/ProductViz'
import { ProjectsPreview } from '../components/home/ProjectsPreview'
import { RoadmapPreview } from '../components/home/RoadmapPreview'
import { SkillsPreview } from '../components/home/SkillsPreview'
import { TrustStrip } from '../components/home/TrustStrip'
import { SHOW_DEFERRED_HOME_SECTIONS } from '../data/navigation'
import { useI18n } from '../i18n/I18nProvider'
import '../styles/home.css'

export function HomePage() {
  const { t } = useI18n()

  return (
    <div className="home-page">
      <CosmicField />
      <section className="hero">
        <Container>
          <div className="hero__grid">
            <div className="hero__copy">
              <Badge>{t.home.hero.eyebrow}</Badge>
              <p className="hero__wordmark">{t.home.hero.wordmark}</p>
              <h1>{t.home.hero.heading}</h1>
              <p className="lede">{t.home.hero.lede}</p>
              <div className="btn-row">
                <Button to="/assessment">{t.common.startJourney}</Button>
                <Button to="/explore" variant="secondary">
                  {t.common.exploreCareers}
                </Button>
              </div>
            </div>
            <ProductViz />
          </div>
        </Container>
      </section>
      <TrustStrip />
      <JourneyPreview />
      <CareerDirections />
      <SkillsPreview />
      {SHOW_DEFERRED_HOME_SECTIONS ? <RoadmapPreview /> : null}
      <MentorPreview />
      {SHOW_DEFERRED_HOME_SECTIONS ? <ProjectsPreview /> : null}
      <FinalCta />
    </div>
  )
}
