<script setup lang="ts">
import { useDnDProvider } from '@vue-dnd-kit/core';
import { computed, toRef } from 'vue';

import type { Column } from 'entities/column';
import type { Task } from 'entities/task';

import ColumnCard from './ColumnCard.vue';
import { useColumnDnD } from '../../composable/useColumnDnD.ts';

interface ColumnsListZoneProps {
  boardId: string;
  columns: Column[];
}

interface ColumnsListZoneEmits {
  edit: [column: Column];
  delete: [column: Column];
  'add-task': [column: Column];
  'edit-task': [payload: { column: Column; task: Task }];
  'delete-task': [payload: { column: Column; task: Task }];
}

const props = defineProps<ColumnsListZoneProps>();
const emit = defineEmits<ColumnsListZoneEmits>();

const { isZoneDragOver } = useColumnDnD(props.boardId, toRef(props, 'columns'));
const provider = useDnDProvider();

const showZoneInsertAfter = computed(
  () => Boolean(isZoneDragOver.value?.right) && provider.hovered.draggable.size === 0
);
</script>

<template>
  <div ref="zoneRef" class="position-relative d-flex flex-start ga-4 overflow-x-auto px-4">
    <ColumnCard
      v-for="(column, index) in columns"
      :key="column.id"
      :board-id="boardId"
      :column="column"
      :column-index="index"
      :columns="columns"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
      @add-task="emit('add-task', $event)"
      @edit-task="emit('edit-task', $event)"
      @delete-task="emit('delete-task', $event)"
    />

    <div v-if="showZoneInsertAfter" class="insert-line" aria-hidden="true"></div>
  </div>
</template>

<style scoped lang="scss">
.insert-line {
  flex-shrink: 0;
  align-self: stretch;
  width: 3px;
  margin-left: -9px;
  border-radius: 999px;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.25);
  pointer-events: none;
}
</style>
