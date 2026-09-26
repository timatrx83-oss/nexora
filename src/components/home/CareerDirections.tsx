import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'
import { careerFields } from '../../data/home'
import { useI18n } from '../../i18n/I18nProvider'

export function CareerDirections() {
  const { t } = useI18n()
  const copy = t.home.careers

  return (
    <Section className="fields" id="fields">
      <Container>
        <Reveal>
          <SectionHeader kicker={copy.kicker} title={copy.title} lede={copy.lede} />
        </Reveal>
        <ul className="fields__grid">
          {careerFields.map((field) => {
            const card = copy.cards[field.id]
            return (
              <li
                key={field.id}
                className={field.featured ? 'fields__item fields__item--lead' : 'fields__item'}
              >
                <Link to="/explore" className="field-card" data-field={field.id}>
                  <p className="kicker">{card.field}</p>
                  <h3>{card.line}</h3>
                  <p className="field-card__skills">
                    <span className="meta">{copy.skillsLabel}</span>
                    {card.skills}
                  </p>
                  <p className="field-card__impact">
                    <span className="meta">{copy.impactLabel}</span>
                    {card.impact}
                    <span className="field-card__note">{copy.impactNote}</span>
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
