<template>
  <ChartContainer width="two-thirds" :height="6">
    <template #title> Visualize Data </template>
    <template #subtitle>
      This plot shows {{ variables.map(formatVariable).join(", ") }} over the
      period between {{ startDtStr }} and {{ endDtStr }}. You can hover over the
      lines to see more specific data. Weather data from
      <a href="https://www.rcc-acis.org/" target="_blank" rel="noreferrer"
        >NOAA</a
      >
      is included below.
    </template>
    <template #content>
      <div
        v-if="compareDataset.length > 0 && !loading"
        class="notification is-info is-light mx-4 px-4 py-2"
      >
        <fa :icon="['fas', 'info-circle']" class="mr-1" />
        <span class="is-size-6 mr-4">
          <a :href="comparePath" target="_blank">{{ compareName }}</a> data is
          available which matches your query
        </span>
        <button class="button is-info is-small" @click="toggleCompare">
          {{ compareText }}
        </button>
      </div>

      <div
        v-if="nonPlottableVariables.length > 0 && !loading"
        class="notification is-warning is-light mx-4 px-4 py-2"
      >
        <fa :icon="['fas', 'exclamation-circle']" class="mr-1" />
        <span class="is-size-6 mr-4">
          The following variables are not plottable, download the data below if
          needed: {{ nonPlottableVariables.map(formatVariable).join(", ") }}
        </span>
      </div>

      <div
        v-if="dataset.length === 0 && !loading"
        class="notification is-danger is-light mx-4 px-4 py-2 has-text-centered"
      >
        <p><strong>No Data Matches the Query</strong></p>
      </div>

      <LineChart
        v-else-if="!loading"
        id="line-chart"
        :dataset="plottableDataset"
        :dataset-name="datasetName"
        :dataset-line-width="datasetLineWidth"
        :compare-dataset="compare ? compareDataset : []"
        :compare-name="compareName"
        :compare-line-width="compareLineWidth"
        :variables="plottableVariables"
        :color-domain="colorDomain"
        :color-range="colorRange"
        x="time"
        y="station_name"
        :enable-darkmode="false"
        :weather-dataset="weatherData"
      />

      <p v-if="downsampled">
        <small
          ><fa :icon="['fas', 'info-circle']" class="mr-1" /><i>Note:</i> Data
          has been downsampled, select a smaller date range to visualize raw
          data.</small
        >
      </p>
    </template>
  </ChartContainer>
</template>

<script>
import { mapState } from "vuex";
import * as aq from "arquero";

import LineChart from "@/components/charts/LineChart.vue";
import ChartContainer from "@/components/base/ChartContainer.vue";

import { formatVariable } from "@/utils/utils.ts";

export default {
  components: {
    LineChart,
    ChartContainer,
  },
  props: {
    variables: {
      type: Array,
      required: true,
    },
    startDtStr: {
      type: String,
      required: true,
    },
    endDtStr: {
      type: String,
      required: true,
    },
    dataset: {
      type: Array,
      required: true,
    },
    datasetName: {
      type: String,
      required: true,
    },
    compareDataset: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    compareName: {
      type: String,
      required: false,
      default: "Other",
    },
    comparePath: {
      type: String,
      required: true,
    },
    compareLineWidth: {
      type: Number,
      required: true,
    },
    datasetLineWidth: {
      type: Number,
      required: true,
    },
    loading: {
      type: Boolean,
      rquired: false,
      default: false,
    },
    weatherData: {
      type: Array,
      required: true,
    },
    downsampled: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      compare: false,
      compareText: "Add To Plot",
    };
  },
  computed: {
    ...mapState(["colorMap"]),
    colorDomain() {
      if (this.dataset.length > 0) {
        const stations = aq
          .from(this.dataset)
          .groupby("station_name")
          .count()
          .objects();
        return stations.map((v) => v.station_name);
      } else {
        return [];
      }
    },
    colorRange() {
      return this.colorDomain.map((v) => this.colorMap[v]);
    },
    plottableVariables() {
      return this.variables.filter(
        (variable) => !variable.name.includes("Qualifiers")
      );
    },
    nonPlottableVariables() {
      return this.variables.filter((variable) =>
        variable.name.includes("Qualifiers")
      );
    },
    plottableDataset() {
      return this.dataset.filter((row) =>
        this.plottableVariables.map((v) => v.name).includes(row.variable)
      );
    },
  },
  methods: {
    toggleCompare() {
      this.compare = !this.compare;
      if (this.compare) {
        this.compareText = "Remove From Plot";
      } else {
        this.compareText = "Add To Plot";
      }
    },
    formatVariable,
  },
};
</script>
