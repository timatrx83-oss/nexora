import type { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
  elevated?: boolean
  hover?: boolean
}

export function Card({ children, className = '', elevated, hover }: CardProps) {
  const classes =
    `card ${elevated ? 'card--elevated' : ''} ${hover ? 'card--hover' : ''} ${className}`.trim()
  return <div className={classes}>{children}</div>
}
