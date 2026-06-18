import type { Column } from '../types/column';

export const reorderColumns = (columns: Column[], columnId: string, newOrder: number): Column[] => {
  const sorted = [...columns].sort((a, b) => a.order - b.order);
  const oldIndex = sorted.findIndex((column) => column.id === columnId);

  if (oldIndex === -1 || oldIndex === newOrder) {
    return sorted;
  }

  const reordered = [...sorted];
  const [movedColumn] = reordered.splice(oldIndex, 1);
  reordered.splice(newOrder, 0, movedColumn);

  return reordered.map((column, index) => ({
    ...column,
    order: index
  }));
};
