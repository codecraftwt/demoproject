import {
  useMutateItemPublic,
  useGetItemPublic,
} from '../../hooks/entityMethodsHook'

export const useGetAccount = (key: string, queryParam: any) => {
  const uri = `accounts/find-account?companyName=${queryParam}`
  const enabled: boolean = !!queryParam
  return useGetItemPublic(key, uri, enabled)
}

export const useMutateCreateOrganization = (key: string) => {
  const uri = `accounts/create-organization`
  return useMutateItemPublic(key, uri)
}

export const useMutateRegisterUser = (key: string) => {
  const uri = `users/register-user`
  return useMutateItemPublic(key, uri)
}