export const locales = ['en', 'ru', 'kz'] as const

export type Locale = (typeof locales)[number]

export const localeHtmlLang: Record<Locale, string> = {
  en: 'en',
  ru: 'ru',
  kz: 'kk',
}

export const STORAGE_KEY = 'nexora.locale'

export function isLocale(value: string | null): value is Locale {
  return value === 'en' || value === 'ru' || value === 'kz'
}
