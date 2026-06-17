<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

import { useApiMutation } from 'shared/api';
import { API_ROUTES } from 'shared/api/apiRoutes';
import { ROUTES } from 'shared/constants/routes';
import { useAuthStore, useUserStore } from 'shared/store';
import { getApiErrorMessage } from 'shared/utils/getApiErrorMessage';

import { type LoginResult, type LoginSchema, loginSchema } from './types';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(loginSchema)
});
const { value: email, errorMessage: emailErrorMessage } = useField('email');
const { value: password, errorMessage: passwordErrorMessage } = useField('password');

const showPassword = ref<boolean>(false);

const { mutate: login, isPending } = useApiMutation<LoginResult, LoginSchema>(API_ROUTES.login(), 'post');

const onSubmit = handleSubmit((values: LoginSchema) => {
  login(values, {
    onSuccess: (data) => {
      userStore.setUser(data.user);
      authStore.setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
      router.push({ path: ROUTES.boards });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    }
  });
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

    <v-btn class="mt-6" type="submit" variant="flat" color="primary" size="large" :loading="isPending" block>
      Login
    </v-btn>
  </v-form>
</template>
