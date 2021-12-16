<template>
  <BuoyDashboard dataset="ri-buoy" :scenarios="scenarios">
    <template #available-data>
      This dataset spans from {{ store.minDate.getUTCFullYear() }} to
      {{ store.maxDate.getUTCFullYear() }}. The heatmap below summarizes the
      number of observations collected for each month for different variables.
      Use this heatmap to help you decide what data you want to visualize or
      download. When you have an idea, go ahead and select the buoys, variables
      and dates to explore. Or download the data in the most appropriate format
      for your analyses! To begin, select a variable to see what data is
      available.
    </template>

    <template #heatmap>
      <StationHeatmap :summary="store.summary" :variables="store.variables" />
    </template>

    <template #learn-more>
      The historical data available on this site has been compiled from the
      <a
        href="http://www.dem.ri.gov/programs/emergencyresponse/bart/stations.php"
        >Narragansett Bay Fixed-Site Monitoring Network</a
      >. See <a href="nbfsmn_disclaimer.pdf">the disclaimer</a> for more
      information on the data as well as how to cite it.
    </template>
  </BuoyDashboard>
</template>

<script setup lang="ts">
import { inject } from "vue";

import StationHeatmap from "@/components/buoy/StationHeatmap.vue";
import BuoyDashboard from "@/components/buoy/SummaryDashboard.vue";

const store = inject("store");

const scenarios = [
  {
    name: "N. Prudence and Conimicut Pt, Water Temperature, 2010-2011",
    query: {
      ids: "bid2,bid3",
      variables: "WaterTempSurface,WaterTempBottom",
      start: "2010-05-01T04%3A00%3A00.000Z",
      end: "2011-10-31T04%3A00%3A00.000Z",
    },
  },
  {
    name: "Greenwich Bay and GSO Dock, Depth, 2008-2009",
    query: {
      ids: "bid15,bid17",
      variables: "depth",
      start: "2008-05-01T04%3A00%3A00.000Z",
      end: "2009-10-31T04%3A00%3A00.000Z",
    },
  },
];
</script>
