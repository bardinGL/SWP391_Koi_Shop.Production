import { axiosInstance } from './axios'

const login = async (data: { username: string; password: string }) => {
  const response = await axiosInstance.post('/auth/token', data)
  return response.data
}

const register = async (data: any) => {
  const response = await axiosInstance.post('/users', data)
  return response.data
}

export const authService = {
  login,
  register,
}
