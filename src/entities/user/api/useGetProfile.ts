import { useApiQuery } from 'shared/api';
import { API_ROUTES } from 'shared/api/apiRoutes';

import { PROFILE_QUERY_KEY } from '../constants';
import { type User, userSchema } from '../types/user';

export const useGetProfile = () => {
  return useApiQuery<User>({
    url: API_ROUTES.profile(),
    queryKey: [PROFILE_QUERY_KEY],
    schema: userSchema
  });
};
