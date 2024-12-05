import { axiosInstance } from './axios'

export const productService = {
  getProductDetail: async (id: string) => {
    const response = await axiosInstance.get(`/products/${id}`)
    return response.data
  },
  getAllProducts: async () => {
    const response = await axiosInstance.get('/products')
    return response.data
  },
  createProduct: async (data:any) => {
    const response = await axiosInstance.post('/products', data);
    return response.data;
},

  updateProduct: async (id: string, data: any) => {
    const response = await axiosInstance.put(`/products/${id}`, data)
    return response.data
  },
  deleteProduct: async (id: string) => {
    const response = await axiosInstance.delete(`/products/${id}`)
    return response.data
  },
}
