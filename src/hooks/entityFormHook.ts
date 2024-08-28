import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import Api from '../lib/api'

export const useGetHRQuestions = (key: string) => {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery(
    [key],
    async ({ queryKey }: any) => {
      const token = await getAccessTokenSilently()
      return await Api.get(`v1/questions/question`, token)
    },
    {
      refetchOnWindowFocus: false,
      retry: 2,
    }
  )
}

export const useGetEntityForm = (key: string, formId: string) => {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery(
    [key, formId],
    async ({ queryKey }: any) => {
      const token = await getAccessTokenSilently()
      return await Api.get(`v1/forms/type/project`, token)
    },
    {
      refetchOnWindowFocus: false,
      retry: 2,
    }
  )
}

export const useGetEntityFormByType = (key: string, value: any) => {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery(
    [key, value],
    async ({ queryKey }: any) => {
      const formType = queryKey[1] // e.g project, timesheet
      const token = await getAccessTokenSilently()
      return await Api.get(`v1/forms/type/${formType}`, token)
    },
    {
      refetchOnWindowFocus: true,
      retry: 2,
      enabled: true,
    }
  )
}

export const useGetAccountEntityForm = (key: string, value: any) => {
  return useQuery(
    [key, value],
    async ({ queryKey }: any) => {
      return await Api.get(`v1/forms/type/account`)
    },
    {
      refetchOnWindowFocus: true,
      retry: 2,
      enabled: true,
    }
  )
}
