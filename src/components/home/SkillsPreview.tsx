import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'
import { SkillBar } from '../ui/SkillBar'
import { exampleSkills } from '../../data/home'
import { useI18n } from '../../i18n/I18nProvider'

export function SkillsPreview() {
  const { t } = useI18n()
  const copy = t.home.skills

  return (
    <Section className="skills" id="skills">
      <Container>
        <div className="skills__layout">
          <Reveal>
            <SectionHeader kicker={copy.kicker} title={copy.title} lede={copy.lede} />
          </Reveal>
          <Reveal>
            <div className="skills__panel">
              <p className="meta">{copy.caption}</p>
              <div className="skills__bars">
                {exampleSkills.map((skill) => (
                  <SkillBar key={skill.id} label={copy.items[skill.id]} value={skill.value} />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
