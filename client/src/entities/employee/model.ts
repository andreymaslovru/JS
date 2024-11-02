import { authApi, userApi } from '@api/ump/api'
import { create } from 'zustand'
import { AxiosResponse } from 'axios'

import { GetUsersResponse, UserFindModel } from '../../../open-api/ump/api'

const BasePeopleState = {
  data: null,
  error: null,
  isLoading: false
}

export interface LayoutStore<T> {
    data: T | null
    error: string | null
    isLoading: boolean
}

export interface IPeopleActions {
  getPeople: () => void
  searchPeople: (query: string) => void
  addStatus: (id: string, status: string) => void
}

export const usePeopleStore = create<LayoutStore<Array<UserFindModel>> & { searchList: UserFindModel[] | null } & IPeopleActions>()((set) => ({
  data: null,
  searchList: null,
  error: null,
  isLoading: false,
  getPeople: async () => {
    const res = await userApi.getUsersUserGetUsersGet()

    set((state) => ({ ...state, data: res?.data?.data }))
  },
  searchPeople: async (query: string) => {
    if (!query) {
      set((state) => ({ ...state, searchList: null }))

      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await userApi.findUserUserFindUserGet(query) as AxiosResponse<any>

    set((state) => ({ ...state, searchList: res?.data?.data as UserFindModel[] }))
  },
  addStatus: (id: string, status: string) => {
    set((state) => ({ ...state, data: state?.data?.map((el) => {
      if (el?.id === id) {
        return { ...el, status }
      } else {
        return el
      }
    }) }))
  }
}))
