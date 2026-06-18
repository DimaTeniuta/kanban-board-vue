import { makeDroppable } from '@vue-dnd-kit/core';
import { type Ref, useTemplateRef } from 'vue';

import type { Task } from 'entities/task';
import { useUpdateTaskOrder } from 'entities/task';

import { TASK_DND_GROUP } from '../constants/dnd';
import type { TaskDragData } from '../types/dnd';

export const useTaskDnD = (boardId: string, columnId: string, tasks: Ref<Task[]>) => {
  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');
  const { mutate: updateTaskOrder } = useUpdateTaskOrder(boardId);

  const { isDragOver: isZoneDragOver } = makeDroppable(
    zoneRef,
    {
      groups: [TASK_DND_GROUP],
      events: {
        onDrop(event) {
          const result = event.helpers.suggestSort('vertical');

          if (!result) {
            return;
          }

          const sourceIndex = result.sourceIndexes[0];

          if (sourceIndex === undefined) {
            return;
          }

          if (result.sameList && sourceIndex === result.targetIndex) {
            return;
          }

          const draggedItem = event.draggedItems[0];
          const sourceTasks = draggedItem.items as Task[];
          const task = sourceTasks[sourceIndex];

          if (!task) {
            return;
          }

          const dragData = draggedItem.data as TaskDragData | undefined;
          const sourceColumnId = dragData?.columnId ?? columnId;

          updateTaskOrder({
            taskId: task.id,
            sourceColumnId,
            newColumnId: columnId,
            newOrder: result.targetIndex
          });
        }
      }
    },
    () => tasks.value
  );

  return { isZoneDragOver };
};
