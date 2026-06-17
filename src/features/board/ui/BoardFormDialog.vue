<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';

import { type Board, boardFormSchema, type BoardFormValues, useCreateBoard, useUpdateBoard } from 'entities/board';
import { getApiErrorMessage } from 'shared/utils/getApiErrorMessage';

interface BoardFormDialogProps {
  modelValue: boolean;
  board?: Board | null;
}

interface BoardFormDialogEmits {
  'update:modelValue': [value: boolean];
  success: [];
}

const props = withDefaults(defineProps<BoardFormDialogProps>(), {
  board: null
});

const emit = defineEmits<BoardFormDialogEmits>();

const isEditMode = computed(() => Boolean(props.board));
const dialogTitle = computed(() => (isEditMode.value ? 'Edit board' : 'Create board'));
const submitLabel = computed(() => (isEditMode.value ? 'Save changes' : 'Create board'));

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(boardFormSchema),
  initialValues: {
    title: props.board?.title ?? '',
    description: props.board?.description ?? ''
  }
});

const { value: title, errorMessage: titleErrorMessage } = useField<string>('title');
const { value: description, errorMessage: descriptionErrorMessage } = useField<string>('description');

const { mutate: createBoard, isPending: isCreating } = useCreateBoard();
const { mutate: updateBoard, isPending: isUpdating } = useUpdateBoard(props.board?.id ?? '');

const isPending = computed(() => isCreating.value || isUpdating.value);

const closeDialog = (): void => {
  emit('update:modelValue', false);
};

const onSubmit = handleSubmit((values: BoardFormValues) => {
  if (props.board) {
    updateBoard(values, {
      onSuccess: () => {
        toast.success('Board updated successfully');
        closeDialog();
        emit('success');
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error));
      }
    });

    return;
  }

  createBoard(values, {
    onSuccess: () => {
      toast.success('Board created successfully');
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
  <v-dialog :model-value="modelValue" max-width="480" @update:model-value="emit('update:modelValue', $event)">
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

          <v-textarea
            v-model="description"
            :error-messages="descriptionErrorMessage"
            color="primary"
            label="Description"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            rows="3"
            auto-grow
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
