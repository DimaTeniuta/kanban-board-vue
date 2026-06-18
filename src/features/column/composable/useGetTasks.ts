import { computed } from 'vue';
import { z } from 'zod';

import { type Task, TASKS_QUERY_KEY, taskSchema } from 'entities/task';
import { useApiQuery } from 'shared/api';
import { API_ROUTES } from 'shared/api/apiRoutes';

interface TasksApiResponse {
  tasks: Task[];
}

const tasksResponseSchema = z.object({
  tasks: z.array(taskSchema)
});

export const useGetTasks = (boardId: string, columnId: string) => {
  const { data, isPending, isError } = useApiQuery<TasksApiResponse>({
    url: API_ROUTES.tasks(boardId, columnId),
    queryKey: [TASKS_QUERY_KEY, boardId, columnId],
    schema: tasksResponseSchema
  });

  const tasks = computed(() => {
    const items = data.value?.tasks ?? [];
    return [...items].sort((a, b) => a.order - b.order);
  });

  const hasTasks = computed(() => tasks.value.length > 0);

  return { tasks, hasTasks, isPending, isError };
};
