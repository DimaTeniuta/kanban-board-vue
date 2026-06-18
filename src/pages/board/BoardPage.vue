<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { ColumnCard, ColumnFormDialog, ColumnsEmptyState, DeleteColumnDialog } from 'features/column';
import { DeleteTaskDialog, TaskFormDialog } from 'features/task';
import type { Column } from 'entities/column';
import type { Task } from 'entities/task';
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

const isColumnFormDialogOpen = ref(false);
const isColumnDeleteDialogOpen = ref(false);
const selectedColumn = ref<Column | null>(null);

const isTaskFormDialogOpen = ref(false);
const isTaskDeleteDialogOpen = ref(false);
const selectedTask = ref<Task | null>(null);
const selectedTaskColumn = ref<Column | null>(null);

const openCreateColumnDialog = (): void => {
  selectedColumn.value = null;
  isColumnFormDialogOpen.value = true;
};

const openEditColumnDialog = (column: Column): void => {
  selectedColumn.value = column;
  isColumnFormDialogOpen.value = true;
};

const openDeleteColumnDialog = (column: Column): void => {
  selectedColumn.value = column;
  isColumnDeleteDialogOpen.value = true;
};

const openCreateTaskDialog = (column: Column): void => {
  selectedTask.value = null;
  selectedTaskColumn.value = column;
  isTaskFormDialogOpen.value = true;
};

const openEditTaskDialog = ({ column, task }: { column: Column; task: Task }): void => {
  selectedTask.value = task;
  selectedTaskColumn.value = column;
  isTaskFormDialogOpen.value = true;
};

const openDeleteTaskDialog = ({ column, task }: { column: Column; task: Task }): void => {
  selectedTask.value = task;
  selectedTaskColumn.value = column;
  isTaskDeleteDialogOpen.value = true;
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
        @click="openCreateColumnDialog"
      >
        Add column
      </v-btn>
    </div>

    <div v-if="isLoading" class="d-flex justify-center py-16">
      <ProgressCircular size="large" color="primary" />
    </div>

    <ColumnsEmptyState v-else-if="!hasColumns" @create="openCreateColumnDialog" />

    <div v-else class="d-flex flex-start ga-4 overflow-x-auto pb-4">
      <ColumnCard
        v-for="column in columns"
        :key="column.id"
        :board-id="boardId"
        :column="column"
        @edit="openEditColumnDialog"
        @delete="openDeleteColumnDialog"
        @add-task="openCreateTaskDialog"
        @edit-task="openEditTaskDialog"
        @delete-task="openDeleteTaskDialog"
      />
    </div>

    <ColumnFormDialog
      v-if="isColumnFormDialogOpen"
      :key="selectedColumn?.id ?? 'create-column'"
      v-model="isColumnFormDialogOpen"
      :board-id="boardId"
      :column="selectedColumn"
    />

    <DeleteColumnDialog
      v-if="selectedColumn"
      v-model="isColumnDeleteDialogOpen"
      :board-id="boardId"
      :column="selectedColumn"
    />

    <TaskFormDialog
      v-if="isTaskFormDialogOpen && selectedTaskColumn"
      :key="selectedTask?.id ?? `create-task-${selectedTaskColumn.id}`"
      v-model="isTaskFormDialogOpen"
      :board-id="boardId"
      :column-id="selectedTaskColumn.id"
      :task="selectedTask"
    />

    <DeleteTaskDialog
      v-if="selectedTask && selectedTaskColumn"
      v-model="isTaskDeleteDialogOpen"
      :board-id="boardId"
      :column-id="selectedTaskColumn.id"
      :task="selectedTask"
    />
  </div>
</template>
