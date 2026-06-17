<script setup lang="ts">
import type { Board } from 'entities/board';

interface BoardCardProps {
  board: Board;
}

interface BoardCardEmits {
  edit: [board: Board];
  delete: [board: Board];
}

defineProps<BoardCardProps>();
const emit = defineEmits<BoardCardEmits>();
</script>

<template>
  <v-card elevation="2" rounded="lg">
    <v-card-item>
      <v-card-title class="text-title-large font-weight-bold">
        {{ board.title }}
      </v-card-title>

      <v-card-subtitle v-if="board.description" class="text-body-medium mt-2">
        {{ board.description }}
      </v-card-subtitle>

      <p v-else class="text-body-medium text-medium-emphasis mt-2 mb-0">No description</p>
    </v-card-item>

    <v-card-actions class="d-flex justify-end gap-2 px-4 pb-4">
      <v-btn density="comfortable" icon="mdi-pencil" @click="emit('edit', board)" />
      <v-btn density="comfortable" icon="mdi-delete" color="error" @click="emit('delete', board)" />
    </v-card-actions>
  </v-card>
</template>
