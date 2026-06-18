<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';

import {
  type Column,
  columnFormSchema,
  type ColumnFormValues,
  useCreateColumn,
  useUpdateColumn
} from 'entities/column';
import { getApiErrorMessage } from 'shared/utils/getApiErrorMessage';

interface ColumnFormDialogProps {
  modelValue: boolean;
  boardId: string;
  column?: Column | null;
}

interface ColumnFormDialogEmits {
  'update:modelValue': [value: boolean];
  success: [];
}

const props = withDefaults(defineProps<ColumnFormDialogProps>(), {
  column: null
});

const emit = defineEmits<ColumnFormDialogEmits>();

const isEditMode = computed(() => Boolean(props.column));
const dialogTitle = computed(() => (isEditMode.value ? 'Edit column' : 'Create column'));
const submitLabel = computed(() => (isEditMode.value ? 'Save changes' : 'Create column'));

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(columnFormSchema),
  initialValues: {
    title: props.column?.title ?? ''
  }
});

const { value: title, errorMessage: titleErrorMessage } = useField<string>('title');

const { mutate: createColumn, isPending: isCreating } = useCreateColumn(props.boardId);
const { mutate: updateColumn, isPending: isUpdating } = useUpdateColumn(props.boardId, props.column?.id ?? '');

const isPending = computed(() => isCreating.value || isUpdating.value);

const closeDialog = (): void => {
  emit('update:modelValue', false);
};

const onSubmit = handleSubmit((values: ColumnFormValues) => {
  if (props.column) {
    updateColumn(values, {
      onSuccess: () => {
        toast.success('Column updated successfully');
        closeDialog();
        emit('success');
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error));
      }
    });

    return;
  }

  createColumn(values, {
    onSuccess: () => {
      toast.success('Column created successfully');
      closeDialog();
      emit('success');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
});
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="440" @update:model-value="emit('update:modelValue', $event)">
    <v-card rounded="xl">
      <v-card-title class="text-headline-small font-weight-bold pa-6 pb-2">
        {{ dialogTitle }}
      </v-card-title>

      <v-card-text class="px-6 pb-2">
        <v-form class="d-flex flex-column ga-3" @submit.prevent="onSubmit">
          <v-text-field
            v-model="title"
            :error-messages="titleErrorMessage"
            color="primary"
            label="Title"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            autofocus
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6 pt-2">
        <v-spacer />

        <v-btn variant="text" :disabled="isPending" @click="closeDialog">Cancel</v-btn>

        <v-btn color="primary" variant="flat" :loading="isPending" @click="onSubmit">
          {{ submitLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
