<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';

import { type LoginSchema, loginSchema } from './schema';

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema)
});
const { value: email, errorMessage: emailErrorMessage } = useField('email');
const { value: password, errorMessage: passwordErrorMessage } = useField('password');

const showPassword = ref<boolean>(false);

const onSubmit = handleSubmit((values: LoginSchema) => {
  console.log(2222, values);
});
</script>

<template>
  <v-form class="d-flex flex-column ga-3" @submit.prevent="onSubmit">
    <v-text-field
      v-model="email"
      :error-messages="emailErrorMessage"
      color="primary"
      label="Email"
      type="email"
      variant="outlined"
      density="comfortable"
      hide-details="auto"
    />

    <v-text-field
      v-model="password"
      color="primary"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      :error-messages="passwordErrorMessage"
      label="Password"
      variant="outlined"
      density="comfortable"
      hide-details="auto"
      @click:append-inner="showPassword = !showPassword"
    />

    <v-btn class="mt-6" type="submit" variant="flat" color="primary" size="large" block> Login </v-btn>
  </v-form>
</template>
