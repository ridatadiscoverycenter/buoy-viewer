<template>
  <DashboardCard width="two-thirds">
    <template #title>Current Conditions</template>
    <template #subtitle>
      <div class="content-container">
        <div class="content">
          This dashboard contains selected real-time climate data from buoys in
          Narragansett Bay (NB). Measurements are collected using a suite of
          sensors, logging data at 10-minute (Gill Maximet weather station,
          PAR), 15-minute (Seabird Hydrocat and ECO), and 3-hour intervals
          (Seabird Hydrocycle and SUNA). There may be up to a 12-hour lag in
          available data as data stream into ERDDAP and through an automated QC
          process. Explore and download more climate variables below, with data
          available from the past three months. This work was funded by the
          <ExternalLink href="https://seagrant.gso.uri.edu"
            >Rhode Island Sea Grant</ExternalLink
          >
          and the
          <ExternalLink href="https://web.uri.edu/rinsfepscor/welcome/"
            >Rhode Island Consortium for Coastal Ecology Assessment, Innovation,
            and Modeling (RI C-AIM)</ExternalLink
          >.
        </div>
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="one-third">
    <template #content>
      <div class="content-container">
        <img
          src="/images/buoy-image.png"
          alt="Buoy deployment in Narragansett Bay"
          width="195"
        />
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="half">
    <template #title>Current Conditions &mdash; Summary Map</template>
    <template #subtitle>
      Use the date slider to look back in 15 minute intervals for the past 30
      days. After clicking on the slider, use left/right arrow keys to move
      between intervals. Color markers indicate Surface Water Temperature at
      real-time buoys, with values ranging from cool blue to warm orange
      (2.17&ndash;13.52 &deg;C). Wind indicators follow
      <ExternalLink href="https://www.wpc.ncep.noaa.gov/html/stationplot.shtml"
        >NOAA conventions.
      </ExternalLink>
    </template>
    <template #content>
      <div class="map-app-container">
        <BuoyMap
          :samples="selectedSamples"
          :formatted-date="formattedDate"
          :show-water-temp="true"
          :show-wind="true"
        />
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
    <template #title>Current Conditions &mdash; Summary Data</template>
    <template #subtitle>
      This table shows Chlorophyll, Nitrate, and Phosphate levels along with
      selected weather data for the timepoint selected with the date slider on
      the map. Values update with changes in the map slider. Explore other
      variables and QC data below!
    </template>
    <template #content>
      <div class="is-size-5 pl-4">
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
                      sample.station_name === buoy.station_name,
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

  <DashboardCard :scenarios="scenarios" width="one-third" :height="1">
    <template #title> Not sure what to explore? </template>
    <template #subtitle>
      Here are a few pre-selected scenarios for you. Pick one to start exploring
      and then play with additional variables and date ranges.
    </template>
    <template #content>
      <div class="is-flex-column">
        <router-link
          v-for="(scenario, key) in scenarios"
          :key="key"
          class="button is-primary my-1"
          :to="generateQuery(scenario.query)"
        >
          {{ scenario.name }}
        </router-link>
      </div>
    </template>
  </DashboardCard>

  <DashboardCard width="full" :height="1">
    <template #title>Learn more</template>

    <template #content>
      <div class="content px-4 is-size-5">
        <div class="video-wrapper mb-3">
          <iframe
            src="https://www.youtube.com/embed/uPXvtlrC7Rs"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
        <p>
          Learn more about the
          <ExternalLink href="https://web.uri.edu/rinsfepscor/research/"
            >NSF-funded RI-C-AIM program</ExternalLink
          >.
        </p>
        <p>
          The full dataset used to power this app is available on
          <ExternalLink
            href="https://pricaimcit.services.brown.edu/erddap/search/index.html?page=1&itemsPerPage=1000&searchFor=Buoy+Telemetry"
            >ERDDAP</ExternalLink
          >.
        </p>
        <p>
          Additional information about the data variables and QC tests can be
          found in the
          <ExternalLink
            href="https://pricaimcit.services.brown.edu/erddap/info/buoy_telemetry_0ffe_2dc0_916e/index.html"
            >ERDDAP dataset info page</ExternalLink
          >.
        </p>
      </div>
    </template>
  </DashboardCard>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";
import { scaleLinear } from "d3-scale";
import { subMonths } from "date-fns";

import DashboardCard from "@/components/base/DashboardCard.vue";
import DownloadForm from "@/components/buoy/DownloadForm.vue";
import ExploreForm from "@/components/buoy/ExploreForm.vue";
import DateSlider from "@/components/buoy-telemetry/DateSlider.vue";
import BuoyMap from "@/components/buoy-telemetry/BuoyMap.vue";

import { formatVariable } from "../../../utils/utils";
import { type BuoyStore } from "../../../store/buoy";
import ExternalLink from "../../../components/base/ExternalLink.vue";

const store = inject("store") as BuoyStore;

const generateQuery = (query) => {
  const queryParams = Object.entries(query)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");
  return `/dataset/${store.name}/dashboard?${queryParams}`;
};

const endDate = store.maxDateRaw;
const startDate = new Date(endDate.valueOf() - 30 * 24 * 60 * 60 * 1000);
const monthDate = subMonths(endDate, 1);
const twoMonthDate = subMonths(endDate, 2);
const threeMonthDate = subMonths(endDate, 3);

const scenarios = [
  {
    name: "Changes in Phospate and Nitrate levels over the last month",
    query: {
      ids: "Buoy-620,Buoy-720",
      variables: "PhosphateSurface,NitrateNSurface",
      end: endDate.toISOString(),
      start: monthDate.toISOString(),
    },
  },
  {
    name: "Changes in Dissolved Oxygen and Salinity levels over the last two months",
    query: {
      ids: "Buoy-620,Buoy-720",
      variables: "O2Surface,SalinitySurface",
      end: endDate.toISOString(),
      start: twoMonthDate.toISOString(),
    },
  },
  {
    name: "Changes in Dissolved Oxygen and Nitrate levels over the last three months",
    query: {
      ids: "Buoy-620,Buoy-720",
      variables: "O2Surface,NitrateNSurface",
      end: endDate.toISOString(),
      start: threeMonthDate.toISOString(),
    },
  },
];

const variableStr = [
  "ChlorophyllSurface",
  "NitrateNSurface",
  "PhosphateSurface",
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
    variableStr.forEach((variable) => {
      const foundSample = samples.find((sample) => {
        return (
          sample.date.valueOf() === selectedDate.value.valueOf() &&
          sample.variable === variable &&
          sample.station_name === coordinate.station_name &&
          sample.value !== null
        );
      });

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

      const interpolator = scaleLinear(
        [prevSample.date.valueOf(), nextSample.date.valueOf()],
        [prevSample.value, nextSample.value],
      );

      const newValue = interpolator(selectedDate.value.valueOf());
      const newSample = {
        ...nextSample,
        date: selectedDate.value,
        value: newValue,
      };
      res.push(newSample);
    });
  });
  return res;
});
</script>

<style scoped lang="scss">
@import "@/assets/styles/main.scss";
.map-app-container {
  position: relative;
}

.content-container {
  display: flex;
  gap: 1rem;
  flex-direction: row;
  @include touch {
    flex-wrap: wrap;
  }
  img {
    align-self: center;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-block-start: -30px;
  }
}
.video-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  /* 16:9 */
  padding-top: 25px;
  height: 0;
}
.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
