type SkillBarProps = {
  label: string
  value: number
}

export function SkillBar({ label, value }: SkillBarProps) {
  return (
    <div className="skill-bar">
      <div className="skill-bar__row">
        <span>{label}</span>
        <span className="skill-bar__value">{value}%</span>
      </div>
      <div className="progress" aria-hidden="true">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
