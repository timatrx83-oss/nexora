type SectionHeaderProps = {
  kicker?: string
  title: string
  lede?: string
  className?: string
}

export function SectionHeader({ kicker, title, lede, className = '' }: SectionHeaderProps) {
  return (
    <header className={`section-head ${className}`.trim()}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h2>{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </header>
  )
}
