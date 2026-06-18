<script setup lang="ts">
import { makeDraggable } from '@vue-dnd-kit/core';
import { computed, toRef, useTemplateRef } from 'vue';

import type { Task } from 'entities/task';

import TaskCard from './TaskCard.vue';
import { TASK_DND_GROUP, TASK_DRAG_HANDLE } from '../../constants/dnd.ts';
import type { TaskDragData } from '../../types/dnd.ts';

interface SortableTaskCardProps {
  columnId: string;
  task: Task;
  taskIndex: number;
  tasks: Task[];
}

interface SortableTaskCardEmits {
  edit: [task: Task];
  delete: [task: Task];
}

const props = defineProps<SortableTaskCardProps>();
const emit = defineEmits<SortableTaskCardEmits>();

const tasksRef = toRef(props, 'tasks');
const taskRef = useTemplateRef<HTMLElement>('taskRef');

const { isDragging, isDragOver } = makeDraggable(
  taskRef,
  {
    id: props.task.id,
    groups: [TASK_DND_GROUP],
    dragHandle: TASK_DRAG_HANDLE,
    data: (): TaskDragData => ({ columnId: props.columnId })
  },
  () => [props.taskIndex, tasksRef.value]
);

const showInsertBefore = computed(() => Boolean(isDragOver.value?.top) && !isDragging.value);
const showInsertAfter = computed(() => Boolean(isDragOver.value?.bottom) && !isDragging.value);
</script>

<template>
  <div ref="taskRef" class="sortable-task-card" :class="{ 'sortable-task-card--dragging': isDragging }">
    <div
      v-if="showInsertBefore"
      class="sortable-task-card__insert-line sortable-task-card__insert-line--before"
      aria-hidden="true"
    ></div>

    <div class="sortable-task-card__row d-flex ga-1">
      <div
        class="sortable-task-card__drag-handle d-flex align-center justify-center"
        aria-label="Drag task"
        role="button"
        tabindex="0"
      >
        <v-icon icon="mdi-drag" size="x-small" />
      </div>

      <TaskCard
        class="sortable-task-card__card flex-grow-1 min-width-0"
        :task="task"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </div>

    <div
      v-if="showInsertAfter"
      class="sortable-task-card__insert-line sortable-task-card__insert-line--after"
      aria-hidden="true"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.sortable-task-card {
  position: relative;

  &--dragging {
    opacity: 0.4;
  }

  &__insert-line {
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: 999px;
    background: rgb(var(--v-theme-primary));
    box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.25);
    z-index: 2;
    pointer-events: none;

    &--before {
      top: -6px;
    }

    &--after {
      bottom: -6px;
    }
  }

  &__drag-handle {
    width: 20px;
    min-height: 32px;
    flex-shrink: 0;
    border-radius: 4px;
    color: rgba(var(--v-theme-on-surface), 0.5);
    cursor: grab;
    user-select: none;
    touch-action: none;
    align-self: stretch;

    &:hover {
      background: rgba(var(--v-theme-on-surface), 0.08);
    }

    &:active {
      cursor: grabbing;
    }
  }
}

.min-width-0 {
  min-width: 0;
}
</style>
