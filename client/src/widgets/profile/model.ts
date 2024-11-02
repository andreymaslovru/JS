import { authApi } from '@api/ump/api'
import { create } from 'zustand'

import { UserWithoutPassword } from '../../../open-api/ump/api'

const BaseProfileState = {
  data: null,
  error: null,
  isLoading: false
}

export interface LayoutStore<T> {
    data: T | null
    error: string | null
    isLoading: boolean
}

export interface IProfileActions {
  getProfile: () => Promise<UserWithoutPassword>
  reset: () => void
}

export const useProfileStore = create<LayoutStore<UserWithoutPassword> & IProfileActions>()((set) => ({
  ...BaseProfileState,
  getProfile: async () => {
    const res = await authApi.getCurrentUserClientCurrentUserGet()

    set((state) => ({ ...state, data: res?.data }))

    return res.data
  },
  reset: () => {
    set(BaseProfileState)
  }
}))
