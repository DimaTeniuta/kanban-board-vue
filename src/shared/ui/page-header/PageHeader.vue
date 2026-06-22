<script setup lang="ts">
defineProps<{
  title: string;
  description?: string | null;
}>();
</script>

<template>
  <div class="d-flex justify-space-between align-center mb-8">
    <div class="d-flex align-center ga-4">
      <slot name="back"></slot>

      <div>
        <h1 class="text-headline-large font-weight-bold mb-1">
          {{ title }}
        </h1>
        <p v-if="description" class="text-body-large text-medium-emphasis mb-0">
          {{ description }}
        </p>
      </div>
    </div>

    <slot name="actions"></slot>
  </div>
</template>
