import {
  useMutation,
  type UseMutationOptions,
  type UseMutationReturnType,
  useQueries,
  useQuery,
  type UseQueryOptions,
  type UseQueryReturnType
} from '@tanstack/vue-query';

import { api } from '../api';

type ApiError = Error | Record<string, unknown>;
type QueryKey = readonly unknown[];

export type QueryOptions<TData, TError = ApiError> = Omit<
  UseQueryOptions<TData, TError, TData, QueryKey>,
  'queryKey' | 'queryFn'
>;

export const useApiQuery = <TData, TTransformed = TData, TError = ApiError>({
  queryKey,
  url,
  params,
  options,
  transform
}: {
  queryKey: QueryKey;
  url: string;
  params?: Record<string, unknown>;
  options?: QueryOptions<TTransformed, TError>;
  transform?: (data: TData) => TTransformed;
}): UseQueryReturnType<TTransformed, TError> => {
  return useQuery<TTransformed, TError, TTransformed, QueryKey>({
    queryKey,
    queryFn: async () => {
      const data = await api.get<TData>(url, params);
      return transform ? transform(data) : (data as TTransformed);
    },
    ...options
  });
};

export const useApiQueries = <TData, TTransformed = TData>({
  queryKey,
  url,
  ids,
  params,
  transform
}: {
  ids: Array<string | number>;
  queryKey: QueryKey;
  url: (id: string | number) => string;
  params?: Record<string, unknown>;
  transform?: (data: TData) => TTransformed;
}) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: [...queryKey, id] as QueryKey,
      queryFn: async () => {
        const data = await api.get<TData>(url(id), params);
        return transform ? transform(data) : (data as TTransformed);
      }
    }))
  });
};

export type MutationMethod = 'post' | 'put' | 'patch' | 'delete';

export type MutationOptions<TData, TVariables, TError = ApiError> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn'
>;

export const useApiMutation = <TData, TVariables, TError = ApiError>(
  url: string,
  method: MutationMethod,
  options?: MutationOptions<TData, TVariables, TError>
): UseMutationReturnType<TData, TError, TVariables, unknown> => {
  return useMutation<TData, TError, TVariables, unknown>({
    mutationFn: async (variables: TVariables) => {
      return api[method]<TData>(url, variables);
    },
    ...options
  });
};
