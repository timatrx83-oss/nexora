import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'

type Shared = {
  variant?: Variant
  children: ReactNode
  className?: string
}

type ButtonAsButton = Shared &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
  }

type ButtonAsLink = Shared & {
  to: string
  onClick?: () => void
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const classes = `btn btn--${variant} ${className}`.trim()

  if ('to' in rest && rest.to) {
    return (
      <Link to={rest.to} className={classes} onClick={rest.onClick}>
        {children}
      </Link>
    )
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button type={buttonProps.type ?? 'button'} className={classes} {...buttonProps}>
      {children}
    </button>
  )
}
