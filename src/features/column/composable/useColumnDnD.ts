import { makeDroppable } from '@vue-dnd-kit/core';
import { type Ref, useTemplateRef } from 'vue';

import type { Column } from 'entities/column';
import { useUpdateColumnOrder } from 'entities/column';

import { COLUMN_DND_GROUP } from '../constants/dnd';

export const useColumnDnD = (boardId: string, columns: Ref<Column[]>) => {
  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');
  const { mutate: updateColumnOrder } = useUpdateColumnOrder(boardId);

  const { isDragOver: isZoneDragOver } = makeDroppable(
    zoneRef,
    {
      groups: [COLUMN_DND_GROUP],
      events: {
        onDrop(event) {
          const result = event.helpers.suggestSort('horizontal');

          if (!result?.sameList) {
            return;
          }

          const sourceIndex = result.sourceIndexes[0];

          if (sourceIndex === undefined || sourceIndex === result.targetIndex) {
            return;
          }

          const column = columns.value[sourceIndex];

          if (!column) {
            return;
          }

          updateColumnOrder({ columnId: column.id, newOrder: result.targetIndex });
        }
      }
    },
    () => columns.value
  );

  return { isZoneDragOver };
};
