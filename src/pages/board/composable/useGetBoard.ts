import { computed } from 'vue';

import { type Board, boardSchema } from 'entities/board';
import { useApiQuery } from 'shared/api';
import { API_ROUTES } from 'shared/api/apiRoutes';

export const useGetBoard = (boardId: string) => {
  const { data, isPending, isError } = useApiQuery<Board>({
    url: API_ROUTES.boardById(boardId),
    queryKey: ['board', boardId],
    schema: boardSchema
  });

  const board = computed(() => data.value ?? null);

  return { board, isPending, isError };
};
