import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import Api from '../lib/api'
import { validateArrayStructure } from '../utils/utilities'

// GET list of items.
export const useGetListItems = (
  queryKey: string,
  endpoint: string | undefined,
  params?: {},
  enabled?: boolean | undefined
) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()
  const key = queryKey?.replace(/-|\s/g, '')
  const isEnabled = typeof enabled === 'boolean' ? enabled : isAuthenticated

  return useQuery(
    [key, endpoint, params],
    async () => {
      const token = await getAccessTokenSilently()
      const response = await Api.get(`v1/${endpoint}`, token, params)
      return response
    },
    {
      refetchOnWindowFocus: false, // Optionally disable if not needed
      refetchOnMount: false, // Disable automatic refetch on mount
      retry: 2,
      enabled: isEnabled,
    }
  )
}

export const useMutateDeleteQuestionItem = (
  key: string,
  endpoint: string | undefined
) => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()
  const mutation = useMutation(
    async ({ id, questionId }: { id: any; questionId: any }) => {
      const token = await getAccessTokenSilently()
      const response = await Api.delete(
        `v1/${endpoint}/${id}/question/${questionId}`,
        token
      )
      return response
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [key] })
      },
    }
  )
  return mutation
}

export const useGetPaginatedListItems = (
  queryKey: string,
  endpoint: string | undefined,
  queryOptions: any
) => {
  const { getAccessTokenSilently } = useAuth0()
  const key = queryKey.replace(/-|\s/g, '')
  return useQuery(
    [key, endpoint, queryOptions],
    async () => {
      const token = await getAccessTokenSilently()
      return await Api.post(`v1/${endpoint}`, queryOptions, token)
    },
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 2,
    }
  )
}

// GET item by id.
export const useGetItemById = (
  queryKey: string,
  endpoint: string | undefined,
  id: string | undefined
) => {
  const { getAccessTokenSilently } = useAuth0()
  const key = queryKey.replace(/-|\s/g, '')
  return useQuery(
    [key, endpoint],
    async () => {
      const token = await getAccessTokenSilently()
      const response = await Api.get(`v1/${endpoint}`, token)
      return response
    },
    {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 2,
      enabled: !!id,
      cacheTime: 0,
    }
  )
}

// GET item by id.
export const useGetItem = (
  queryKey: string,
  endpoint: string | undefined,
  enabled: boolean | undefined
) => {
  const { getAccessTokenSilently } = useAuth0()
  const key = queryKey.replace(/-|\s/g, '')
  return useQuery(
    [key, endpoint],
    async () => {
      const token = await getAccessTokenSilently()
      const response = await Api.get(`v1/${endpoint}`, token)
      return response
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
      enabled: !!enabled,
    }
  )
}

export const useGetItemOrNew = (
  queryKey: string,
  endpoint: string | undefined,
  enabled: boolean | undefined
) => {
  const { getAccessTokenSilently } = useAuth0()
  const itemId = queryKey[1] || null
  const key = [queryKey, endpoint]
  return useQuery(
    [key, endpoint],
    async () => {
      const apiUri = itemId ? `${endpoint}/${itemId}` : `${endpoint}`
      const token = await getAccessTokenSilently()
      const response = await Api.get(`v1/${apiUri}`, token)
      return response
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
      enabled: !!enabled,
    }
  )
}

// Update or Add a new item.
export const useMutateItem = (
  key: string,
  endpoint: string | undefined,
  query?: string,
  key2?: string
) => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (item: any) => {
      const token = await getAccessTokenSilently()
      const queryTail = item.hasOwnProperty('$match') ? `?${item.$match}` : ''
      delete item.$match
      const response = item.hasOwnProperty('_id')
        ? await Api.put(`v1/${endpoint}/${item._id}${queryTail}`, item, token)
        : await Api.post(`v1/${endpoint}`, item, token)
      return response
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [key, key2] })
      },
    }
  )
  return mutation
}

