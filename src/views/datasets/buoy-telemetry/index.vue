<template>
  <router-view />
</template>

<script setup lang="ts">
import { useBuoyTelemetryStore } from "../../../store/buoy-telemetry";

const store = useBuoyTelemetryStore();
await store.fetchBaseData();
</script>
