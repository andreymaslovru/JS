/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { SocketApi } from '@api/socket'
import { useEffect } from 'react'

import { useChatsStore } from '@widgets/chats/model'

import { useChatStore } from '@entities/chat/model'
import { usePeopleStore } from '@entities/employee/model'

import { authHelper } from '@shared/utils/authHelper/AuthHelper'

export const useConnectSocket = () => {
  const { token } = authHelper

  const addStatusCompanion = useChatStore((store) => store.addStatusCompanion)
  const addStatusTypingCompanion = useChatStore((store) => store.addStatusTypingCompanion)
  const addStatusTyping = useChatsStore((store) => store.addStatusTyping)
  const addStatusOnline = useChatsStore((store) => store.addStatusOnline)
  const addStatus = usePeopleStore((store) => store.addStatus)

  const connectSocket = (token: string) => {
    SocketApi?.socket?.on('online', (data) => {
      // TODO оптимизировать (избавиться от статусов в списке пользователей)
      addStatus(data?.id, data?.status)
      addStatusOnline(data?.id, data?.status)

      addStatusCompanion(data?.id, data?.status)
    })

    SocketApi?.socket?.on('typing_on_client', (data) => {
      const search = window.location.search
      const chatId = new URLSearchParams(search).get('chat_id')

      if (!chatId) {
        addStatusTyping(JSON.parse(data?.from)?.id, true)
      } else {
        addStatusTypingCompanion(JSON.parse(data?.from)?.id, true)
      }
    })

    SocketApi?.socket?.on('typing_off_client', (data) => {
      const search = window.location.search
      const chatId = new URLSearchParams(search).get('chat_id')

      if (!chatId) {
        addStatusTyping(JSON.parse(data?.from)?.id, false)
      } else {
        addStatusTypingCompanion(JSON.parse(data?.from)?.id, false)
      }
    })

    SocketApi?.socket?.on('new_message', () => {
      const search = window.location.search
      const chatId = new URLSearchParams(search).get('chat_id')

      // TODO: обновить список чатов, закинуть на верх юзера и каунтить непрочитанные сообщения
    })

    window.onblur = () => {
      console.log('window onblur: socket is offline from front push')
      SocketApi?.socket?.emit('offline', { token })
    }

    window.onfocus = () => {
      console.log('window focus: socket is online from front push')
      SocketApi?.socket?.emit('online', { token })
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (token) {
        connectSocket(token)
      }
    }, 0)
  }, [])
}
