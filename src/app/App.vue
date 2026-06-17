<script setup lang="ts">
import { HeaderBar } from 'widgets/header';
import { ProgressCircular } from 'shared/ui/progress-circular';
</script>

<template>
  <v-app>
    <HeaderBar />

    <v-container max-width="1920px">
      <v-main class="h-100">
        <RouterView v-slot="{ Component, route }">
          <template v-if="Component">
            <Suspense>
              <component :is="Component" :key="route.fullPath" />
              <template #fallback><ProgressCircular size="large" color="primary" /></template>
            </Suspense>
          </template>
        </RouterView>
      </v-main>
    </v-container>
  </v-app>
</template>
