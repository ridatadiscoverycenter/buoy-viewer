<template>
  <div v-if="loading" class="loading-container">
    <i spin class="fas fa-compass compass-loading" />
  </div>
</template>

<script setup lang="ts">
defineProps({
  loading: {
    type: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(82, 69, 99, 0.4);
  z-index: 1000;
  justify-content: center;
}
</style>
