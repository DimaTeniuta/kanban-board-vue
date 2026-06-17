<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import { API_ROUTES } from 'shared/api/apiRoutes.ts';
import { useApiMutation } from 'shared/api/index.ts';
import { ROUTES } from 'shared/constants/routes';
import { useAuthStore } from 'shared/store/authStore.ts';

import AuthNavigation from './components/auth-navigation/AuthNavigation.vue';

const { isAuthenticated } = storeToRefs(useAuthStore());
const { clearStore } = useAuthStore();
const router = useRouter();

const { mutate: logout, isPending } = useApiMutation(API_ROUTES.logout(), 'post');

const handleNavigateToProfile = () => {
  router.push({ path: ROUTES.profile });
};

const handleLogout = () => {
  logout(
    {},
    {
      onSettled: () => {
        clearStore();
        router.push({ path: ROUTES.login });
      }
    }
  );
};
</script>

<template>
  <v-app-bar>
    <v-container max-width="1920px">
      <div class="d-flex justify-space-between align-center">
        <v-app-bar-title class="text-primary">Kanban Board</v-app-bar-title>

        <div v-if="isAuthenticated" class="d-flex ga-2 items-center">
          <v-avatar tag="button" title="Profile" color="primary" size="small" @click="handleNavigateToProfile">
            <v-icon icon="mdi-account-circle" />
          </v-avatar>

          <v-btn
            title="Logout"
            density="comfortable"
            icon="mdi-logout"
            :loading="isPending"
            color="error"
            @click="handleLogout"
          />
        </div>

        <AuthNavigation v-else />
      </div>
    </v-container>
  </v-app-bar>
</template>
