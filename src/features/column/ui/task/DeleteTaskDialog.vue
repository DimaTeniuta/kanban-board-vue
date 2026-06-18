<script setup lang="ts">
import { computed } from 'vue';
import { toast } from 'vue3-toastify';

import { type Task, useDeleteTask } from 'entities/task';
import { getApiErrorMessage } from 'shared/utils/getApiErrorMessage';

interface DeleteTaskDialogProps {
  modelValue: boolean;
  boardId: string;
  columnId: string;
  task: Task;
}

interface DeleteTaskDialogEmits {
  'update:modelValue': [value: boolean];
  success: [];
}

const props = defineProps<DeleteTaskDialogProps>();
const emit = defineEmits<DeleteTaskDialogEmits>();

const { mutate: deleteTask, isPending } = useDeleteTask(props.boardId, props.columnId, props.task.id);

const taskTitle = computed(() => props.task.title);

const closeDialog = (): void => {
  emit('update:modelValue', false);
};

const handleDelete = (): void => {
  deleteTask(props.task.id, {
    onSuccess: () => {
      toast.success('Task deleted successfully');
      closeDialog();
      emit('success');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
};
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="440" @update:model-value="emit('update:modelValue', $event)">
    <v-card rounded="xl">
      <v-card-title class="text-headline-small font-weight-bold pa-6 pb-2">Delete task</v-card-title>

      <v-card-text class="px-6 pb-2 text-body-large">
        Are you sure you want to delete
        <strong>{{ taskTitle }}</strong>
        ? This action cannot be undone.
      </v-card-text>

      <v-card-actions class="px-6 pb-6 pt-2">
        <v-spacer />

        <v-btn variant="text" :disabled="isPending" @click="closeDialog">Cancel</v-btn>

        <v-btn color="error" variant="flat" :loading="isPending" @click="handleDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
