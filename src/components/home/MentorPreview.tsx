import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'
import { useI18n } from '../../i18n/I18nProvider'

export function MentorPreview() {
  const { t } = useI18n()
  const copy = t.home.mentor

  return (
    <Section className="mentor" id="mentor-preview">
      <Container>
        <Reveal>
          <SectionHeader kicker={copy.kicker} title={copy.title} lede={copy.lede} />
        </Reveal>
        <p className="mentor__idea">{copy.idea}</p>
        <div className="mentor__frame">
          <aside className="mentor__context">
            <p className="kicker">{copy.context}</p>
            <div className="mentor__fact">
              <p className="meta">{copy.profileLabel}</p>
              <p>{copy.profileValue}</p>
            </div>
            <div className="mentor__fact">
              <p className="meta">{copy.exploringLabel}</p>
              <p>{copy.exploringValue}</p>
            </div>
            <div className="mentor__fact">
              <p className="meta">{copy.focusLabel}</p>
              <p>{copy.focusValue}</p>
            </div>
            <ul className="mentor__prompts">
              {copy.prompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
          </aside>
          <div className="mentor__thread">
            <span className="mentor__signal" aria-hidden="true" />
            <p className="meta">{copy.exchange}</p>
            <figure className="bubble bubble--user">
              <figcaption>{copy.you}</figcaption>
              <p>{copy.userMessage}</p>
            </figure>
            <figure className="bubble bubble--mentor">
              <figcaption>{copy.mentor}</figcaption>
              <p>{copy.mentorMessage}</p>
            </figure>
            <Button to="/mentor" variant="secondary">
              {copy.open}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
