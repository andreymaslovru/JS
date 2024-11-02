'use client'

import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { usePathname } from '@navigation'
import { useLocale } from 'next-intl'
import dayjs from 'dayjs'

import { useProfileStore } from '@widgets/profile'
import { useChatsStore } from '@widgets/chats/model'

import { useChatStore } from '@entities/chat/model'

import { authHelper } from '@shared/utils/authHelper/AuthHelper'
import { useRouter } from '@shared/hooks/useRouter'

import { useAuthStore } from './model'

const listPagesWithAuth = ['/']

export const AxiosProvider: FC<PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const logout = useAuthStore((store) => store.logout)
  const resetChat = useChatStore((store) => store.reset)
  const resetChats = useChatsStore((store) => store.reset)
  const resetUserProfile = useProfileStore((state) => state.reset)

  const router = useRouter()

  const handleLogout = () => {
    console.log('1231231')
    logout()
    resetUserProfile()
    resetChat()
    resetChats()

    router.push('/auth')
  }

  const { initialize } = authHelper
  const pathname = usePathname()

  const { token } = useAuthStore()

  const locale = useLocale()

  useEffect(() => {
    dayjs.locale(locale)
  }, [locale])

  useEffect(() => {
    initialize(token, handleLogout).finally(() => setLoading(false))
  }, [token])

  useEffect(() => {
    const pathnameWithoutQuery = pathname?.split('?')[0]

    if (pathnameWithoutQuery && listPagesWithAuth?.includes(pathnameWithoutQuery)) {
      if (!token) {
        router.push('/auth')
        handleLogout()
      }
    }
  }, [token])

  if (loading) {
    return <main />
  }

  return <>{children}</>
}
