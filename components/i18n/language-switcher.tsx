'use client'

import { useLocale } from 'next-intl'
import { useTransition } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Languages } from 'lucide-react'

const locales = ['en', 'ru', 'ar'] as const
type Locale = (typeof locales)[number]

const localeNames: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  ar: 'العربية',
}

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const [isPending, startTransition] = useTransition()

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      // Set locale cookie
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
      // Reload page to apply new locale
      window.location.reload()
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <Select
        value={locale}
        onValueChange={handleLocaleChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {locales.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {localeNames[loc]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
