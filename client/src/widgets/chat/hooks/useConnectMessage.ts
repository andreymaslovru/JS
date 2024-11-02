import { SocketApi } from '@api/socket'
import { useEffect } from 'react'

import { useChatsStore } from '@widgets/chats/model'

import { useChatStore } from '@entities/chat/model'
import { useReadingStore } from '@entities/reads/model'

import { ChatUser } from '../../../../open-api/ump/api'

export const useConnectMessage = () => {
  const addChat = useChatsStore((store) => store.addChat)
  const addMessage = useChatStore((store) => store.addMessage)

  const addIsReadMessage = useReadingStore((store) => store.addIsReadMessage)

  const connectSocket = () => {
    SocketApi?.socket?.on('new_message', (data) => {
      // TODO оптимизировать
      // getChats()
      console.log(data, 'data')
      addChat(data?.from?.id)

      const search = window.location.search
      const chatId = new URLSearchParams(search).get('chat_id')

      console.log(data, 'data')

      if (chatId === data?.from?.login) {
        addMessage(data?.message)
      }
    })

    SocketApi?.socket?.on('read_message_client', (data) => {
      addIsReadMessage(data?.message_id)
    })
  }

  useEffect(() => {
    connectSocket()
  }, [])
}
