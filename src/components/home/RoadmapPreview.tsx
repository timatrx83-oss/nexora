import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'
import { roadmapDays } from '../../data/home'
import { useI18n } from '../../i18n/I18nProvider'

export function RoadmapPreview() {
  const { t } = useI18n()
  const copy = t.home.roadmap

  return (
    <Section className="roadmap" id="roadmap-preview">
      <Container>
        <Reveal>
          <SectionHeader kicker={copy.kicker} title={copy.title} lede={copy.lede} />
        </Reveal>
        <ol className="timeline">
          {roadmapDays.map((item) => (
            <li key={item.id} className="timeline__item">
              <span className="timeline__node" aria-hidden="true" />
              <p className="meta">{copy.days[item.id].day}</p>
              <h3>{copy.days[item.id].title}</h3>
            </li>
          ))}
        </ol>
        <p className="timeline__caption">{copy.caption}</p>
      </Container>
    </Section>
  )
}
