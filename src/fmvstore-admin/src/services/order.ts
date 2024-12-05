import { axiosInstance } from './axios'

export const orderService = {
  checkout: async (promotionCode?: string) => {
    let response: any
    // if (promotionCode) {
    //   response = await axiosInstance.post('/orders/checkout', {
    //     promotionCode,
    //   })
    // } else {
    //   response = await axiosInstance.post('/orders/checkout')
    // }
    response = await axiosInstance.post('/orders/checkout')
    console.log('🚀 ~ checkout: ~ response:', response)
    return response.data
  },
  getAllOrders: async () => {
    const response = await axiosInstance.get('/orders/all')
    console.log('🚀 ~ getOrders: ~ response:', response)
    return response.data
  },
  acceptOrder: async (orderId: string) => {
    const response = await axiosInstance.post(`/orders/accept?orderId=${orderId}`)
    return response.data
  },
  rejectOrder: async (orderId: string) => {
    const response = await axiosInstance.post(
      `/orders/reject?orderId=${orderId}`,
    )
    return response.data
  },
}
