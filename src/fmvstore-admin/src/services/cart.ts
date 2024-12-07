import { useToast } from '@/hooks/useToast'
import { axiosInstance } from './axios'

export const cartService = {
  addProductToCart: async () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cart.length === 0) {
      return useToast().error('Nothing in cart to add!')
    }
    const promises = cart.map((cartItem: any) => {
      const { item, quantity } = cartItem
      const response = axiosInstance.post(`/cart/add/${item.id}`, { quantity })
      return response
    })
    await Promise.all(promises)
    localStorage.removeItem('cart')
    return useToast().success('Added to cart successfully!')
  },
}
