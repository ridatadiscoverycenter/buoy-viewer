<template>
  <div>
    <BuoyLineChart
      :dataset="datasetData"
      :dataset-line-width="datasetLineWidth"
      :variables="queryVariables"
      :start-dt-str="startDate.slice(0, 10)"
      :end-dt-str="endDate.slice(0, 10)"
      :compare-dataset="compareDatasetData"
      :compare-name="compareDatasetTitle"
      :compare-path="compareDatasetPath"
      :compare-line-width="compareLineWidth"
      :dataset-name="datasetTitle"
      :loading="loading"
      :weather-data="weatherData"
      :downsampled="downsampled"
    />

    <BuoyLocations :coordinates="filterCoordinates" :height="3" />

    <ChartContainer width="one-third" :height="3">
      <template #title> Keep Exploring </template>
      <template #subtitle>
        Try different variables, buoys, or changing the date range!
      </template>
      <template #content>
        <ExploreForm
          :init-variables="queryVariables"
          :init-buoys="stationNames"
          :init-date-range="[startDate, endDate]"
          :dataset="dataset"
        />
      </template>
    </ChartContainer>

    <ChartContainer width="two-thirds" :height="4">
      <template #title> Available Data </template>
      <template #subtitle>
        Use this heatmap to help you decide what data you want to visualize.
        When you have an idea, go ahead and select the variables and dates to
        explore.
      </template>
      <template #content>
        <slot name="summary-heatmap" />
      </template>
    </ChartContainer>

    <BuoyQueryDownload
      :variables="queryVariables"
      :buoy-ids="buoyIds"
      :start-dt-str="startDate"
      :end-dt-str="endDate"
      :dataset-id="datasetId"
    />

    <CompassLoading :manual-load="loading" />
  </div>
</template>

<script>
import ChartContainer from "@/components/base/ChartContainer.vue";
import ExploreForm from "@/components/ExploreForm.vue";
import CompassLoading from "@/components/base/LoadingSpinner.vue";
import BuoyLocations from "@/components/buoy/LocationMap.vue";
import BuoyLineChart from "@/components/buoy/LineChartCard.vue";
import BuoyQueryDownload from "@/components/buoy/QueryDownload.vue";

export default {
  components: {
    ChartContainer,
    ExploreForm,
    CompassLoading,
    BuoyLocations,
    BuoyLineChart,
    BuoyQueryDownload,
  },
  props: {
    dataset: {
      type: String,
      required: true,
    },
    datasetTitle: {
      type: String,
      required: true,
    },
    datasetLineWidth: {
      type: Number,
      required: false,
      default: 1.8,
    },
    compareDataset: {
      type: string,
      required: true,
    }
    compareDatasetTitle: {
      type: String,
      required: true,
    },
    compareLineWidth: {
      type: Number,
      required: false,
      default: 0.8,
    },
    query: {
      type: Object,
      required: true,
    },
  },
  computed: {
    buoys() {
      return this.coordinates.map((val) => val.fullName);
    },
    queryVariables() {
      const queryVarNames = this.$route.query.variables.split(",");
      return this.variables.filter((v) => queryVarNames.includes(v.name));
    },
    startDate() {
      return this.$route.query.start;
    },
    endDate() {
      return this.$route.query.end;
    },
    buoyIds() {
      return this.$route.query.buoyIds.split(",");
    },
    stationNames() {
      return this.coordinates
        .filter((r) => this.buoyIds.includes(r.buoyId))
        .map((r) => r.fullName);
    },
    filterCoordinates() {
      return this.coordinates.filter((o) => {
        return this.buoyIds.includes(o.buoyId);
      });
    },
  },
};
</script>
