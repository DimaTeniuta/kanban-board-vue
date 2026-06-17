<script setup lang="ts">
import { useGetBoards } from './composable/useGetBoards';

const { data: boards } = useGetBoards();

console.log(11111, boards);
</script>

<template>
  <div>BoardsPage</div>
</template>
