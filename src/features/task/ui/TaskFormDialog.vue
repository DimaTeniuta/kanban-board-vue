<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';

import {
  type Task,
  TASK_PRIORITY_OPTIONS,
  taskFormSchema,
  type TaskFormValues,
  useCreateTask,
  useUpdateTask
} from 'entities/task';
import { getApiErrorMessage } from 'shared/utils/getApiErrorMessage';

interface TaskFormDialogProps {
  modelValue: boolean;
  boardId: string;
  columnId: string;
  task?: Task | null;
}

interface TaskFormDialogEmits {
  'update:modelValue': [value: boolean];
  success: [];
}

const props = withDefaults(defineProps<TaskFormDialogProps>(), {
  task: null
});

const emit = defineEmits<TaskFormDialogEmits>();

const isEditMode = computed(() => Boolean(props.task));
const dialogTitle = computed(() => (isEditMode.value ? 'Edit task' : 'Create task'));
const submitLabel = computed(() => (isEditMode.value ? 'Save changes' : 'Create task'));

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(taskFormSchema),
  initialValues: {
    title: props.task?.title ?? '',
    description: props.task?.description ?? '',
    priority: props.task?.priority ?? 'MEDIUM'
  }
});

const { value: title, errorMessage: titleErrorMessage } = useField<string>('title');
const { value: description, errorMessage: descriptionErrorMessage } = useField<string>('description');
const { value: priority, errorMessage: priorityErrorMessage } = useField<TaskFormValues['priority']>('priority');

const { mutate: createTask, isPending: isCreating } = useCreateTask(props.boardId, props.columnId);
const { mutate: updateTask, isPending: isUpdating } = useUpdateTask(
  props.boardId,
  props.columnId,
  props.task?.id ?? ''
);

const isPending = computed(() => isCreating.value || isUpdating.value);

const closeDialog = (): void => {
  emit('update:modelValue', false);
};

const onSubmit = handleSubmit((values: TaskFormValues) => {
  const payload: TaskFormValues = {
    title: values.title,
    description: values.description || '',
    priority: values.priority
  };

  if (props.task) {
    updateTask(payload, {
      onSuccess: () => {
        toast.success('Task updated successfully');
        closeDialog();
        emit('success');
      },
      onError: (error) => {
        toast.error(getApiErrorMessage(error));
      }
    });

    return;
  }

  createTask(payload, {
    onSuccess: () => {
      toast.success('Task created successfully');
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

          <v-select
            v-model="priority"
            :error-messages="priorityErrorMessage"
            :items="TASK_PRIORITY_OPTIONS"
            item-title="title"
            item-value="value"
            color="primary"
            label="Priority"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
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
