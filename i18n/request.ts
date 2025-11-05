import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export const locales = ['en', 'ru', 'ar'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames = {
  en: 'English',
  ru: 'Русский',
  ar: 'العربية',
} as const

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || defaultLocale) as Locale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
