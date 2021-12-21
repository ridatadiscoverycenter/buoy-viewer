<template>
  <router-view />
</template>

<script setup lang="ts">
import { provide } from "vue";

import { useFishStore } from "@/store/fish.ts";

const store = useFishStore();
await store.fetchBaseData();

provide("store", store);
</script>
