<template>
  <DashboardCard width="full">
    <template #title>Current Conditions</template>
    <template #subtitle><p>Intro prose</p> </template>
    <template #content>
      A map
      {{ store.coordinates }}
    </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="1">
    <template #title>Explore</template>
    <template #subtitle>More data here</template>
    <template #content> Explore form here </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="1">
    <template #title>Download</template>
    <template #subtitle><p>Download some data here</p> </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="1">
    <template #title>Learn more</template>
    <template #subtitle>Detailed prose about the project here</template>
  </DashboardCard>
</template>

<script setup lang="ts">
import DashboardCard from "@/components/base/DashboardCard.vue";

import { useBuoyTelemetryStore } from "../../../store/buoy-telemetry";
const store = useBuoyTelemetryStore();
</script>
