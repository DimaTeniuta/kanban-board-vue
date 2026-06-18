import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue3-toastify';

import { api, API_ROUTES } from 'shared/api';
import { getApiErrorMessage } from 'shared/utils/getApiErrorMessage';

import { COLUMNS_QUERY_KEY } from '../constants';
import type { Column } from '../types/column';
import type { UpdateColumnOrderVariables } from '../types/updateColumnOrder';
import { reorderColumns } from '../utils/reorderColumns';

interface ColumnsApiResponse {
  columns: Column[];
}

interface UpdateColumnOrderContext {
  previousData: ColumnsApiResponse | undefined;
}

export const useUpdateColumnOrder = (boardId: string) => {
  const queryClient = useQueryClient();
  const queryKey = [COLUMNS_QUERY_KEY, boardId] as const;

  return useMutation<Column, Error, UpdateColumnOrderVariables, UpdateColumnOrderContext>({
    mutationFn: async ({ columnId, newOrder }) => {
      return api.patch<Column>(API_ROUTES.columnOrder(boardId, columnId), { newOrder });
    },
    onMutate: async ({ columnId, newOrder }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<ColumnsApiResponse>(queryKey);

      if (previousData) {
        queryClient.setQueryData<ColumnsApiResponse>(queryKey, {
          columns: reorderColumns(previousData.columns, columnId, newOrder)
        });
      }

      return { previousData };
    },
    onError: (error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      toast.error(getApiErrorMessage(error));
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey });
    }
  });
};
