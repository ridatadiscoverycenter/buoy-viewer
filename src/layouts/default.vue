<template>
  <div>
    <a class="logo-container" href="https://ridatadiscovery.org">
      <span class="brand-title">Rhode Island Data Discovery Center</span>
      <BaseLogo />
    </a>
    <slot />
  </div>

  <ErrorPage v-if="errored" :message="errorMessage" @clear="errored = false" />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

import BaseLogo from "@/components/base/BaseLogo.vue";
import ErrorPage from "@/components/base/ErrorPage.vue";

// ERROR HANDLING
const errored = ref(false);
const errorMessage = ref("");

onErrorCaptured((err: Error) => {
  errored.value = true;
  errorMessage.value = err.message;
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/main.scss";

.logo-container {
  @extend .is-flex;
  @extend .px-2;
  @extend .py-2;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #a4b1bf;
}
</style>
