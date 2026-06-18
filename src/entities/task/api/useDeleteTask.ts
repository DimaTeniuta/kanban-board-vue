import { useQueryClient } from '@tanstack/vue-query';

import { API_ROUTES, useApiMutation } from 'shared/api';

import { TASKS_QUERY_KEY } from '../constants';

export const useDeleteTask = (boardId: string, columnId: string, taskId: string) => {
  const queryClient = useQueryClient();

  return useApiMutation(API_ROUTES.taskById(boardId, columnId, taskId), 'delete', {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, boardId, columnId] });
    }
  });
};
