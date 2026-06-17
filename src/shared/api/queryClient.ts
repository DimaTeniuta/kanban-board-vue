import { QueryClient } from '@tanstack/vue-query';

import { VALIDATION_ERROR_NAME } from 'shared/constants/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5 * 60 * 1_000, // 5 minutes
      retry: (failureCount, error) => {
        if (error && error.name === VALIDATION_ERROR_NAME) {
          return false;
        }
        return failureCount < 3;
      },
      throwOnError: (error) => {
        if (error && error.name === VALIDATION_ERROR_NAME) {
          return true;
        }

        return false;
      }
    },
    mutations: {
      retry: false,
      onError: (error) => {
        if (error && error.name === VALIDATION_ERROR_NAME) {
          return true;
        }
      }
    }
  }
});
