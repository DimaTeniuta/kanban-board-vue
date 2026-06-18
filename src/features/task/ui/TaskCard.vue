<script setup lang="ts">
import { type Task, TASK_PRIORITY_COLORS, TASK_PRIORITY_LABELS } from 'entities/task';

interface TaskCardProps {
  task: Task;
}

interface TaskCardEmits {
  edit: [task: Task];
  delete: [task: Task];
}

defineProps<TaskCardProps>();
const emit = defineEmits<TaskCardEmits>();
</script>

<template>
  <v-card class="task-card" variant="outlined" rounded="lg">
    <v-card-item class="pb-2">
      <div class="d-flex align-start justify-space-between ga-2">
        <div class="flex-grow-1 min-width-0">
          <p class="text-body-large font-weight-medium mb-1 text-truncate">
            {{ task.title }}
          </p>

          <p v-if="task.description" class="text-body-small text-medium-emphasis mb-2 text-truncate-2">
            {{ task.description }}
          </p>

          <v-chip :color="TASK_PRIORITY_COLORS[task.priority]" size="x-small" variant="tonal" label>
            {{ TASK_PRIORITY_LABELS[task.priority] }}
          </v-chip>
        </div>

        <div class="d-flex ga-1">
          <v-btn density="comfortable" icon="mdi-pencil" variant="text" size="x-small" @click="emit('edit', task)" />
          <v-btn
            density="comfortable"
            icon="mdi-delete"
            color="error"
            variant="text"
            size="x-small"
            @click="emit('delete', task)"
          />
        </div>
      </div>
    </v-card-item>
  </v-card>
</template>

<style scoped lang="scss">
.task-card {
  transition: box-shadow 0.2s ease;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.min-width-0 {
  min-width: 0;
}
</style>
