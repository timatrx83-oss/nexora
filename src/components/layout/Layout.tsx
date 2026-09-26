import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { FeedbackPrompt } from '../feedback/FeedbackPrompt'
import { Footer } from './Footer'
import { Navbar } from './Navbar'
import { pageKeys } from '../../data/navigation'
import { useI18n } from '../../i18n/I18nProvider'

export function Layout() {
  const { pathname } = useLocation()
  const { t } = useI18n()

  useEffect(() => {
    const key = pathname.startsWith('/explore')
      ? 'explore'
      : pageKeys[pathname as keyof typeof pageKeys]
    document.title =
      pathname === '/'
        ? t.meta.homeTitle
        : key
          ? t.meta.pageTitle.replace('{page}', t.pages[key].title)
          : 'NEXORA'
    window.scrollTo(0, 0)
  }, [pathname, t])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        {t.common.skip}
      </a>
      <Navbar />
      <main id="main" className="app-main">
        <Outlet />
      </main>
      <Footer />
      <FeedbackPrompt />
    </div>
  )
}
