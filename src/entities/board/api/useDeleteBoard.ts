import { useQueryClient } from '@tanstack/vue-query';

import { BOARDS_QUERY_KEY } from 'entities/board';
import { API_ROUTES, useApiMutation } from 'shared/api';

export const useDeleteBoard = (boardId: string) => {
  const queryClient = useQueryClient();

  return useApiMutation(API_ROUTES.boardById(boardId), 'delete', {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [BOARDS_QUERY_KEY] });
    }
  });
};
