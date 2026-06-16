<script setup lang="ts">
import { useRouter } from 'vue-router';

import { LoginForm } from 'widgets/auth';
import { ROUTES } from 'shared/constants/routes';

const router = useRouter();

const handleNavigateToRegister = (): void => {
  router.push({ path: ROUTES.register });
};
</script>

<template>
  <div class="login-page">
    <v-card class="card" elevation="8" rounded="xl">
      <v-card-text class="py-10 px-8">
        <div class="text-center mb-8">
          <h1 class="text-headline-large font-weight-bold">Login</h1>
          <p class="text-body-medium">Sign in to manage your boards</p>
        </div>

        <LoginForm />

        <div class="d-flex justify-center items-center mt-8">
          <p class="my-0 mt-1">Don't have an account?</p>
          <v-btn variant="text" size="small" color="primary" @click="handleNavigateToRegister">Register</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 24px 16px;
}

.card {
  width: 100%;
  max-width: 440px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
