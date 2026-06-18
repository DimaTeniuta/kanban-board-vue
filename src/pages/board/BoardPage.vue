<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ColumnCard, ColumnFormDialog, ColumnsEmptyState, DeleteColumnDialog } from 'features/column';
import type { Column } from 'entities/column';
import { ROUTES } from 'shared/constants/routes';
import { ProgressCircular } from 'shared/ui/progress-circular';

import { useGetBoard } from './composable/useGetBoard';
import { useGetColumns } from './composable/useGetColumns';

const route = useRoute();
const router = useRouter();

const boardId = computed(() => route.params.boardId as string);

const { board, isPending: isBoardPending } = useGetBoard(boardId.value);
const { columns, hasColumns, isPending: isColumnsPending } = useGetColumns(boardId.value);

const isLoading = computed(() => isBoardPending.value || isColumnsPending.value);

const isFormDialogOpen = ref(false);
const isDeleteDialogOpen = ref(false);
const selectedColumn = ref<Column | null>(null);

const openCreateDialog = (): void => {
  selectedColumn.value = null;
  isFormDialogOpen.value = true;
};

const openEditDialog = (column: Column): void => {
  selectedColumn.value = column;
  isFormDialogOpen.value = true;
};

const openDeleteDialog = (column: Column): void => {
  selectedColumn.value = column;
  isDeleteDialogOpen.value = true;
};

const navigateToBoards = (): void => {
  router.push(ROUTES.boards);
};
</script>

<template>
  <div class="py-8">
    <div class="d-flex justify-space-between align-center mb-8">
      <div class="d-flex align-center ga-4">
        <v-btn icon="mdi-arrow-left" variant="text" @click="navigateToBoards" />

        <div>
          <h1 class="text-headline-large font-weight-bold mb-1">
            {{ board?.title ?? 'Board' }}
          </h1>
          <p v-if="board?.description" class="text-body-large text-medium-emphasis mb-0">
            {{ board.description }}
          </p>
        </div>
      </div>

      <v-btn
        v-if="hasColumns"
        color="primary"
        variant="flat"
        size="large"
        prepend-icon="mdi-plus"
        @click="openCreateDialog"
      >
        Add column
      </v-btn>
    </div>

    <div v-if="isLoading" class="d-flex justify-center py-16">
      <ProgressCircular size="large" color="primary" />
    </div>

    <ColumnsEmptyState v-else-if="!hasColumns" @create="openCreateDialog" />

    <div v-else class="d-flex flex-start ga-4 overflow-x-auto pb-4">
      <ColumnCard
        v-for="column in columns"
        :key="column.id"
        :column="column"
        @edit="openEditDialog"
        @delete="openDeleteDialog"
      />
    </div>

    <ColumnFormDialog
      v-if="isFormDialogOpen"
      :key="selectedColumn?.id ?? 'create'"
      v-model="isFormDialogOpen"
      :board-id="boardId"
      :column="selectedColumn"
    />

    <DeleteColumnDialog
      v-if="selectedColumn"
      v-model="isDeleteDialogOpen"
      :board-id="boardId"
      :column="selectedColumn"
    />
  </div>
</template>
