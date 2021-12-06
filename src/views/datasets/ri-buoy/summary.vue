<template>
  <BuoyDashboard dataset="ri-buoy" :scenarios="scenarios">
    <template #available-data>
      This dataset spans from {{ buoy.minDate.getUTCFullYear() }} to
      {{ buoy.maxDate.getUTCFullYear() }}. The heatmap below summarizes the
      number of observations collected for each month for different variables.
      Use this heatmap to help you decide what data you want to visualize or
      download. When you have an idea, go ahead and select the buoys, variables
      and dates to explore. Or download the data in the most appropriate format
      for your analyses! To begin, select a variable to see what data is
      available.
    </template>

    <template #heatmap>
      <StationHeatmap :summary="buoy.summary" :variables="buoy.variables" />
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
import StationHeatmap from "@/components/buoy/StationHeatmap.vue";
import BuoyDashboard from "@/components/buoy/SummaryDashboard.vue";

import { useRIBuoy } from "@/store/ri-buoy.ts";

const buoy = useRIBuoy();

// TODO: scenario buttons for expore more
const scenarios = [];
</script>
