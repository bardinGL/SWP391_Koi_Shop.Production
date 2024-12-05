import { Category } from '@/types'
import { axiosInstance } from './axios'

const getAllCategories = async () => {
  try {
    const response = await axiosInstance.get('/category')
    console.log(response.data)
    return response.data as Category[]
  } catch (error) {
    console.error(error)
  }
}

const createCategory = async (name: string) => {
  const response = await axiosInstance.post('/category', { name })
  return response.data
}

const updateCategory = async (id: string, name: string) => {
  const response = await axiosInstance.put(`/category/${id}`, { name })
  return response.data
}

const deleteCategory = async (id: string) => {
  const response = await axiosInstance.delete(`/category/${id}`)
  return response.data
}

export const categoryService = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
}
