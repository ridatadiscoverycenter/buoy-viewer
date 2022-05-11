<template>
  <DashboardCard width="full">
    <template #title>Current Conditions</template>
    <template #subtitle>
      This dashboard contains selected real-time climate data from buoys in
      Narragansett Bay (NB). There may be up to a 12-hour lag in available data.
      Explore and download more climate variables below, with data from the past
      three months. This work was funded by the
      <a href="https://seagrant.gso.uri.edu/">Rhode Island Sea Grant</a> and the
      <a href="https://web.uri.edu/rinsfepscor/welcome/"
        >Rhode Island Consortium for Coastal Ecology Assessment, Innovation, and
        Modeling (RI C-AIM)</a
      >.
    </template>
  </DashboardCard>
  <DashboardCard width="half">
    <template #title>Current Conditions: Map</template>
    <template #subtitle>
      Use the date slider to look back in 15 minute intervals for the past 5
      days. After clicking on the slider, use left/right arrow keys to move
      between intervals.
    </template>
    <template #content>
      <div class="map-app-container">
        <BuoyMap :samples="selectedSamples" :formatted-date="formattedDate" />
        <DateSlider
          :start-date="startDate"
          :end-date="endDate"
          :selected-date="selectedDate"
          @new-selected-date="selectedDate = $event"
        />
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="half">
    <template #title>Current Conditions: Data</template>
    <template #subtitle>
      This table shows weather data for the timepoint selected with the date
      slider on the map.
    </template>
    <template #content>
      <div class="is-size-4 pl-4">
        <span>{{ formattedDate }}</span>
      </div>
      <table class="table mx-auto is-striped is-narrow-mobile">
        <thead>
          <tr>
            <td></td>
            <th v-for="buoy in store.coordinates" :key="buoy.buoyId">
              {{ buoy.station_name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="variable in variableStr"
            :key="variable"
            :custom-label="formatVariable"
          >
            <th>
              {{
                formatVariable(store.variables.find((v) => v.name === variable))
              }}
            </th>
            <td v-for="buoy in store.coordinates" :key="buoy.buoyId">
              {{
                selectedSamples
                  .find(
                    (sample) =>
                      sample.variable === variable &&
                      sample.station_name === buoy.station_name
                  )
                  ?.value.toFixed(1) ?? "NA"
              }}
            </td>
          </tr>
        </tbody>
      </table>
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
    <template #subtitle
      >Check out this <a href="">video</a> of researchers deploying a buoy!
      <br />
      <br />
      Learn more about the NSF-funded RI-C-AIM program
      <a href="https://web.uri.edu/rinsfepscor/research/">here</a>.
      <br />
      <br />
      The full dataset used to power this app is available on
      <a
        href="https://pricaimcit.services.brown.edu/erddap/search/index.html?page=1&itemsPerPage=1000&searchFor=Buoy+Telemetry"
        >ERDDAP</a
      >.
      <br />
      <br />

      <img
        src="../../../../public/buoy_400x250.jpeg"
        alt="Buoy deployment in Narragansett Bay"
      />
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";

import DashboardCard from "@/components/base/DashboardCard.vue";
import DownloadForm from "@/components/buoy/DownloadForm.vue";
import ExploreForm from "@/components/buoy/ExploreForm.vue";
import DateSlider from "@/components/buoy-telemetry/DateSlider.vue";
import BuoyMap from "@/components/buoy-telemetry/BuoyMap.vue";

import { formatVariable } from "../../../utils/utils";
import { BuoyStore } from "../../../store/buoy";

const store = inject("store") as BuoyStore;

const endDate = store.maxDateRaw;
const startDate = new Date(endDate.valueOf() - 5 * 24 * 60 * 60 * 1000);

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
  variables: variableStr.join(","),
  end: endDate.toISOString(),
  start: startDate.toISOString(),
});

const samples = samplesRaw.data.map((s) => {
  return { ...s, date: new Date(s.time) };
});

const selectedDate = ref(endDate);

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(selectedDate.value);
});

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
          sample.value !== null &&
          sample.units
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
