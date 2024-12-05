'use client'
import useRequest from 'ahooks/es/useRequest'
import {
  Service,
  Options,
  Plugin,
  Result,
} from 'ahooks/lib/useRequest/src/types'
// import toast from 'react-hot-toast'

export function useFetch<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: Options<TData, TParams>,
  plugins?: Plugin<TData, TParams>[],
): Result<TData, TParams> {
  return useRequest(
    service,
    {
      ...options,
      onError: (error: any, params) => {
        // if (error?.body?.message) {
        //   toast.error(error?.body?.message) ||
        //     'Something went wrong. Please try again.'
        // }

        options?.onError?.(error, params)
      },
      // refreshOnWindowFocus:
      //     options?.refreshOnWindowFocus === undefined && !options?.manual,
    },
    plugins,
  )
}

export const cacheKey = {
  getMe: () => 'getMe',
} as const
