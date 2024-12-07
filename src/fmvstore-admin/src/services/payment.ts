import { axiosInstance } from './axios'

export const paymentService = {
  pay: async ({ amount, ipAddr }: { amount: number; ipAddr: string }) => {
    const response = await axiosInstance.post('/payment/create', {
      amount,
      ipAddr,
    })
    console.log('🚀 ~ pay: ~ response:', response)
    return response.data.result
  },
}
