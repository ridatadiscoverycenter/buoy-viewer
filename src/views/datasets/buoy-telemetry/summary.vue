<template>
  <DashboardCard width="full">
    <template #title>Current Conditions</template>
    <template #subtitle>
      <p>
        This map contains selected real-time climate data from two buoys in
        Narragansett Bay (NB). Data are collected every 15 minutes, although
        there may be up to a 6-hour lag in available data. Explore and download
        more climate variables below, with data from January 2022 through today.
        This work was funded by Rhode Island Sea Grant and the Rhode Island
        Consortium for Coastal Ecology Assessment, Innovation,and Modeling (RI
        C-AIM).
      </p>
    </template>
    <template #content>
      <div class="map-app-container">
        <BuoyMap :samples="selectedSamples" />
        <!--<DateSlider />-->
      </div>
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
import { computed, inject, ref } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import DownloadForm from "@/components/buoy/DownloadForm.vue";
import ExploreForm from "@/components/buoy/ExploreForm.vue";
//import DateSlider from "@/components/buoy-telemetry/DateSlider.vue";
import BuoyMap from "@/components/buoy-telemetry/BuoyMap.vue";

import { BuoyStore } from "../../../store/buoy";

const store = inject("store") as BuoyStore;

const endDate = store.maxDateRaw;
const startDate = new Date(endDate.valueOf() - 24 * 60 * 60 * 1000);

const variableStr = ["avgWindDir", "avgWindSpeed", "hydrocatTemperature"];
const bouyIDs = store.coordinates.map((c) => c.buoyId).join(",");

const samplesRaw = await store.fetchBuoyData({
  ids: bouyIDs,
  variables: variableStr[2],
  end: endDate.toISOString(),
  start: startDate.toISOString(),
});

const samples = samplesRaw.data.map((s) => {
  return { ...s, date: new Date(s.time) };
});

const selectedDate = ref(endDate);

const selectedSamples = computed(() => {
  return samples.filter(
    (s) => s.date.valueOf() === selectedDate.value.valueOf()
  );
});
</script>

<style scoped>
.map-app-container {
  position: relative;
}
</style>
