import { useQueryClient } from '@tanstack/vue-query';

import { API_ROUTES, useApiMutation } from 'shared/api';

import { TASKS_QUERY_KEY } from '../constants';
import { type Task } from '../types/task';
import type { TaskFormValues } from '../types/taskForm';

export const useUpdateTask = (boardId: string, columnId: string, taskId: string) => {
  const queryClient = useQueryClient();

  return useApiMutation<Task, TaskFormValues>(API_ROUTES.taskById(boardId, columnId, taskId), 'patch', {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [TASKS_QUERY_KEY, boardId, columnId] });
    }
  });
};
