<template>
  <router-view />
</template>

<script setup lang="ts">
import { inject, provide } from "vue";

import { buoyStores } from "@/store/buoy.ts";

const store = buoyStores["ri-buoy"].useStore();

const setLoading = inject("setLoading");
setLoading(true);
store.fetchBaseData().then(() => {
  setLoading(false);
});

provide("store", store);
</script>
