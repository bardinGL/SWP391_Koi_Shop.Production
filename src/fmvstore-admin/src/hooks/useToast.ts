import { Flip, toast } from 'react-toastify'

export const useToast = () => {
  return {
    success: (message: string) => {
      toast.success(message, {
        position: 'top-center',
        closeOnClick: true,
        theme: 'light',
        transition: Flip,
        hideProgressBar: true,
      })
    },
    error: (message: string) => {
      toast.error(message, {
        position: 'top-center',
        closeOnClick: true,
        theme: 'light',
        transition: Flip,
        hideProgressBar: true,
      })
    },
  }
}
