<script setup lang="ts">
import { TaskCard } from 'features/task';
import type { Column } from 'entities/column';
import type { Task } from 'entities/task';
import { ProgressCircular } from 'shared/ui/progress-circular';

import { useGetTasks } from '../composable/useGetTasks';

interface ColumnCardProps {
  boardId: string;
  column: Column;
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

const { tasks, isPending } = useGetTasks(props.boardId, props.column.id);
</script>

<template>
  <v-card class="column-card" elevation="1" rounded="lg">
    <v-card-item class="pb-2">
      <div class="d-flex align-center justify-space-between">
        <v-card-title class="text-title-medium font-weight-bold pa-0">
          {{ column.title }}
        </v-card-title>

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
    </v-card-item>

    <v-card-text class="body">
      <div v-if="isPending" class="d-flex justify-center py-4">
        <ProgressCircular size="small" color="primary" />
      </div>

      <div v-else class="d-flex flex-column ga-2">
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @edit="emit('edit-task', { column, task: $event })"
          @delete="emit('delete-task', { column, task: $event })"
        />

        <p v-if="!tasks.length" class="text-body-medium text-medium-emphasis mb-0">No tasks yet</p>
      </div>
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
</template>

<style scoped lang="scss">
.column-card {
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 300px;
  max-height: 600px;
}

.body {
  flex: 1;
  overflow-y: auto;
  min-height: 120px;
  padding-top: 0;
}
</style>
