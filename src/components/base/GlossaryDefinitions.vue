<template>
  <p class="px-4 py-1 is-size-6">
    <strong>{{ term }}{{ unit ? ` (${unit})` : "" }}: </strong>
    <slot></slot>
  </p>
</template>

<script lang="ts" setup>
defineProps<{
  term: string;
  unit: string;
}>();
</script>
