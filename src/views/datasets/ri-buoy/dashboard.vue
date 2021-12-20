<template>
  <Suspense>
    <LineChartDashboard :query="query">
      <template #summary-heatmap>
        <StationHeatmap :summary="store.summary" :variables="store.variables" />
      </template>
    </LineChartDashboard>

    <template #fallback>
      <LoadingSpinner :loading="true" />
    </template>
  </Suspense>
</template>

<script setup lang="ts">
import { inject, provide, watch } from "vue";
import { useRoute } from "vue-router";

import LineChartDashboard from "@/components/buoy/LineChartDashboard.vue";
import StationHeatmap from "@/components/buoy/StationHeatmap.vue";
import LoadingSpinner from "@/components/base/LoadingSpinner.vue";

const store = inject("store");
const route = useRoute();
import { useQuery } from "@/composables/useQuery.ts";
const { query, updateQuery } = useQuery(store, route.path);

updateQuery(route.query, route.path);
watch(() => route.query, (val) => updateQuery(val, route.path));

// set up the comparison dataset
import { buoyStores } from "@/store/buoy.ts";
const compareStore = buoyStores["osom"].useStore();
provide("compareStore", compareStore);
</script>
