<template>
  <BuoyDashboard :scenarios="scenarios">
    <template #available-data>
      <p>
        This dataset spans from {{ store.minDate.slice(0, 4) }} to
        {{ store.maxDate.slice(0, 4) }} and was collected by the
        <ExternalLink
          href="http://www.dem.ri.gov/programs/emergencyresponse/bart/stations.php"
        >
          Narragansett Bay Fixed Station Monitoring Network
          (NBFSMN)</ExternalLink
        >
        with
        <ExternalLink
          href="https://www.mass.gov/orgs/massachusetts-department-of-environmental-protection"
          >MassDEP</ExternalLink
        >
        as the lead agency. The heatmap below summarizes the number of
        observations collected for each month for different variables. Use this
        heatmap to help you decide what data you want to visualize or download.
        When you have an idea, go ahead and select the buoys, variables and
        dates to explore. Or download the data in the most appropriate format
        for your analyses! To begin, select a variable to see what data is
        available.
      </p>
      <br />
      <p>
        <small
          ><i>Note:</i> The variables with "Qualifier" in the name provide
          annotations for the corresponding variable without "Qualifier". The
          qualifers are not plottable, but can be downloaded for analysis
          offline.</small
        >
      </p>
    </template>

    <template #heatmap>
      <StationHeatmap :summary="store.summary" :variables="store.variables" />
    </template>

    <template #learn-more>
      <p>
        The historical data available on this site has been compiled from the
        <ExternalLink
          href="https://www.mass.gov/info-details/mount-hope-bay-marine-buoy-continuous-probe-data#data-files-for-mount-hope-bay-marine-buoys"
          >Massachusetts Department of Environmental Protection</ExternalLink
        >. The seasonal monitoring program is part of the Narragansett Bay
        Fixed-Site Monitoring Network.
      </p>
      <br />
      <p>
        Each data column in this dataset has a matching
        <em>Qualifiers</em> column with notes on the data collection and
        adjustments made. See
        <ExternalLink
          href="https://pricaimcit.services.brown.edu/erddap/tabledap/ma_buoy_data_a6c9_12eb_1ec5.html"
          >ERDDAP</ExternalLink
        >
        for the full dataset with qualifiers.
      </p>
    </template>
  </BuoyDashboard>
</template>

<script setup lang="ts">
import { inject } from "vue";

import StationHeatmap from "@/components/buoy/StationHeatmap.vue";
import BuoyDashboard from "@/components/buoy/SummaryDashboard.vue";

import { type BuoyStore } from "../../../store/buoy";
import ExternalLink from "../../../components/base/ExternalLink.vue";
const store = inject("store") as BuoyStore;

const scenarios = [
  {
    name: "Changes in Depth at Cole and Taunton in 2017",
    query: {
      ids: "bid101,bid102",
      variables: "depth",
      start: "2017-05-01",
      end: "2017-11-30",
    },
  },
  {
    name: "Changes in Water Temperature at Cole and Taunton in 2018",
    query: {
      ids: "bid101,bid102",
      variables: "WaterTempSurface,WaterTempBottom",
      start: "2018-05-01",
      end: "2018-11-30",
    },
  },
];
</script>