// Add images in daily reports 
export const useMutateItemWithFileUpload = (
  key: string,
  endpoint: string | undefined,
  query?: string,
  key2?: string
) => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (item: any) => {
      const token = await getAccessTokenSilently()
      let url: string
      let method: 'POST' | 'PUT'
      let files=[]
      if (item instanceof FormData) {
         files = item.getAll('image') as any
        const dailyReport = JSON.parse(item.get('dailyReport') as string)
        url = dailyReport._id
          ? `v1/${endpoint}/${dailyReport.project}`
          : `v1/${endpoint}`
           method = dailyReport._id ? 'PUT' : 'POST'
      }else{
        const queryTail = item.hasOwnProperty('$match') ? `?${item.$match}` : ''
        delete item.$match
        url = item._id
          ? `v1/${endpoint}/${item._id}${queryTail}`
          : `v1/${endpoint}`
           method = item._id ? 'PUT' : 'POST'
      }
      const response = await Api.upload(url, item, token, method)
      return response
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [key, key2] })
      },
    }
  )
  return mutation
}

// mutation with upload.
export const useMutateItemWithUpload = (
  key: string,
  endpoint: string | undefined,
  query?: string
) => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (item: any) => {
      const token = await getAccessTokenSilently()
      let url: string
      let method: 'POST' | 'PUT'

      if (item instanceof FormData) {
        // Handle FormData
        const workerData = JSON.parse(item.get('workerData') as string)
        url = workerData._id
          ? `v1/${endpoint}/${workerData._id}`
          : `v1/${endpoint}`
        method = workerData._id ? 'PUT' : 'POST'
      } else {
        // Handle regular object
        const queryTail = item.$match ? `?${item.$match}` : ''
        delete item.$match
        url = item._id
          ? `v1/${endpoint}/${item._id}${queryTail}`
          : `v1/${endpoint}`
        method = item._id ? 'PUT' : 'POST'
      }
      const response = await Api.upload(url, item, token, method)
      return response
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [key] })
      },
    }
  )
  return mutation
}

// Resend user invite
export const useMutateItemResendUserInvite = (
  key: string,
  endpoint: string | undefined
) => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (id: string) => {
      const token = await getAccessTokenSilently()
      const response = await Api.put(`v1/${endpoint}/${id}/resend`, null, token)
      return response
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [key] })
      },
    }
  )
  return mutation
}

// Delete item.
export const useMutateDeleteItem = (
  key: string,
  endpoint: string | undefined
) => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (id: any) => {
      const token = await getAccessTokenSilently()
      const response = await Api.delete(`v1/${endpoint}/${id}`, token)
      return response
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [key] })
      },
    }
  )
  return mutation
}

// Upload items.
export const useUploadValueList = (
  key: string,
  endpoint: string | undefined
) => {
  const { getAccessTokenSilently } = useAuth0()

  const queryClient = useQueryClient()
  const mutation = useMutation(
    async (valueListData: any) => {
      const token = await getAccessTokenSilently()

      const validationRes = validateArrayStructure(valueListData)
      if (!validationRes.isValid) {
        return validationRes
      }

      const accountValueListData = { valueListData: valueListData }
      const response = await Api.post(
        `v1/${endpoint}`,
        accountValueListData,
        token
      )
      return response
    },
    {
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({ queryKey: [key] }),
          queryClient.invalidateQueries({ queryKey: ['project'] }),
        ]),
    }
  )

  return mutation
}

export const useMutateUpload = (
  key: string,
  endpoint: string | undefined,
  query?: string
) => {
  const { getAccessTokenSilently } = useAuth0()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (item: any) => {
      const token = await getAccessTokenSilently()
      const response = await Api.upload(`v1/${endpoint}`, item, token)
      return response
    },
    {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries()
        return data
      },
    }
  )
  return mutation
}

// Public Actions.

export const useGetItemPublic = (
  queryKey: string,
  endpoint: string | undefined,
  enabled: boolean | undefined
) => {
  const key = queryKey.replace(/-|\s/g, '')
  return useQuery(
    [key, endpoint],
    async () => {
      const response = await Api.get(`v1/${endpoint}`)
      return response
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
      enabled: !!enabled,
    }
  )
}

export const useMutateItemPublic = (
  key: string,
  endpoint: string | undefined,
  query?: string
) => {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (item: any) => {
      const response = await Api.post(`v1/${endpoint}`, item)
      return response
    },
    {
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: [key] })
        return data
      },
    }
  )
  return mutation
}
