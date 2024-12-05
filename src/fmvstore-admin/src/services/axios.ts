import axios from 'axios'

let accessToken: string | null = null

if (typeof window !== 'undefined') {
  accessToken = localStorage.getItem('access_token')
}
const headers: any = {
  
} 

if (accessToken) {
  headers.Authorization = 'Bearer ' + accessToken
}

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/store',
  headers: headers,
})

axiosInstance.interceptors.request.use(
  (config) => {
    // handle before request is sent
    return config
  },
  (error) => {
    // handle request error
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    // handle response data
    return response
  },
  (error) => {
    // handle response un-authen error
    const currentPage = window.location.pathname
    if (error.response.status === 401 && currentPage !== '/login') {
      console.log('401')
      //redirect to login page
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
