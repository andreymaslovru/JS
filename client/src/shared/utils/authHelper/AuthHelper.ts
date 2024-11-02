import axios from 'axios'
import base64Url from 'base64url'

export const LOGOUT_TIME = 900000 // 15 minutes in ms
const DELAY_DEBOUNCE = 3000 // 3 seconds in ms

type AuthData = {
  exp: number | null
  id: string | null
  role: string | null
  sub: string
}
class AuthHelper {
  public authData: AuthData | null = null
  public token: string | null = ''

  public isAuth = !!this.token

  public getAuthData = (token: string | null | undefined): AuthData | null => {
    let authData = null

    try {
      const authDataEncode = token?.split('.')?.[1]

      authData = authDataEncode ? JSON.parse(base64Url.decode(authDataEncode)) : null
    } catch (error) {
      authData = null
    }

    return authData
  }

  public configureAxios = (handleLogout?: () => void) => {
    console.log('88888')
    axios.defaults.withCredentials = true
    axios.defaults.headers.common = {
      'Content-Type': 'application/json;charset=UTF-8'
    }

    axios.interceptors.response.use((config) => {
      console.log(config, 'config')
      if (config?.status === 401) {
        handleLogout?.()
      }

      return config
    })

    axios.interceptors.request.use((config) => {
      const controller = new AbortController()

      if (!this.token) {
        controller.abort()
      }

      const headers = {
        Authorization: `Bearer ${this.token}`,
        ...config.headers
      }

      return Object.assign(config, {
        headers
      })
    })
  }

  public initialize = async (token?: string | null, handleLogout?: () => void) => {
    console.log('-0-0-0-')
    this.configureAxios(handleLogout)
    this.token = token || window.localStorage.getItem('access_token')
    this.getAuthData(token)
  }
}

const authHelper = new AuthHelper()

export { authHelper, AuthHelper }
