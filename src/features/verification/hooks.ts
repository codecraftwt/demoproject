import {
  useQuery,
} from '@tanstack/react-query'
import Api from '../../lib/api'

export const useVerification = (key: string, value: any) => {
  return useQuery(
    [key, value],
    async ({ querykey }: any) => {
      const id = value
      return await Api.get(`v1/users/verification/${id}`)
    }, {
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

export const useVerificationAccount = (key: string, value: any) => {
  return useQuery(
    [key, value],
    async ({ querykey }: any) => {
      const id = value
      return await Api.get(`v1/users/account-verification/${id}`)
    }, {
    refetchOnWindowFocus: false,
    retry: 1,
  })
}