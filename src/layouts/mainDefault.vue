<template>
  <div class="layout">
    <a class="logo-container" href="https://riddc.brown.edu">
      <span class="brand-title">Rhode Island Data Discovery Center</span>
      <BaseLogo />
    </a>
    <slot />
    <BaseFooter />
  </div>

  <ErrorPage v-if="errored" :message="errorMessage" @clear="errored = false" />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

import BaseLogo from "@/components/base/BaseLogo.vue";
import BaseFooter from "@/components/base/BaseFooter.vue";
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

.layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.logo-container {
  @extend .is-flex;
  @extend .px-2;
  @extend .py-2;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #a4b1bf;
}

.brand-title {
  @extend .mb-0;
  @extend .mr-2;
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
