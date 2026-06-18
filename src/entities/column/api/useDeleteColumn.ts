import { useQueryClient } from '@tanstack/vue-query';

import { API_ROUTES, useApiMutation } from 'shared/api';

import { COLUMNS_QUERY_KEY } from '../constants';

export const useDeleteColumn = (boardId: string, columnId: string) => {
  const queryClient = useQueryClient();

  return useApiMutation(API_ROUTES.columnById(boardId, columnId), 'delete', {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [COLUMNS_QUERY_KEY, boardId] });
    }
  });
};
