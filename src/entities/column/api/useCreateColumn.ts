import { useQueryClient } from '@tanstack/vue-query';

import { API_ROUTES, useApiMutation } from 'shared/api';

import { COLUMNS_QUERY_KEY } from '../constants';
import { type Column } from '../types/column';
import type { ColumnFormValues } from '../types/columnForm';

export const useCreateColumn = (boardId: string) => {
  const queryClient = useQueryClient();

  return useApiMutation<Column, ColumnFormValues>(API_ROUTES.columns(boardId), 'post', {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [COLUMNS_QUERY_KEY, boardId] });
    }
  });
};
