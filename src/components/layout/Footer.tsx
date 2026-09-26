import { Link } from 'react-router-dom'
import { Container } from '../ui/Container'
import { footerNav } from '../../data/navigation'
import { useI18n } from '../../i18n/I18nProvider'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer className="site-footer">
      <Container className="site-footer__grid">
        <div className="site-footer__brand">
          <Link to="/" className="logo" aria-label={t.common.logoHome}>
            NEXORA<span>.</span>
          </Link>
          <p className="site-footer__tagline">{t.footer.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="site-footer__nav">
            {footerNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{t.footer[item.id]}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="site-footer__note">{t.footer.note}</p>
      </Container>
    </footer>
  )
}
