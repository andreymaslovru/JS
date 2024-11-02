
import { messengerApi, userApi } from '@api/ump/api'
import { create } from 'zustand'

import { GetMessageResponse, UserFindModel, UserWithoutPassword } from '../../../open-api/ump/api'

export interface IStore {
  companion: UserFindModel & { isTyping?: boolean } | null
  messages: GetMessageResponse[] | null
  settings: {
    answer: GetMessageResponse | null
  } | null
}

export interface IChatActions {
    getCompanion: (idUser: string) => void
    getChat: (idUser: string, offset: number, limit: number, handler?: (res: GetMessageResponse[] | null | undefined) => void) => void
    addMessage: (message: GetMessageResponse) => void
    reset: () => void
    addStatusCompanion: (id: string, status: string) => void
    addStatusTypingCompanion: (id: string, status: boolean) => void
    addReaction: (id_message: string, reaction: string, user: UserWithoutPassword | null) => void
    deleteReaction: (id_message: string, uId: string) => void
    setAnswer: (answer: GetMessageResponse | null) => void
}

export const useChatStore = create<IStore & IChatActions>()((set, get) => ({
  companion: null,
  messages: null,
  settings: null,

  setAnswer: (answer) => {
    set((state) => ({
      ...state,
      settings: {
        ...state.settings,
        answer
      }
    }))
  },

  addMessage: (message: GetMessageResponse) => {
    set((state) => ({
      ...state, messages: state?.messages?.length
        ? [message, ...state.messages]
        : [message]
    }))
  },

  getCompanion: async (idUser: string) => {
    if (!idUser) return

    const res = await userApi.findUserIdUserFindUserIdGet(idUser)

    if (res?.status === 200) {
      const user = res?.data?.data?.[0]

      set((state) => ({ ...state, companion: user }))
    }
  },

  getChat: async (idUser: string, offset: number, limit: number, handler?: (res: GetMessageResponse[] | undefined | null) => void) => {
    if (!idUser) return

    const res = await messengerApi.getChatMessagesPersonMessengerGetMessagesPost(idUser, offset, limit)

    if (res?.status === 200) {
      const messages = res?.data?.messages

      handler?.(messages)

      if (!messages?.length) return

      set((state) => ({ ...state, messages: state?.messages?.length ? [...state.messages, ...messages] : messages }))
    }
  },

  reset: () => {
    set((state) => ({ ...state, messages: null, companion: null }))
  },

  addStatusCompanion: (id: string, status: string) => {
    set((state) => ({
      ...state, companion: state?.companion?.id === id
        ? { ...state?.companion, status }
        : state?.companion
          ? { ...state?.companion }
          : null
    }))
  },

  addStatusTypingCompanion: (id: string, status: boolean) => {
    set((state) => ({
      ...state, companion: state?.companion?.id === id
        ? { ...state?.companion, isTyping: status }
        : state?.companion
          ? { ...state?.companion }
          : null
    }))
  },

  deleteReaction: (id_message: string, uId: string) => {
    set((state) => ({
      ...state,
      messages: state?.messages?.map((mes) => {
        if (mes?.id === id_message) {
          return ({
            ...mes,
            reactions: mes?.reactions?.filter((reaction) => reaction.from_user.id !== uId)
          })
        } else {
          return mes
        }
      })
    }))
  },

  addReaction: (id_message: string, reaction: string, user: UserWithoutPassword | null) => {
    set((state) => ({
      ...state,
      messages: state?.messages?.map((mes) => {
        if ((mes?.id === id_message) && user) {
          const findReaction = mes?.reactions?.find((reaction) => reaction?.from_user?.id === user?.id)

          if (findReaction) {
            return ({
              ...mes,
              reactions: mes?.reactions?.map((r) => {
                if (r?.from_user?.id === findReaction?.from_user?.id) {
                  return ({
                    ...r,
                    reaction
                  })
                } else {
                  return r
                }
              })
            })
          }

          return ({
            ...mes,
            reactions: mes?.reactions?.length ? [...mes.reactions, { reaction, from_user: user }] : [{ reaction, from_user: user }]
          })
        } else {
          return mes
        }
      })
    }))
  }
}))
