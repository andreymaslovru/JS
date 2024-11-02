import { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import NProgress from 'nprogress'
import { useLocale } from 'next-intl'
import { RouteTypes, locales, useRouter as useNavigation } from '@navigation'

export const useRouter = () => {
  const router = useNavigation()
  const pathname = usePathname()
  const locale = useLocale()

  const replace = useCallback(
    (href: string, options?: NavigateOptions) => {
      href !== pathname && NProgress.start()
      router.replace(href as RouteTypes, options)
    },
    [router, pathname]
  )

  const push = useCallback(
    (href: string, options?: NavigateOptions) => {
      href !== pathname && NProgress.start()

      router.push(`${href}` as RouteTypes, options)
    },
    [router, pathname]
  )

  return {
    ...router,
    replace,
    push
  }
}
