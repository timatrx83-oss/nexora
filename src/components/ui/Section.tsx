import type { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  className?: string
  id?: string
  tight?: boolean
}

export function Section({ children, className = '', id, tight }: SectionProps) {
  const classes = `section ${tight ? 'section--tight' : ''} ${className}`.trim()
  return (
    <section id={id} className={classes}>
      {children}
    </section>
  )
}
