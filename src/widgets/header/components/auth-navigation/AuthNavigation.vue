<script setup lang="ts">
import { useRouter } from 'vue-router';

import { ROUTES } from 'shared/constants/routes';

const router = useRouter();

const handleNavigateTo = (path: string) => {
  router.push({ path });
};
</script>

<template>
  <div class="d-flex ga-2 items-center">
    <v-btn variant="elevated" color="primary" @click="() => handleNavigateTo(ROUTES.login)">Login</v-btn>
    <v-btn variant="elevated" color="primary" @click="() => handleNavigateTo(ROUTES.register)">Register</v-btn>
  </div>
</template>
