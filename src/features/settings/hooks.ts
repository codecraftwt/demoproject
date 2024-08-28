import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Api from '../../lib/api'
import {
  useGetListItems,
  useMutateDeleteItem,
  useMutateItem,
} from '../../hooks/entityMethodsHook'

export const useGetTimezones = () => {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery(
    [],
    async () => {
      const token = await getAccessTokenSilently()
      return await Api.get(`v1/timezones`, token)
    },
    {
      refetchOnWindowFocus: false,
      retry: 2,
    }
  )
}

export const useGetSettingsByUserId = (key: string) => {
  const { getAccessTokenSilently } = useAuth0()
  return useQuery(
    [key],
    async ({ queryKey }: any) => {
      const token = await getAccessTokenSilently()
      return await Api.get(`v1/settings`, token)
    },
    {
      refetchOnWindowFocus: true,
      retry: 2,
    }
  )
}

export const useMutateSettings = (key: string, value: any) => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (formData: any) => {
      const token = await getAccessTokenSilently()
      return await Api.post(`v1/users/settings`, formData, token)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['setting'] })
      },
    }
  )
  return mutation
}

export const useGetProjectForms = (key: any) => {
  const uri = 'forms/type/project/all'
  return useGetListItems(key, uri)
}

export const useGetAdminAndSupers = (key: any) => {
  const uri = 'users?type=vtadmin&type=superintendent'
  return useGetListItems(key, uri)
}

export const useMutateNukeAccount = (key: string) => {
  const uri = 'accounts/nuke'
  return useMutateDeleteItem(key, uri)
}

export const useGetKioskDevices = (key: string) => {
  const uri = `kiosk-devices`
  return useGetListItems(key, uri)
}

export const useMutateCreateKioskDevice = (key: string) => {
  const uri = `kiosk-devices`
  return useMutateItem(key, uri)
}

export const useMutateDeleteKioskDevice = (key: string) => {
  const uri = `kiosk-devices`
  return useMutateDeleteItem(key, uri)
}
