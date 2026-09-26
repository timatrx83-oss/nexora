import { en, type Messages } from './en'
import { kz } from './kz'
import { ru } from './ru'
import type { Locale } from './locales'

export const dictionaries: Record<Locale, Messages> = {
  en,
  ru,
  kz,
}
