import { useEffect } from 'react'
import { SocketApi } from '@api/socket'

import { useChatStore } from '@entities/chat/model'

export const useConnectReaction = () => {
  const addReaction = useChatStore((store) => store.addReaction)

  useEffect(() => {
    SocketApi?.socket?.on('reaction_client', (data) => {
      addReaction(data?.message_id, data?.reaction, JSON.parse(data?.from_user))
    })
  }, [])
}
