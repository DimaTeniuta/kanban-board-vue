import { useQueryClient } from '@tanstack/vue-query';

import { API_ROUTES, useApiMutation } from 'shared/api';

import { PROFILE_QUERY_KEY } from '../constants';
import { type UpdateProfileValues } from '../types/updateProfile';
import { type User } from '../types/user';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useApiMutation<User, UpdateProfileValues>(API_ROUTES.profile(), 'put', {
    onSuccess: (data: User) => {
      queryClient.setQueryData([PROFILE_QUERY_KEY], data);
    }
  });
};
