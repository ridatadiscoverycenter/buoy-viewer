<template>
  <div>
    <a class="logo-container" href="https://ridatadiscovery.org">
      <span class="brand-title">Rhode Island Data Discovery Center</span>
      <BaseLogo />
    </a>
    <slot />
  </div>

  <main v-if="errored" class="error-container">
    <div class="error-content">
      <i class="fas fa-life-ring mr-2 has-text-danger" />
      <p>{{ errorMessage }}</p>
    </div>
    <a @click="goBack">
      <i class="fas fa-arrow-left mr-2" />
      Back
    </a>
    <!-- TODO: is this error clearning working? -->
    <router-link to="/" @click="errored = false">
      <i class="fas fa-home mr-2" />
      Home
    </router-link>
  </main>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from "vue";

import BaseLogo from "@/components/base/BaseLogo.vue";

// ERROR HANDLING
const errored = ref(false);
const errorMessage = ref("");

const goBack = () => console.log("GO BACK"); // TODO: go somewhere

onErrorCaptured((err: Error) => {
  console.log("in error handler");
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

.error-content,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.error-container {
  padding: 3rem;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: white;
}
.error-content {
  font-size: 3rem;
}
</style>
