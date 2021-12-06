<template>
  <LineChartDashboard
    dataset="ri-buoy"
    dataset-title="Historical"
    compare-dataset="osom"
    compare-dataset-title="OSOM"
    :query="query"
  >
    <template #summary-heatmap>
      <StationHeatmap :summary="summary" :variables="variables" />
    </template>
  </LineChartDashboard>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";

import LineChartDashboard from '@/components/buoy/LineChartDashboard.vue';
import StationHeatmap from '@/components/buoy/StationHeatmap.vue';

import { useQuery } from "@/composables/useQuery.ts";
const { query, updateQuery } = useQuery();

const route = useRoute();

updateQuery(route.query);
watch(() => route.query, updateQuery)
</script>
