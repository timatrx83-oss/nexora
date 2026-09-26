import { useEffect, useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { LanguageSwitcher } from '../navigation/LanguageSwitcher'
import { NavLinks } from '../navigation/NavLinks'
import { useI18n } from '../../i18n/I18nProvider'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const { t } = useI18n()

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <header className="nav">
      <Container className="nav__inner">
        <Link to="/" className="logo" aria-label={t.common.logoHome}>
          NEXORA<span>.</span>
        </Link>
        <nav className="nav__desktop" aria-label="Primary">
          <NavLinks className="nav__links" />
        </nav>
        <div className="nav__end">
          <LanguageSwitcher />
          <div className="nav__cta">
            <Button to="/assessment">{t.common.startJourney}</Button>
          </div>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? t.common.closeMenu : t.common.openMenu}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="nav__toggle-bars" data-open={open || undefined} />
          </button>
        </div>
      </Container>
      {open ? (
        <div className="nav__drawer">
          <Container>
            <nav id={menuId} className="nav__mobile" aria-label="Mobile">
              <LanguageSwitcher />
              <NavLinks onNavigate={close} />
              <Button to="/assessment" onClick={close}>
                {t.common.startJourney}
              </Button>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  )
}
