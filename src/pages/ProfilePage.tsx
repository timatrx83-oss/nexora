import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Container } from '../components/ui/Container'
import { Reveal } from '../components/ui/Reveal'
import { CosmicField } from '../components/home/CosmicField'
import { ProfileEmpty } from '../components/profile/ProfileEmpty'
import { ProfileExploreNext } from '../components/profile/ProfileExploreNext'
import { ProfileInterests } from '../components/profile/ProfileInterests'
import { ProfileOverview } from '../components/profile/ProfileOverview'
import { ProfileSkills } from '../components/profile/ProfileSkills'
import { ProfileStrengths } from '../components/profile/ProfileStrengths'
import { ProfileWorkStyle } from '../components/profile/ProfileWorkStyle'
import { useAssessmentResult } from '../assessment/useAssessmentResult'
import { profileFromAssessment } from '../profile/types'
import { useI18n } from '../i18n/I18nProvider'
import '../styles/profile.css'

export function ProfilePage() {
  const result = useAssessmentResult()
  const { t } = useI18n()
  const navigate = useNavigate()

  if (!result) return <ProfileEmpty />

  const snapshot = profileFromAssessment(result)

  const retake = () => {
    navigate('/assessment', { state: { retake: true } })
  }

  return (
    <div className="profile-page">
      <CosmicField />
      <header className="profile-hero">
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
            <h1>{t.profile.heading}</h1>
            <p className="lede">{t.profile.lede}</p>
            <p className="profile-hero__idea">{t.profile.idea}</p>
            <p className="profile-status">{t.profile.status}</p>
          </div>
        </Container>
      </header>
      <Container>
        <Reveal>
          <ProfileOverview snapshot={snapshot} />
        </Reveal>
        <Reveal>
          <ProfileStrengths snapshot={snapshot} />
        </Reveal>
        <Reveal>
          <ProfileInterests snapshot={snapshot} />
        </Reveal>
        <Reveal>
          <ProfileWorkStyle snapshot={snapshot} />
        </Reveal>
        <Reveal>
          <ProfileSkills snapshot={snapshot} />
        </Reveal>
        <Reveal>
          <ProfileExploreNext snapshot={snapshot} />
        </Reveal>
        <div className="profile-footnote">
          <div className="btn-row">
            <Button variant="secondary" onClick={retake}>
              {t.profile.retake}
            </Button>
          </div>
          <p>{t.profile.source}</p>
        </div>
      </Container>
    </div>
  )
}
