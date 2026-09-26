import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { dictionaries } from './dictionaries'
import { isLocale, localeHtmlLang, STORAGE_KEY, type Locale } from './locales'
import type { Messages } from './en'

type I18nContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

function readStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    /* ignore unavailable storage */
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  useEffect(() => {
    document.documentElement.lang = localeHtmlLang[locale]
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore unavailable storage */
    }
  }, [locale])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: setLocaleState,
      t: dictionaries[locale] ?? dictionaries.en,
    }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
