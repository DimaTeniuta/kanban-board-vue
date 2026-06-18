<script setup lang="ts">
import { useRouter } from 'vue-router';

import type { Board } from 'entities/board';

interface BoardCardProps {
  board: Board;
}

interface BoardCardEmits {
  edit: [board: Board];
  delete: [board: Board];
}

const props = defineProps<BoardCardProps>();
const emit = defineEmits<BoardCardEmits>();

const router = useRouter();

const navigateToBoard = () => {
  router.push({ name: 'BoardPage', params: { boardId: props.board.id } });
};
</script>

<template>
  <v-card elevation="2" rounded="lg" @click="navigateToBoard">
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
      <v-btn density="comfortable" icon="mdi-pencil" @click.stop="emit('edit', board)" />
      <v-btn density="comfortable" icon="mdi-delete" color="error" @click.stop="emit('delete', board)" />
    </v-card-actions>
  </v-card>
</template>
