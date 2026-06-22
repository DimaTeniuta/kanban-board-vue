<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';

import { updateProfileSchema, type UpdateProfileValues, type User, useUpdateProfile } from 'entities/user';
import { getApiErrorMessage } from 'shared/utils/getApiErrorMessage';

interface EditProfileDialogProps {
  modelValue: boolean;
  user: User;
}

interface EditProfileDialogEmits {
  'update:modelValue': [value: boolean];
  success: [user: User];
}

const props = defineProps<EditProfileDialogProps>();
const emit = defineEmits<EditProfileDialogEmits>();

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(updateProfileSchema),
  initialValues: {
    name: props.user.name
  }
});

const { value: name, errorMessage: nameErrorMessage } = useField<string>('name');
const { mutate: updateProfile, isPending } = useUpdateProfile();
const isUnchanged = computed(() => name.value === props.user.name);

const closeDialog = (): void => {
  emit('update:modelValue', false);
};

const onSubmit = handleSubmit((values: UpdateProfileValues) => {
  updateProfile(values, {
    onSuccess: (updatedUser) => {
      toast.success('Name updated successfully');
      closeDialog();
      emit('success', updatedUser);
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
      <v-card-title class="text-headline-small font-weight-bold pa-6 pb-2">Edit name</v-card-title>

      <v-card-text class="px-6 pb-2">
        <v-form class="d-flex flex-column ga-3" @submit.prevent="onSubmit">
          <v-text-field
            v-model="name"
            :error-messages="nameErrorMessage"
            color="primary"
            label="Name"
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

        <v-btn color="primary" variant="flat" :loading="isPending" :disabled="isUnchanged" @click="onSubmit">
          Save changes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
