import { useQueryClient } from '@tanstack/vue-query';

import { API_ROUTES } from 'shared/api/apiRoutes';
import { useApiMutation } from 'shared/api/composable/useApi';

import { COLUMNS_QUERY_KEY } from '../constants';
import type { Column } from '../types/column';
import type { ColumnFormValues } from '../types/columnForm';

export const useUpdateColumn = (boardId: string, columnId: string) => {
  const queryClient = useQueryClient();

  return useApiMutation<Column, ColumnFormValues>(API_ROUTES.columnById(boardId, columnId), 'put', {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [COLUMNS_QUERY_KEY, boardId] });
    }
  });
};
