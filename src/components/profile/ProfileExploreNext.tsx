import type { ProfileSnapshot } from '../../profile/types'
import { useI18n } from '../../i18n/I18nProvider'

export function ProfileExploreNext({ snapshot }: { snapshot: ProfileSnapshot }) {
  const { t } = useI18n()
  if (snapshot.directions.length === 0) return null
  const copy = t.profile.explore

  return (
    <section className="profile-section" aria-labelledby="profile-explore">
      <h2 id="profile-explore">{copy.title}</h2>
      <p className="lede">{copy.lede}</p>
      <div className="profile-explore">
        {snapshot.directions.map((id) => (
          <article key={id} className="profile-explore__card">
            <h3>{t.assessment.directionNames[id]}</h3>
            <p>{copy.cardHint}</p>
          </article>
        ))}
      </div>
      <p className="profile-muted profile-later">{copy.later}</p>
    </section>
  )
}
