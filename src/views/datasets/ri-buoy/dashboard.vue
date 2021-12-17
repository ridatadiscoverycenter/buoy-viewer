<template>
  <LineChartDashboard :query="query">
    <template #summary-heatmap>
      <StationHeatmap :summary="store.summary" :variables="store.variables" />
    </template>
  </LineChartDashboard>
</template>

<script setup lang="ts">
import { inject, provide, watch } from "vue";
import { useRoute } from "vue-router";

import LineChartDashboard from "@/components/buoy/LineChartDashboard.vue";
import StationHeatmap from "@/components/buoy/StationHeatmap.vue";

const store = inject("store");
import { useQuery } from "@/composables/useQuery.ts";
const { query, updateQuery } = useQuery(store);

const route = useRoute();

updateQuery(route.query);
watch(() => route.query, updateQuery);

// set up the comparison dataset
import { buoyStores } from "@/store/buoy.ts";
const compareName = "osom";
const compareStore = buoyStores[compareName].useStore();
provide("compareStore", compareStore);
</script>
