import Cookies from 'js-cookie'
import { LoginEntity, UserEntity } from '../types.gen'

export type CookieType = {
  role?: string
  admin?: string
  NEXT_LOCALE?: string
  client_redirect?: string
}

export const COOKIE_KEY = {
  role: 'role',
  redirect_client: 'redirect_client',
  NEXT_LOCALE: 'NEXT_LOCALE',
  IS_LOGIN: 'IS_LOGIN',
}

export const LOCAL_STORAGE_KEY = {
  user: 'user',
  admin: 'admin',
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  report_previewing: 'report_previewing',
  ir_news_previewing: 'ir_news_previewing',
}

export const setSessionCookie = (result: LoginEntity) => {
  setLocalStorage(result)
  if (result.user) {
    Cookies.set(COOKIE_KEY.role, result.user.role, { expires: 30 })
  }
}

export const clearSessionCookie = () => {
  Object.keys(COOKIE_KEY).forEach((key) => Cookies.remove(key))
  clearLocalStorage()
}

export const setLocalStorage = (result: LoginEntity) => {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.setItem(LOCAL_STORAGE_KEY.access_token, result.accessToken)
  //result.refreshToken
  localStorage.setItem(LOCAL_STORAGE_KEY.refresh_token, result.refreshToken)
  localStorage.setItem(LOCAL_STORAGE_KEY.user, JSON.stringify(result.user))
}

export const clearLocalStorage = () => {
  if (typeof window === 'undefined') {
    return
  }
  Object.keys(LOCAL_STORAGE_KEY).forEach((key) => localStorage.removeItem(key))
}

export function getCurrentRole(): string | null {
  return Cookies.get(COOKIE_KEY.role) || null
}

export function getCurrentUser(): UserEntity | null {
  if (typeof window === 'undefined') {
    return null
  }
  const user = localStorage.getItem(LOCAL_STORAGE_KEY.user)
  if (!user) return null
  return JSON.parse(user)
}

export function setCurrentUser(user: UserEntity) {
  localStorage.setItem(LOCAL_STORAGE_KEY.user, JSON.stringify(user))
}

export function getCurrentAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem(LOCAL_STORAGE_KEY.access_token) || null
}

export function getCurrentRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  return localStorage.getItem(LOCAL_STORAGE_KEY.refresh_token) || null
}
