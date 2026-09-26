import { SKILL_IDS } from '../../assessment/types'
import type { ProfileSnapshot } from '../../profile/types'
import { useI18n } from '../../i18n/I18nProvider'

export function ProfileSkills({ snapshot }: { snapshot: ProfileSnapshot }) {
  const { t } = useI18n()
  const rated = SKILL_IDS.filter((id) => typeof snapshot.skills[id] === 'number')
  if (rated.length === 0) return null
  const copy = t.profile.skills

  return (
    <section className="profile-section" aria-labelledby="profile-skills">
      <h2 id="profile-skills">{copy.title}</h2>
      <p className="lede">{copy.lede}</p>
      <div className="profile-skills">
        {rated.map((id) => {
          const value = snapshot.skills[id]!
          return (
            <div key={id} className="profile-skill">
              <div className="profile-meter">
                <div className="profile-meter__row">
                  <span>{t.assessment.skillNames[id]}</span>
                  <span className="profile-meter__value">
                    {copy.scale.replace('{value}', String(value))}
                  </span>
                </div>
                <div
                  className="profile-meter__track"
                  role="meter"
                  aria-valuemin={1}
                  aria-valuemax={5}
                  aria-valuenow={value}
                  aria-label={t.assessment.skillNames[id]}
                >
                  <span className="profile-meter__fill" style={{ width: `${(value / 5) * 100}%` }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {snapshot.skillsToDevelop.length > 0 ? (
        <div className="profile-develop">
          <h3>{copy.developTitle}</h3>
          <p className="lede">{copy.developLede}</p>
          <ul className="profile-tags">
            {snapshot.skillsToDevelop.map((id) => (
              <li key={id} className="profile-tag">
                {t.assessment.skillNames[id]}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
