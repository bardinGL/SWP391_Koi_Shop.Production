import { axiosInstance } from './axios'

export const promotionService = {
  getAll: async () => {
    const response = await axiosInstance.get('/promotion/get_all_promotion')
    return response.data
  },
  create: async (
    code: string,
    discountPercentage: number,
    startDate: string,
    endDate: string,
  ) => {
    const response = await axiosInstance.post('/promotion/create', {
      code,
      discountPercentage,
      startDate,
      endDate,
    })
    return response.data
  },
  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/promotion/delete/${id}`)
    return response.data
  },
}
