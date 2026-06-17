import type { Board } from 'entities/board';
import { useApiQuery } from 'shared/api';
import { API_ROUTES } from 'shared/api/apiRoutes';

export const useGetBoards = () => {
  return useApiQuery<Board[]>({ url: API_ROUTES.boards(), queryKey: ['boards'] });
};
