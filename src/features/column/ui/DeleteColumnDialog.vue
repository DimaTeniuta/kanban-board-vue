<script setup lang="ts">
import { computed } from 'vue';
import { toast } from 'vue3-toastify';

import { type Column, useDeleteColumn } from 'entities/column';
import { getApiErrorMessage } from 'shared/utils/getApiErrorMessage';

interface DeleteColumnDialogProps {
  modelValue: boolean;
  boardId: string;
  column: Column;
}

interface DeleteColumnDialogEmits {
  'update:modelValue': [value: boolean];
  success: [];
}

const props = defineProps<DeleteColumnDialogProps>();
const emit = defineEmits<DeleteColumnDialogEmits>();

const { mutate: deleteColumn, isPending } = useDeleteColumn(props.boardId, props.column.id);

const columnTitle = computed(() => props.column.title);

const closeDialog = (): void => {
  emit('update:modelValue', false);
};

const handleDelete = (): void => {
  deleteColumn(props.column.id, {
    onSuccess: () => {
      toast.success('Column deleted successfully');
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
      <v-card-title class="text-headline-small font-weight-bold pa-6 pb-2">Delete column</v-card-title>

      <v-card-text class="px-6 pb-2 text-body-large">
        Are you sure you want to delete
        <strong>{{ columnTitle }}</strong>
        ? All tasks in this column will also be deleted. This action cannot be undone.
      </v-card-text>

      <v-card-actions class="px-6 pb-6 pt-2">
        <v-spacer />

        <v-btn variant="text" :disabled="isPending" @click="closeDialog">Cancel</v-btn>

        <v-btn color="error" variant="flat" :loading="isPending" @click="handleDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
