<script setup lang="ts">
import { makeDraggable } from '@vue-dnd-kit/core';
import { computed, useTemplateRef } from 'vue';

import type { Column } from 'entities/column';
import type { Task } from 'entities/task';

import { COLUMN_DND_GROUP, COLUMN_DRAG_HANDLE } from '../../constants/dnd';
import TasksList from '../task/TasksList.vue';

interface ColumnCardProps {
  boardId: string;
  column: Column;
  columnIndex: number;
  columns: Column[];
}

interface ColumnCardEmits {
  edit: [column: Column];
  delete: [column: Column];
  'add-task': [column: Column];
  'edit-task': [payload: { column: Column; task: Task }];
  'delete-task': [payload: { column: Column; task: Task }];
}

const props = defineProps<ColumnCardProps>();
const emit = defineEmits<ColumnCardEmits>();

const columnHeaderRef = useTemplateRef<HTMLElement>('columnHeaderRef');

const { isDragging, isDragOver } = makeDraggable(
  columnHeaderRef,
  {
    id: props.column.id,
    groups: [COLUMN_DND_GROUP],
    dragHandle: COLUMN_DRAG_HANDLE
  },
  () => [props.columnIndex, props.columns]
);

const showInsertBefore = computed(() => Boolean(isDragOver.value?.left) && !isDragging.value);
const showInsertAfter = computed(() => Boolean(isDragOver.value?.right) && !isDragging.value);
</script>

<template>
  <div class="column-card-wrapper" :class="{ 'column-card-wrapper--dragging': isDragging }">
    <div
      v-if="showInsertBefore"
      class="column-card-wrapper__insert-line column-card-wrapper__insert-line--before"
      aria-hidden="true"
    ></div>

    <v-card class="column-card" elevation="1" rounded="lg">
      <div ref="columnHeaderRef" class="column-card__header pb-2">
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center ga-1">
            <div
              class="column-card__drag-handle d-flex align-center justify-center"
              aria-label="Drag column"
              role="button"
              tabindex="0"
            >
              <v-icon icon="mdi-drag" size="small" />
            </div>

            <v-card-title class="text-title-medium font-weight-bold pa-0">
              {{ column.title }}
            </v-card-title>
          </div>

          <div class="d-flex ga-1">
            <v-btn density="comfortable" icon="mdi-pencil" variant="text" size="small" @click="emit('edit', column)" />
            <v-btn
              density="comfortable"
              icon="mdi-delete"
              color="error"
              variant="text"
              size="small"
              @click="emit('delete', column)"
            />
          </div>
        </div>
      </div>

      <v-card-text class="body">
        <TasksList
          :board-id="boardId"
          :column-id="column.id"
          @edit-task="emit('edit-task', { column, task: $event })"
          @delete-task="emit('delete-task', { column, task: $event })"
        />
      </v-card-text>

      <v-card-actions class="px-3 pb-3 pt-0">
        <v-btn
          block
          variant="tonal"
          color="primary"
          prepend-icon="mdi-plus"
          size="small"
          @click="emit('add-task', column)"
        >
          Add task
        </v-btn>
      </v-card-actions>
    </v-card>

    <div
      v-if="showInsertAfter"
      class="column-card-wrapper__insert-line column-card-wrapper__insert-line--after"
      aria-hidden="true"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.column-card-wrapper {
  position: relative;
  flex-shrink: 0;

  &--dragging {
    opacity: 0.4;
  }

  &__insert-line {
    position: absolute;
    top: 12px;
    bottom: 12px;
    width: 3px;
    border-radius: 999px;
    background: rgb(var(--v-theme-primary));
    box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.25);
    z-index: 2;
    pointer-events: none;

    &--before {
      left: -9px;
    }

    &--after {
      right: -9px;
    }
  }
}

.column-card {
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 300px;
  max-height: 600px;
}

.column-card__header {
  padding: 16px 16px 8px;
}

.column-card__drag-handle {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 4px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  cursor: grab;
  user-select: none;
  touch-action: none;

  &:hover {
    background: rgba(var(--v-theme-on-surface), 0.08);
  }

  &:active {
    cursor: grabbing;
  }
}

.body {
  flex: 1;
  overflow-y: auto;
  min-height: 120px;
  padding-top: 0;
}
</style>
