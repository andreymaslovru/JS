'use client'

import React, { useEffect } from 'react'
import * as NProgress from 'nprogress'
import NextTopLoader from 'nextjs-toploader'
import { usePathname } from 'next/navigation'

import { useRouter } from '@shared/hooks/useRouter'

export const TopLoader: React.FC = () => {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    NProgress.done()
  }, [pathname, router])

  return (
    <NextTopLoader height={2} color='var(--antd-color-primary)' shadow={false} showSpinner={false} />
  )
}
