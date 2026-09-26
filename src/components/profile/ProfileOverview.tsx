import { SKILL_IDS, type SkillId } from '../../assessment/types'
import type { ProfileSnapshot } from '../../profile/types'
import { useI18n } from '../../i18n/I18nProvider'

function Tags({ labels }: { labels: string[] }) {
  const { t } = useI18n()
  if (labels.length === 0) return <p className="profile-muted">{t.profile.overview.empty}</p>
  return (
    <ul className="profile-tags">
      {labels.map((label) => (
        <li key={label} className="profile-tag">
          {label}
        </li>
      ))}
    </ul>
  )
}

function MiniMeters({
  ids,
  skills,
}: {
  ids: SkillId[]
  skills: ProfileSnapshot['skills']
}) {
  const { t } = useI18n()
  if (ids.length === 0) return <p className="profile-muted">{t.profile.overview.empty}</p>
  return (
    <>
      {ids.map((id) => {
        const value = skills[id]
        if (!value) return null
        return (
          <div key={id} className="profile-meter">
            <div className="profile-meter__row">
              <span>{t.assessment.skillNames[id]}</span>
              <span className="profile-meter__value">
                {t.profile.skills.scale.replace('{value}', String(value))}
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
        )
      })}
    </>
  )
}

export function ProfileOverview({ snapshot }: { snapshot: ProfileSnapshot }) {
  const { t } = useI18n()
  const copy = t.profile.overview

  return (
    <section className="profile-section" aria-labelledby="profile-overview">
      <p className="kicker" id="profile-overview">
        {t.profile.current}
      </p>
      <div className="profile-overview">
        <article className="profile-stat">
          <p className="meta">{copy.interests}</p>
          <Tags labels={snapshot.interests.map((id) => t.assessment.interestNames[id])} />
        </article>
        <article className="profile-stat">
          <p className="meta">{copy.strengths}</p>
          <Tags labels={snapshot.strengths.map((id) => t.assessment.skillNames[id])} />
        </article>
        <article className="profile-stat">
          <p className="meta">{copy.workStyle}</p>
          <Tags labels={snapshot.workStyle.map((id) => t.assessment.workStyleNames[id])} />
        </article>
        <article className="profile-stat">
          <p className="meta">{copy.skills}</p>
          <MiniMeters
            ids={snapshot.strongestSkills.filter((id) => SKILL_IDS.includes(id))}
            skills={snapshot.skills}
          />
        </article>
      </div>
    </section>
  )
}
