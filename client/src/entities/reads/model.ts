
import { messengerApi, userApi } from '@api/ump/api'
import { create } from 'zustand'

import { GetMessageResponse, UserFindModel, UserWithoutPassword } from '../../../open-api/ump/api'

export interface IStore {
  data: string[]
}

export interface IActions {
    addIsReadMessage: (id_message: string) => void
    getIsReadMessage: (id_message: string) => boolean
}

export const useReadingStore = create<IStore & IActions>()((set, get) => ({
  data: [],

  getIsReadMessage: (id_message: string) => !!get().data.find((id) => id === id_message),

  addIsReadMessage: (id_message: string) => set((state) => ({ ...state, data: [...state.data, id_message] }))
}))
