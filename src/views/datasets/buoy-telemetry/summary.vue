<template>
  <DashboardCard width="full">
    <template #title>Current Conditions</template>
    <template #subtitle><p>Intro prose</p> </template>
    <template #content>
      <div class="map-app-container">
        <BuoyMap />
        <!--<DateSlider />-->
      </div>
      {{ store.coordinates }}
    </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="1">
    <template #title>Explore</template>
    <template #subtitle>
      Here you can generate a line plot comparing one variable for multiple
      buoys over time. Just select the variable, the buoys, and the time range.
      Use the heatmap above to check what data are available.
    </template>
    <template #content>
      <ExploreForm />
    </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="1">
    <template #title>Download</template>
    <template #subtitle>
      If you prefer, we provide the raw data for you to download in various file
      formats. Just select from the options below.
    </template>
    <template #content>
      <DownloadForm />
    </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="1">
    <template #title>Learn more</template>
    <template #subtitle>Detailed prose about the project here</template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { inject } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import DownloadForm from "@/components/buoy/DownloadForm.vue";
import ExploreForm from "@/components/buoy/ExploreForm.vue";
//import DateSlider from "@/components/buoy-telemetry/DateSlider.vue";
import BuoyMap from "@/components/buoy-telemetry/BuoyMap.vue";

import { BuoyStore } from "../../../store/buoy";
const store = inject("store") as BuoyStore;
</script>

<style scoped>
.map-app-container {
  position: relative;
}
</style>
