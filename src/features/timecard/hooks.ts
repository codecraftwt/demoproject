import {
  useMutateItem,
  useGetItemOrNew,
  useGetItemById,
} from '../../hooks/entityMethodsHook'

export const useMutateTimesheet = (key: any) => {
  const uri = 'timecards'
  return useMutateItem(key, uri)
}

export const useGetTimeCard = (key: any, projectId: string | undefined) => {
  const uri = 'timecards'
  return useGetItemOrNew(key, uri, !!projectId)
}

export const useGetWorker = (key: any, workerId: string | undefined) => {
  const uri = `users/${workerId}`
  return useGetItemById(key, uri, workerId)
}

export const useGetAuthUser = (key: any, authSub: string | undefined) => {
  const uri = `users/profile/${authSub}`
  return useGetItemById(key, uri, authSub)
}