import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'ru']

export const getLocale = () => {
  const segments = window.location.pathname.split('/')

  return segments[1]
}

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale)) notFound()

  return {
    messages: (await import(`../messages/${locale}.json`)).default
  } as unknown as Promise<object>
})
