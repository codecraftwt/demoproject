import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import Api from "../../lib/api";

export const useGetInfo = (key: string, value: any) => {
  const { getAccessTokenSilently } = useAuth0();
  return useQuery(
    [key, value],
    async ({ queryKey }: any) => {
      const sub = queryKey[1];
      const token = await getAccessTokenSilently();
      return await Api.get(`v1/users/profile/${sub}`, token);
    },
    {
      refetchOnWindowFocus: false,
      retry: 2,
      enabled: !!value, // If no sub don't send the request
    }
  );
};

export const useGetStatsInfo = (key: string) => {
  const { getAccessTokenSilently } = useAuth0();
  return useQuery(
    [key],
    async () => {
      const token = await getAccessTokenSilently();
      return await Api.get(`v1/dashboard/statistics`, token);
    },
    {
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );
};

export const useGetHrViolations = (key: string, params: any) => {
  const { getAccessTokenSilently } = useAuth0();
  return useQuery(
    [key, params],
    async () => {
      const token = await getAccessTokenSilently();
      return await Api.get(`v1/dashboard/hr-violations`, token, params);
    },
    {
      refetchOnWindowFocus: false,
      retry: 2,
    }
  );
};

export const useMutateInfo = (key: string, value: any) => {
  const { getAccessTokenSilently } = useAuth0();
  const sub = value;
  const mutation = useMutation(async (event: any) => {
    const token = await getAccessTokenSilently();
    return await Api.post(`v1/users/profile/${sub}`, event.target.value, token);
  });
  return mutation;
};
