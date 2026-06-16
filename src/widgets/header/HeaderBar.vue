<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { ROUTES } from 'shared/constants/routes';

import AuthNavigation from './components/auth-navigation/AuthNavigation.vue';

// TODO: fix it
const isAuthenticated = computed(() => {
  return false;
});

const router = useRouter();

const handleNavigateToProfile = () => {
  router.push({ path: ROUTES.profile });
};

// TODO: implement logout
const handleLogout = () => {
  console.log('logout');
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

          <v-btn title="Logout" density="comfortable" icon="mdi-logout" color="error" @click="handleLogout" />
        </div>

        <AuthNavigation v-else />
      </div>
    </v-container>
  </v-app-bar>
</template>
