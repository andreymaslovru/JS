
import { messengerApi } from '@api/ump/api'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { ChatUser, Message } from '../../../open-api/ump/api'

export interface IStore {
  chats: (ChatUser & { isTyping?: boolean })[] | null
  page: number
  hasMore: boolean
  isLoading: boolean
}

export interface IChatsActions {
    getChats: (limit: number, offset: number, handler?: (res: ChatUser[] | undefined | null) => void, init?: boolean) => void
    reset: () => void
    addStatusTyping: (id: string, status: boolean) => void
    addStatusOnline: (id: string, status: string) => void
    addStatusIsReadLastMsg: (id: string) => void
    addChat: (companionId: string) => void
    setHasMore: (val: boolean) => void
    setPage: (val: number) => void
}

export const useChatsStore = create<IStore & IChatsActions>()(
  persist((set, get) => ({
    chats: null,
    page: 0,
    hasMore: true,
    isLoading: false,

    setHasMore: (hasMore: boolean) => {
      set((state) => ({ ...state, hasMore }))
    },

    setPage: (page: number) => {
      set((state) => ({ ...state, page }))
    },

    addChat: async (companionId) => {
      const currentChat = get()?.chats?.find((item) => item?.companion?.id === companionId)
      const chat = await messengerApi.getChatMessengerChatPost(companionId) as unknown as { data: ChatUser & { isTyping?: boolean }}

      console.log(chat, 'chat')
      if (chat?.data) {
        const getList = (state: IStore & IChatsActions) => {
          if (currentChat && state?.chats?.length) {
            return [chat?.data, ...state.chats.filter((i) => i.id !== chat?.data?.id)]
          } else if (!currentChat && state?.chats?.length) {
            return [chat?.data, ...state.chats]
          } else {
            return [chat?.data]
          }
        }

        set((state) => ({
          ...state,
          chats: getList(state)
        }))
      }
    },

    getChats: async (limit, offset, handler?: (res: ChatUser[] | undefined | null) => void, init?: boolean) => {
      set((state) => ({ ...state, isLoading: true }))

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await messengerApi.getChatsMessengerChatsPost(offset, limit) as unknown as any

      if (res?.status === 200) {
        const chats = res?.data?.chats

        handler?.(chats)

        if (!chats?.length) return

        set((state) => ({ ...state, chats: state?.chats?.length && !init ? [...state.chats, ...chats] : chats, isLoading: false }))
      }
    },

    addStatusTyping: (id: string, status: boolean) => {
      set((state) => ({
        ...state,
        chats: state?.chats?.map((chat) => {
          if (chat?.companion?.id === id) {
            return ({
              ...chat,
              isTyping: status
            })
          } else {
            return chat
          }
        })
      }))
    },

    addStatusOnline: (id: string, status: string) => {
      set((state) => ({
        ...state,
        chats: state?.chats?.map((chat) => {
          if (chat?.companion?.id === id) {
            return ({
              ...chat,
              companion: {
                ...chat.companion,
                status
              }
            })
          } else {
            return chat
          }
        })
      }))
    },

    addStatusIsReadLastMsg: (id: string) => {
      set((state) => ({
        ...state,
        chats: state?.chats?.map((chat) => {
          if (chat?.last_message?.id === id) {
            return ({
              ...chat,
              last_message: {
                ...chat?.last_message,
                is_read: true
              }
            })
          } else {
            return chat
          }
        })
      }))
    },

    reset: () => {
      set((state) => ({ ...state, chats: null, page: 0, hasMore: true, isLoading: false }))
    }
  }),
  { name: 'usePeopleStore',
    storage: createJSONStorage(() => localStorage),
    partialize: ({ chats, page }) => ({ chats, page })
  }
  )
)
