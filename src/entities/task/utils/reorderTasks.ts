import type { Task } from '../types/task';

export const reorderTasks = (tasks: Task[], taskId: string, newOrder: number): Task[] => {
  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  const oldIndex = sorted.findIndex((task) => task.id === taskId);

  if (oldIndex === -1 || oldIndex === newOrder) {
    return sorted;
  }

  const reordered = [...sorted];
  const [movedTask] = reordered.splice(oldIndex, 1);
  reordered.splice(newOrder, 0, movedTask);

  return reordered.map((task, index) => ({
    ...task,
    order: index
  }));
};

export const transferTask = (
  sourceTasks: Task[],
  targetTasks: Task[],
  taskId: string,
  newColumnId: string,
  newOrder: number
): { sourceTasks: Task[]; targetTasks: Task[] } => {
  const sortedSource = [...sourceTasks].sort((a, b) => a.order - b.order);
  const oldIndex = sortedSource.findIndex((task) => task.id === taskId);

  if (oldIndex === -1) {
    return {
      sourceTasks: sortedSource,
      targetTasks: [...targetTasks].sort((a, b) => a.order - b.order)
    };
  }

  const [movedTask] = sortedSource.splice(oldIndex, 1);
  const updatedSource = sortedSource.map((task, index) => ({
    ...task,
    order: index
  }));

  const sortedTarget = [...targetTasks].sort((a, b) => a.order - b.order);
  const updatedMoved: Task = { ...movedTask, columnId: newColumnId };
  sortedTarget.splice(newOrder, 0, updatedMoved);

  const updatedTarget = sortedTarget.map((task, index) => ({
    ...task,
    order: index
  }));

  return { sourceTasks: updatedSource, targetTasks: updatedTarget };
};
