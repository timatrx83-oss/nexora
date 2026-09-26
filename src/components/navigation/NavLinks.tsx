import { useI18n } from '../../i18n/I18nProvider'
import { navItems } from '../../data/navigation'
import { NavLink } from 'react-router-dom'

type NavLinksProps = {
  onNavigate?: () => void
  className?: string
}

export function NavLinks({ onNavigate, className = '' }: NavLinksProps) {
  const { t } = useI18n()

  return (
    <ul className={className}>
      {navItems.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end={item.to === '/'}
            className="nav__link"
            onClick={onNavigate}
          >
            {t.nav[item.id]}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}
