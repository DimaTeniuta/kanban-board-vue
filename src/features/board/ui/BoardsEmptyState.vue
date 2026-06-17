<script setup lang="ts">
interface BoardsEmptyStateEmits {
  create: [];
}

defineEmits<BoardsEmptyStateEmits>();
</script>

<template>
  <div class="boards-empty-state">
    <v-icon icon="mdi-view-dashboard-outline" size="72" color="primary" class="mb-4" />

    <h2 class="text-headline-small font-weight-bold mb-2">No boards yet</h2>

    <p class="text-body-large text-medium-emphasis mb-6">
      Create your first board to start organizing tasks in columns.
    </p>

    <v-btn color="primary" variant="flat" size="large" prepend-icon="mdi-plus" @click="$emit('create')">
      Create board
    </v-btn>
  </div>
</template>

<style scoped lang="scss">
.boards-empty-state {
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
