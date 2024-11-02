import { Pathnames, createLocalizedPathnamesNavigation } from 'next-intl/navigation'

export const locales = ['en', 'ru'] as const
export const localePrefix = 'always'

export const pathnames = {
  '/': {
    ru: '/',
    en: '/'
  },
  '/auth': {
    ru: '/auth',
    en: '/auth'
  },
  '/register': {
    ru: '/register',
    en: '/register'
  },
  '/register/confirm': {
    ru: '/register/confirm',
    en: '/register/confirm'
  },
  '/client/restore': {
    ru: '/client/restore',
    en: '/client/restore'
  }
} satisfies Pathnames<typeof locales>

export type RouteTypes = keyof typeof pathnames

export const { Link, redirect, usePathname, useRouter, getPathname }
  = createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames })

