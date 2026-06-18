<script setup lang="ts">
import { useDnDProvider } from '@vue-dnd-kit/core';
import { computed } from 'vue';

import type { Task } from 'entities/task';
import { ProgressCircular } from 'shared/ui/progress-circular';

import SortableTaskCard from './SortableTaskCard.vue';
import { useGetTasks } from '../../composable/useGetTasks';
import { useTaskDnD } from '../../composable/useTaskDnD';

interface TasksListZoneProps {
  boardId: string;
  columnId: string;
}

interface TasksListZoneEmits {
  'edit-task': [task: Task];
  'delete-task': [task: Task];
}

const props = defineProps<TasksListZoneProps>();
const emit = defineEmits<TasksListZoneEmits>();

const { tasks, isPending } = useGetTasks(props.boardId, props.columnId);
const { isZoneDragOver } = useTaskDnD(props.boardId, props.columnId, tasks);
const provider = useDnDProvider();

const showZoneInsertAfter = computed(
  () => Boolean(isZoneDragOver.value?.bottom) && provider.hovered.draggable.size === 0
);
</script>

<template>
  <div ref="zoneRef" class="tasks-list-zone d-flex flex-column ga-2 pa-2">
    <div v-if="isPending" class="d-flex justify-center py-4">
      <ProgressCircular size="small" color="primary" />
    </div>

    <template v-else>
      <SortableTaskCard
        v-for="(task, index) in tasks"
        :key="task.id"
        :column-id="columnId"
        :task="task"
        :task-index="index"
        :tasks="tasks"
        @edit="emit('edit-task', $event)"
        @delete="emit('delete-task', $event)"
      />

      <p v-if="!tasks.length && !showZoneInsertAfter" class="text-body-medium text-medium-emphasis mb-0">
        No tasks yet
      </p>

      <div v-if="showZoneInsertAfter" class="insert-line" aria-hidden="true"></div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.tasks-list-zone {
  position: relative;
  min-height: 48px;
}

.insert-line {
  height: 3px;
  border-radius: 999px;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 0 0 1px rgba(var(--v-theme-primary), 0.25);
  pointer-events: none;
}
</style>
