import type { ProfileSnapshot } from '../../profile/types'
import { useI18n } from '../../i18n/I18nProvider'

export function ProfileInterests({ snapshot }: { snapshot: ProfileSnapshot }) {
  const { t } = useI18n()
  if (snapshot.interests.length === 0) return null

  return (
    <section className="profile-section" aria-labelledby="profile-interests">
      <h2 id="profile-interests">{t.profile.interests.title}</h2>
      <p className="lede">{t.profile.interests.lede}</p>
      <ul className="profile-interests">
        {snapshot.interests.map((id) => (
          <li key={id} className="profile-interest">
            {t.assessment.interestNames[id]}
          </li>
        ))}
      </ul>
    </section>
  )
}
