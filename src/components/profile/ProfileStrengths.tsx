import type { CSSProperties } from 'react'
import type { ProfileSnapshot } from '../../profile/types'
import { useI18n } from '../../i18n/I18nProvider'

export function ProfileStrengths({ snapshot }: { snapshot: ProfileSnapshot }) {
  const { t } = useI18n()
  if (snapshot.strengths.length === 0) return null
  const copy = t.profile.strengths

  return (
    <section className="profile-section" aria-labelledby="profile-strengths">
      <h2 id="profile-strengths">{copy.title}</h2>
      <p className="lede">{copy.lede}</p>
      {snapshot.strengths.length > 1 ? (
        <div className="profile-signature" aria-hidden="true">
          {snapshot.strengths.map((id) => {
            const value = snapshot.skills[id]
            const style = value
              ? ({ height: `${Math.max(22, (value / 5) * 100)}%` } as CSSProperties)
              : undefined
            return <span key={id} className="profile-signature__bar" style={style} />
          })}
        </div>
      ) : null}
      <div className="profile-grid">
        {snapshot.strengths.map((id) => {
          const value = snapshot.skills[id]
          return (
            <article key={id} className="profile-card">
              <h3>{t.assessment.skillNames[id]}</h3>
              <p>{copy.copy[id]}</p>
              {value ? (
                <span className="profile-card__bar">
                  <span style={{ width: `${(value / 5) * 100}%` }} />
                </span>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
