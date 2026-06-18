<script setup lang="ts">
interface ColumnsEmptyStateEmits {
  create: [];
}

defineEmits<ColumnsEmptyStateEmits>();
</script>

<template>
  <div class="columns-empty-state">
    <v-icon icon="mdi-view-column-outline" size="72" color="primary" class="mb-4" />

    <h2 class="text-headline-small font-weight-bold mb-2">No columns yet</h2>

    <p class="text-body-large text-medium-emphasis mb-6">Create your first column to start organizing tasks.</p>

    <v-btn color="primary" variant="flat" size="large" prepend-icon="mdi-plus" @click="$emit('create')">
      Create column
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.columns-empty-state {
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
