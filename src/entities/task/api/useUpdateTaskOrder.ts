import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue3-toastify';

import { api, API_ROUTES } from 'shared/api';
import { getApiErrorMessage } from 'shared/utils/getApiErrorMessage';

import { TASKS_QUERY_KEY } from '../constants';
import type { Task } from '../types/task';
import type { UpdateTaskOrderVariables } from '../types/updateTaskOrder';
import { reorderTasks, transferTask } from '../utils/reorderTasks';

interface TasksApiResponse {
  tasks: Task[];
}

interface UpdateTaskOrderContext {
  previousSource: TasksApiResponse | undefined;
  previousTarget: TasksApiResponse | undefined;
  sourceColumnId: string;
  newColumnId: string;
}

export const useUpdateTaskOrder = (boardId: string) => {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, UpdateTaskOrderVariables, UpdateTaskOrderContext>({
    mutationFn: async ({ taskId, sourceColumnId, newColumnId, newOrder }) => {
      return api.patch<Task>(API_ROUTES.taskOrder(boardId, sourceColumnId, taskId), {
        newOrder,
        newColumnId
      });
    },
    onMutate: async ({ taskId, sourceColumnId, newColumnId, newOrder }) => {
      const sourceQueryKey = [TASKS_QUERY_KEY, boardId, sourceColumnId] as const;
      const targetQueryKey = [TASKS_QUERY_KEY, boardId, newColumnId] as const;

      await queryClient.cancelQueries({ queryKey: sourceQueryKey });

      if (sourceColumnId !== newColumnId) {
        await queryClient.cancelQueries({ queryKey: targetQueryKey });
      }

      const previousSource = queryClient.getQueryData<TasksApiResponse>(sourceQueryKey);
      const previousTarget =
        sourceColumnId !== newColumnId ? queryClient.getQueryData<TasksApiResponse>(targetQueryKey) : undefined;

      if (sourceColumnId === newColumnId && previousSource) {
        queryClient.setQueryData<TasksApiResponse>(sourceQueryKey, {
          tasks: reorderTasks(previousSource.tasks, taskId, newOrder)
        });
      } else if (previousSource && previousTarget) {
        const { sourceTasks, targetTasks } = transferTask(
          previousSource.tasks,
          previousTarget.tasks,
          taskId,
          newColumnId,
          newOrder
        );

        queryClient.setQueryData<TasksApiResponse>(sourceQueryKey, { tasks: sourceTasks });
        queryClient.setQueryData<TasksApiResponse>(targetQueryKey, { tasks: targetTasks });
      }

      return { previousSource, previousTarget, sourceColumnId, newColumnId };
    },
    onError: (error, _variables, context) => {
      if (!context) {
        return;
      }

      const sourceQueryKey = [TASKS_QUERY_KEY, boardId, context.sourceColumnId] as const;

      if (context.previousSource) {
        queryClient.setQueryData(sourceQueryKey, context.previousSource);
      }

      if (context.previousTarget && context.sourceColumnId !== context.newColumnId) {
        const targetQueryKey = [TASKS_QUERY_KEY, boardId, context.newColumnId] as const;
        queryClient.setQueryData(targetQueryKey, context.previousTarget);
      }

      toast.error(getApiErrorMessage(error));
    },
    onSettled: async (_data, _error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY, boardId, variables.sourceColumnId]
      });

      if (variables.sourceColumnId !== variables.newColumnId) {
        await queryClient.invalidateQueries({
          queryKey: [TASKS_QUERY_KEY, boardId, variables.newColumnId]
        });
      }
    }
  });
};
