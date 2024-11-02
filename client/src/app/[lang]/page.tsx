'use client'

import { useEffect, useRef } from 'react'
import { SocketApi } from '@api/socket'

import HomePage from '@views/home/HomePage'

import { useConnectMessage } from '@widgets/chat/hooks/useConnectMessage'
import { useConnectReaction } from '@widgets/chat/hooks/useConnectReaction'
import { useChatsStore } from '@widgets/chats/model'

import { usePeopleStore } from '@entities/employee/model'

import { useConnectSocket } from '@shared/hooks/useConnectSocket'
import { authHelper } from '@shared/utils/authHelper/AuthHelper'

const Home = () => {
  const { token, getAuthData } = authHelper
  const uId = getAuthData(token)?.id

  const { setHasMore, setPage, getChats } = useChatsStore((store) => ({
    setHasMore: store.setHasMore,
    setPage: store.setPage,
    getChats: store.getChats
  }))

  const { data: people, getPeople } = usePeopleStore((store) => store)

  useEffect(() => {
    getPeople()
  }, [])

  useEffect(() => {
    if (token && uId) {
      SocketApi.createConnection(token, uId)
    }

    return () => {
      SocketApi.disconnect()
    }
  }, [token, uId])

  useConnectSocket()
  useConnectMessage()
  useConnectReaction()

  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true

      getChats(0, 20, (res) => {
        if (res?.length && res.length >= 20) {
          setPage(1)
        } else {
          setHasMore(false)
        }
      }, true)
    }
  }, [])

  return (
    <main>
      <HomePage />
    </main>
  )
}

export default Home
