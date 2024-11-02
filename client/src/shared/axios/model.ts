
import { create } from 'zustand'

export interface IStore {
    isAuth: boolean
    token: string | null
}

export interface IAuthActions {
  getIsAuth: () => boolean
  logout: () => void
  login: (token: string) => void
}

export const useAuthStore = create<IStore & IAuthActions>()((set) => ({
  token: typeof window !== 'undefined' ? window.localStorage.getItem('access_token') : null,
  isAuth: false,
  getIsAuth: () => {
    const token = window.localStorage.getItem('access_token')

    set((state) => ({ ...state, isAuth: !!token }))

    return !!token
  },
  logout: () => {
    window.localStorage.removeItem('access_token')
    set((state) => ({ ...state, isAuth: false, token: null }))
  },
  login: (token: string) => {
    set(() => ({ isAuth: true, token }))
  }
}))
