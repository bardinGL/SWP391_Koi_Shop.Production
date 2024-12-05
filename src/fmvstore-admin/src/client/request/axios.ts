import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { redirect } from 'next/navigation'
import qs from 'qs'

import {
  clearSessionCookie,
  getCurrentAccessToken,
  getCurrentRefreshToken,
  setSessionCookie,
} from './cookie'
import { AuthService } from '../services.gen'

// NOTE : swagger gen and axios always on top, do not circle includes
const basePath = ''

let isRefreshing = false
function sleep() {
  return new Promise((resolve) => setTimeout(resolve, 700))
}

const defaultConfig = {
  timeout: 10000,
  withCredentials: true,
}

const hiddenMsgUrl = ['/email/check'].map((e: string) => `${basePath}${e}`)
const getErrorCode = (error: any) =>
  error?.response?.data?.errors?.[0]?.code || error?.response?.status || ''

const getErrorMsg = (error: any) =>
  error?.response?.data?.errors?.[0]?.detail ||
  error?.response?.statusText ||
  error?.response?.status

const addRequestInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig<any>) => {
      if (isRefreshing && !(config.url ?? '').includes('/auth/refresh-token')) {
        await sleep()
      }

      const accessToken = getCurrentAccessToken()
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      }
      config.paramsSerializer = (params) => {
        return qs.stringify(params, {
          arrayFormat: 'brackets',
          encode: false,
        })
      }

      return config
    },
    /* istanbul ignore next */
    //TODO: cannot mock request error
    (error: any) => {
      console.error(getErrorMsg(error))
      return Promise.reject(error)
    },
  )
}

const getRefreshPromise = async () => {
  const refreshToken = getCurrentRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token')
  }

  if (isRefreshing) return

  isRefreshing = true
  const result = await AuthService.authControllerRefreshToken({
    requestBody: { token: refreshToken },
  }).finally(() => {
    isRefreshing = false
  })

  setSessionCookie(result)
}

let errorId: any = null
const addResponseInterceptors = (instance: AxiosInstance) => {
  const interceptorId = instance.interceptors.response.use(
    (response: any) => response,
    async (error) => {
      // if (!isPath(error.config?.url).startsWith(...hiddenMsgUrl)) {
      //   console.error(getErrorMsg(error));
      // }

      const httpErrCode = getErrorCode(error)
      if (
        (httpErrCode !== 401 && httpErrCode !== 403) ||
        error.config?.url.includes('/auth/refresh-token')
      ) {
        if (
          (!httpErrCode || httpErrCode >= 500) &&
          typeof window !== 'undefined'
        ) {
          if (errorId) {
            clearTimeout(errorId)
          }
          errorId = setTimeout(() => {
            console.log('A server error has occurred. Please try again.')
          }, 500)
        }
        return Promise.reject(error)
      }

      instance.interceptors.response.eject(interceptorId)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('csrfToken')
      }
      try {
        // message.loading({ content: 'Refreshing token ...', key: 'refreshToken' })
        await getRefreshPromise() // refresh token
        // message.success({ content: 'Refreshing token done', key: 'refreshToken' })
        return instance.request(error.config) // resume api
      } catch (e) {
        // message.error({ content: 'Refreshing token fail, logout ...', key: 'refreshToken' })
        console.error('Error on refresh token, going to logout::', e)
        clearSessionCookie()
        redirect('/login')
      } finally {
        addResponseInterceptors(instance)
        // Router.reload()
      }
    },
  )
}

const createApiPjc = (config: any = defaultConfig) => {
  const instance = axios.create(config)
  addRequestInterceptors(instance)
  addResponseInterceptors(instance)

  return instance
}

/**
 * api with interceptors
 */

const apiPjc = createApiPjc()

export * from 'axios'
export default apiPjc
