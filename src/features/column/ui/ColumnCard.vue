<script setup lang="ts">
import type { Column } from 'entities/column';

interface ColumnCardProps {
  column: Column;
}

interface ColumnCardEmits {
  edit: [column: Column];
  delete: [column: Column];
}

defineProps<ColumnCardProps>();
const emit = defineEmits<ColumnCardEmits>();
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
      <p class="text-body-medium text-medium-emphasis mb-0">No tasks yet</p>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.column-card {
  display: flex;
  flex-direction: column;
  width: 300px;
  min-width: 300px;
  max-height: calc(100vh - 200px);
}

.body {
  flex: 1;
  overflow-y: auto;
  min-height: 120px;
  padding-top: 0;
}
</style>
