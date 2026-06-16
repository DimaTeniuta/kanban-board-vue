<script setup lang="ts">
import { HeaderBar } from 'widgets/header';
import { ProgressCircular } from 'shared/ui/progress-circular';
</script>

<template>
  <v-app>
    <div class="h-screen my-0 mx-auto max-w-screen-lg">
      <HeaderBar />

      <v-container max-width="1920px">
        <v-main class="h-screen">
          <RouterView v-slot="{ Component }">
            <template v-if="Component">
              <Suspense>
                <component :is="Component" />
                <template #fallback><ProgressCircular size="large" /></template>
              </Suspense>
            </template>
          </RouterView>
        </v-main>
      </v-container>
    </div>
  </v-app>
</template>
