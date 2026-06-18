import { useQueryClient } from '@tanstack/vue-query';

import { type Board, BOARDS_QUERY_KEY } from 'entities/board';
import { API_ROUTES, useApiMutation } from 'shared/api';

import { type BoardFormValues } from '../types/boardForm';

export const useUpdateBoard = (boardId: string) => {
  const queryClient = useQueryClient();

  return useApiMutation<Board, BoardFormValues>(API_ROUTES.boardById(boardId), 'patch', {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [BOARDS_QUERY_KEY] });
    }
  });
};
