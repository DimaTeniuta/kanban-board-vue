import { computed } from 'vue';
import { z } from 'zod';

import { type Board, BOARDS_QUERY_KEY, boardSchema } from 'entities/board';
import { useApiQuery } from 'shared/api';
import { API_ROUTES } from 'shared/api/apiRoutes';

interface BoardsApiResponse {
  boards: Board[];
}

const boardsResponseSchema = z.object({
  boards: z.array(boardSchema)
});

export const useGetBoards = () => {
  const { data, isPending, isError } = useApiQuery<BoardsApiResponse>({
    url: API_ROUTES.boards(),
    queryKey: [BOARDS_QUERY_KEY],
    schema: boardsResponseSchema
  });

  const boards = computed(() => data.value?.boards ?? []);
  const hasBoards = computed(() => !!data.value?.boards?.length);

  return { boards, hasBoards, isPending, isError };
};
