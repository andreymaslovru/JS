import { userApi } from '@api/ump/api'
import { create } from 'zustand'

import { UserFindModel } from '../../../open-api/ump/api'

export interface LayoutStore<T> {
    data: T | null
    userId: string | null
    error: string | null
    isOpened: boolean
    isLoading: boolean
}

export interface IModalUserActions {
  fetchData: (id: string) => void
}

export const useModalUserStore = create<LayoutStore<UserFindModel> & IModalUserActions>()((set, get) => ({
  data: null,
  userId: null,
  isOpened: false,
  error: null,
  isLoading: false,
  fetchData: async (id) => {
    const res = await userApi.findUserIdUserFindUserIdGet(id)

    if (res?.status === 200) {
      const user = res?.data?.data?.[0]

      set((state) => ({ ...state, data: user }))
    }
  }
}))
