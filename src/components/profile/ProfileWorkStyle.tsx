import type { ProfileSnapshot } from '../../profile/types'
import { useI18n } from '../../i18n/I18nProvider'

export function ProfileWorkStyle({ snapshot }: { snapshot: ProfileSnapshot }) {
  const { t } = useI18n()
  if (snapshot.workAxes.length === 0 && snapshot.workStyle.length === 0) return null
  const copy = t.profile.workStyle

  return (
    <section className="profile-section" aria-labelledby="profile-work">
      <h2 id="profile-work">{copy.title}</h2>
      <p className="lede">{copy.lede}</p>
      {snapshot.workAxes.length > 0 ? (
        <div className="profile-axes">
          {snapshot.workAxes.map((axis) => {
            const labels = copy.axes[axis.id]
            const hint =
              axis.lean === 'left'
                ? labels.leftHint
                : axis.lean === 'right'
                  ? labels.rightHint
                  : labels.balancedHint
            return (
              <article key={axis.id} className="profile-axis">
                <div className="profile-axis__labels">
                  <span>{labels.left}</span>
                  <span>{labels.right}</span>
                </div>
                <div className="profile-axis__track" aria-hidden="true">
                  <span className="profile-axis__marker" data-lean={axis.lean} />
                </div>
                <p>
                  {copy.prefer} {hint}.
                </p>
              </article>
            )
          })}
        </div>
      ) : (
        <ul className="profile-tags">
          {snapshot.workStyle.map((id) => (
            <li key={id} className="profile-tag">
              {t.assessment.workStyleNames[id]}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
