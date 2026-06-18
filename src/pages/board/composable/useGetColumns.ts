import { computed } from 'vue';
import { z } from 'zod';

import { type Column, COLUMNS_QUERY_KEY, columnSchema } from 'entities/column';
import { useApiQuery } from 'shared/api';
import { API_ROUTES } from 'shared/api/apiRoutes';

interface ColumnsApiResponse {
  columns: Column[];
}

const columnsResponseSchema = z.object({
  columns: z.array(columnSchema)
});

export const useGetColumns = (boardId: string) => {
  const { data, isPending, isError } = useApiQuery<ColumnsApiResponse>({
    url: API_ROUTES.columns(boardId),
    queryKey: [COLUMNS_QUERY_KEY, boardId],
    schema: columnsResponseSchema
  });

  const columns = computed(() => {
    const items = data.value?.columns ?? [];
    return [...items].sort((a, b) => a.order - b.order);
  });

  const hasColumns = computed(() => columns.value.length > 0);

  return { columns, hasColumns, isPending, isError };
};
