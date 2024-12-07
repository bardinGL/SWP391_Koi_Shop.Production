import { axiosInstance } from './axios'

export const userService = {
  me: async (uid: string, token?: string) => {
    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    const response = await axiosInstance.get(`/users/${uid}`)
    return response.data
  },
  update: async (data: any) => {
    const response = await axiosInstance.put(`/users/${data.id}`, data)
    return response.data
  },
}
