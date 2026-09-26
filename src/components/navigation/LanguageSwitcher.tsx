import { locales } from '../../i18n/locales'
import { useI18n } from '../../i18n/I18nProvider'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div className="lang" role="group" aria-label={t.common.language}>
      {locales.map((code, index) => (
        <span key={code} className="lang__item">
          {index > 0 ? (
            <span className="lang__sep" aria-hidden="true">
              ·
            </span>
          ) : null}
          <button
            type="button"
            className="lang__btn"
            aria-pressed={locale === code}
            onClick={() => setLocale(code)}
          >
            {code.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}
