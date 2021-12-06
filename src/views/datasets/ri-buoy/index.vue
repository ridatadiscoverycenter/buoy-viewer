<template>
  <router-view />
</template>

<script setup lang="ts">
import { inject, provide } from "vue";

import { useRIBuoy } from "@/store/ri-buoy.ts";

const buoy = useRIBuoy();

const setLoading = inject('setLoading');
setLoading(true);
buoy.fetchBaseData().then(() => {
  setLoading(false);
});

provide("store", buoy);
</script>
