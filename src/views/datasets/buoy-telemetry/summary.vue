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
        Consortium for Coastal Ecology Assessment, Innovation, and Modeling (RI
        C-AIM).
      </p>
    </template>
    <template #content>
      <div class="map-app-container">
        <DataCard :selected-samples="selectedSamples" />
        <BuoyMap :samples="selectedSamples" :selected-date="selectedDate" />
        <DateSlider
          :start-date="startDate"
          :end-date="endDate"
          :selected-date="selectedDate"
          @new-selected-date="selectedDate = $event"
        />
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="one-third" :height="1">
    <template #title>Explore</template>
    <template #subtitle>
      Here you can generate a line plot comparing one variable for multiple
      buoys over time. Just select the variable, the buoys, and the time range.
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

import DataCard from "@/components/buoy-telemetry/DataCard.vue";
import DashboardCard from "@/components/base/DashboardCard.vue";
import DownloadForm from "@/components/buoy/DownloadForm.vue";
import ExploreForm from "@/components/buoy/ExploreForm.vue";
import DateSlider from "@/components/buoy-telemetry/DateSlider.vue";
import BuoyMap from "@/components/buoy-telemetry/BuoyMap.vue";

import { BuoyStore } from "../../../store/buoy";

const store = inject("store") as BuoyStore;

const endDate = store.maxDateRaw;
const startDate = new Date(endDate.valueOf() - 24 * 60 * 60 * 1000);

const variableStr = [
  "AirTemp",
  "AirPressure",
  "HumiditySurface",
  "Precipitation",
  "WaterTempSurface",
  "WindDirectionFrom",
  "WindSpeedAverage",
];
const bouyIDs = store.coordinates.map((c) => c.buoyId).join(",");

const samplesRaw = await store.fetchBuoyData({
  ids: bouyIDs,
  variables: variableStr,
  end: endDate.toISOString(),
  start: startDate.toISOString(),
});

const samples = samplesRaw.data.map((s) => {
  return { ...s, date: new Date(s.time) };
});

const selectedDate = ref(endDate);

const selectedSamples = computed(() => {
  // initialize samples array first
  const res = [];
  // for each buoy
  store.coordinates.forEach((coordinate) => {
    console.log(coordinate);
    variableStr.forEach((variable) => {
      console.log(variable);
      const foundSample = samples.find((sample) => {
        return (
          sample.date.valueOf() === selectedDate.value.valueOf() &&
          sample.variable === variable &&
          sample.station_name === coordinate.station_name &&
          sample.value !== null
        );
      });
      console.log(foundSample);
      if (foundSample) {
        res.push(foundSample);
        return;
      }

      const nextSample = samples.find((sample) => {
        return (
          sample.date.valueOf() > selectedDate.value.valueOf() &&
          sample.variable === variable &&
          sample.station_name === coordinate.station_name &&
          sample.value !== null
        );
      });

      const reversedSamples = [...samples].reverse();

      const prevSample = reversedSamples.find((sample) => {
        return (
          sample.date.valueOf() < selectedDate.value.valueOf() &&
          sample.variable === variable &&
          sample.station_name === coordinate.station_name &&
          sample.value !== null
        );
      });
      console.log(prevSample, nextSample);

      if (!nextSample && !prevSample) {
        return;
      }

      if (!nextSample) {
        res.push(prevSample);
        return;
      }

      if (!prevSample) {
        res.push(nextSample);
        return;
      }
      // placeholder - interpolation
      res.push(nextSample);
    });
    // find values at selectedDate (if exist)

    // else find last value before and first value after timepoint
    // if only before or after, return value that is there
    // if both present, interpolate
  });
  return res;
});
</script>

<style scoped>
.map-app-container {
  position: relative;
}
</style>
