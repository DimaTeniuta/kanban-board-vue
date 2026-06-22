<script setup lang="ts">
import { computed } from 'vue';

import type { SpinnerColor, SpinnerSize } from './types';

const SIZE_MAP = {
  small: 32,
  medium: 48,
  large: 64
} as const;

const props = withDefaults(
  defineProps<{
    size?: SpinnerSize;
    color?: SpinnerColor;
    width?: number;
  }>(),
  {
    width: 6,
    size: 'medium',
    color: undefined
  }
);

const sizeValue = computed(() => {
  return SIZE_MAP[props.size];
});
</script>

<template>
  <div class="spinner">
    <v-progress-circular indeterminate :size="sizeValue" :width="width" :color="color" />
  </div>
</template>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100%;
}
</style>
