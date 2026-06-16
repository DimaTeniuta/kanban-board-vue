<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';

import { type RegisterSchema, registerSchema } from './schema';

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(registerSchema)
});
const { value: name, errorMessage: nameErrorMessage } = useField('name');
const { value: email, errorMessage: emailErrorMessage } = useField('email');
const { value: password, errorMessage: passwordErrorMessage } = useField('password');
const { value: passwordRepeat, errorMessage: passwordRepeatErrorMessage } = useField('passwordRepeat');

const showPassword = ref<boolean>(false);
const showPasswordRepeat = ref<boolean>(false);

const onSubmit = handleSubmit((values: RegisterSchema) => {
  console.log(2222, values);
});
</script>

<template>
  <v-form class="d-flex flex-column ga-3" @submit.prevent="onSubmit">
    <v-text-field
      v-model="name"
      :error-messages="nameErrorMessage"
      color="primary"
      label="Name"
      type="text"
      variant="outlined"
      density="comfortable"
      hide-details="auto"
    />

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

    <v-text-field
      v-model="passwordRepeat"
      color="primary"
      :append-inner-icon="showPasswordRepeat ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPasswordRepeat ? 'text' : 'password'"
      :error-messages="passwordRepeatErrorMessage"
      label="Confirm password"
      variant="outlined"
      density="comfortable"
      hide-details="auto"
      @click:append-inner="showPasswordRepeat = !showPasswordRepeat"
    />

    <v-btn class="mt-6" type="submit" variant="flat" color="primary" size="large" block> Register </v-btn>
  </v-form>
</template>
