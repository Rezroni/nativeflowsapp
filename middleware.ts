import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, locales } from './i18n/request'

export function middleware(request: NextRequest) {
  // Get locale from cookie or accept-language header
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  const locale: string = locales.includes(cookieLocale as any) ? (cookieLocale as string) : defaultLocale

  // Clone the response
  const response = NextResponse.next()

  // Set locale cookie if not set
  if (!cookieLocale) {
    response.cookies.set('NEXT_LOCALE', locale, {
      path: '/',
      maxAge: 31536000, // 1 year
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - service-worker.js
     * - manifest.json
     * - icons
     */
    '/((?!api|_next/static|_next/image|favicon.ico|service-worker.js|manifest.json|icons).*)',
  ],
}
