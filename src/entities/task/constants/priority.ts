import type { TaskPriority } from '../types/task';

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
  NONE: 'None'
};

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: 'info',
  MEDIUM: 'primary',
  HIGH: 'warning',
  CRITICAL: 'error',
  NONE: 'default'
};

export const TASK_PRIORITY_OPTIONS = (Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]).map((value) => ({
  value,
  title: TASK_PRIORITY_LABELS[value]
}));
