import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { Section } from '../ui/Section'
import { SectionHeader } from '../ui/SectionHeader'
import { Reveal } from '../ui/Reveal'
import { exampleProjects } from '../../data/home'
import { useI18n } from '../../i18n/I18nProvider'

export function ProjectsPreview() {
  const { t } = useI18n()
  const copy = t.home.projects

  return (
    <Section className="projects" id="projects-preview">
      <Container>
        <Reveal>
          <SectionHeader kicker={copy.kicker} title={copy.title} lede={copy.lede} />
        </Reveal>
        <ol className="projects__list">
          {exampleProjects.map((project) => {
            const item = copy.items[project.id]
            return (
              <li key={project.id}>
                <Link to="/projects" className="project-row">
                  <span className="project-row__index">{project.index}</span>
                  <div>
                    <p className="kicker">{item.field}</p>
                    <h3>{item.title}</h3>
                    <p className="project-row__skills">
                      <span className="meta">{copy.skillsLabel}</span>
                      {item.skills}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ol>
        <p className="projects__caption">{copy.caption}</p>
      </Container>
    </Section>
  )
}
