<script setup lang="ts">
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
}

interface EmptyStateEmits {
  action: [];
}

defineProps<EmptyStateProps>();
defineEmits<EmptyStateEmits>();
</script>

<template>
  <div class="empty-state">
    <v-icon :icon="icon" size="72" color="primary" class="mb-4" />

    <h2 class="text-headline-small font-weight-bold mb-2">{{ title }}</h2>

    <p class="text-body-large text-medium-emphasis mb-6">{{ description }}</p>

    <v-btn color="primary" variant="flat" size="large" prepend-icon="mdi-plus" @click="$emit('action')">
      {{ actionLabel }}
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 360px;
  padding: 48px 24px;
  text-align: center;
  border: 1px dashed rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 16px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}
</style>
