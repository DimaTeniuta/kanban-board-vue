<script setup lang="ts">
import { ref } from 'vue';

import { BoardCard, BoardFormDialog, BoardsEmptyState, DeleteBoardDialog } from 'features/board';
import type { Board } from 'entities/board';
import { PageHeader } from 'shared/ui/page-header';
import { ProgressCircular } from 'shared/ui/progress-circular';

import { useGetBoards } from './composable/useGetBoards';

const { boards, hasBoards, isPending } = useGetBoards();

const isFormDialogOpen = ref<boolean>(false);
const isDeleteDialogOpen = ref<boolean>(false);
const selectedBoard = ref<Board | null>(null);

const openCreateDialog = (): void => {
  selectedBoard.value = null;
  isFormDialogOpen.value = true;
};

const openEditDialog = (board: Board): void => {
  selectedBoard.value = board;
  isFormDialogOpen.value = true;
};

const openDeleteDialog = (board: Board): void => {
  selectedBoard.value = board;
  isDeleteDialogOpen.value = true;
};
</script>

<template>
  <div class="py-8">
    <PageHeader title="My boards" description="Manage your kanban boards">
      <template #actions>
        <v-btn
          v-if="hasBoards"
          color="primary"
          variant="flat"
          size="large"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Create board
        </v-btn>
      </template>
    </PageHeader>

    <v-row v-if="isPending" class="h-100">
      <v-col cols="12">
        <ProgressCircular size="large" color="primary" />
      </v-col>
    </v-row>

    <BoardsEmptyState v-else-if="!hasBoards" @create="openCreateDialog" />

    <v-row v-else class="mt-0">
      <v-col v-for="board in boards" :key="board.id" cols="12" sm="6" md="4" lg="3">
        <BoardCard :board="board" @edit="openEditDialog" @delete="openDeleteDialog" />
      </v-col>
    </v-row>

    <BoardFormDialog
      v-if="isFormDialogOpen"
      :key="selectedBoard?.id ?? 'create'"
      v-model="isFormDialogOpen"
      :board="selectedBoard"
    />

    <DeleteBoardDialog v-if="selectedBoard" v-model="isDeleteDialogOpen" :board="selectedBoard" />
  </div>
</template>
