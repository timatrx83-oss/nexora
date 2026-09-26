import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'
import { journeyStages } from '../../data/home'
import { useI18n } from '../../i18n/I18nProvider'

export function JourneyPreview() {
  const { t } = useI18n()
  const stages = t.home.journey.stages

  return (
    <Section className="journey" id="journey">
      <Container>
        <Reveal>
          <SectionHeader
            kicker={t.home.journey.kicker}
            title={t.home.journey.title}
            lede={t.home.journey.lede}
          />
        </Reveal>
        <ol className="journey__flow">
          <span className="journey__rail" aria-hidden="true" />
          {journeyStages.map((stage, index) => (
            <li key={stage.index} className="journey__node">
              <span className="journey__orb" aria-hidden="true" />
              <p className="journey__index">{stage.index}</p>
              <h3>
                <span className="sr-only">{stage.index} — </span>
                {stages[index].title}
              </h3>
              <p>{stages[index].copy}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
