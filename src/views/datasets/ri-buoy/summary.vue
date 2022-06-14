<template>
  <BuoyDashboard :scenarios="scenarios">
    <template #available-data>
      This dataset spans from {{ store.minDate.slice(0, 4) }} to
      {{ store.maxDate.slice(0, 4) }} and was collected by the
      <ExternalLink
        href="http://www.dem.ri.gov/programs/emergencyresponse/bart/stations.php"
        >Narragansett Bay Fixed Station Monitoring Network
        (NBFSMN)</ExternalLink
      >
      with
      <ExternalLink href="http://www.dem.ri.gov/programs/water/"
        >RIDEM-OWR</ExternalLink
      >
      as the lead agency. Agencies involved in collection and maintenance of the
      data are: RIDEM-OWR,
      <ExternalLink
        href="https://web.uri.edu/gso/research/marine-ecosystems-research-laboratory/"
        >URI/GSO MERL</ExternalLink
      >, <ExternalLink href="https://www.narrabay.com/">NBC</ExternalLink>,
      <ExternalLink href="http://nbnerr.org/">NBNERR</ExternalLink>, and
      <ExternalLink
        href="https://www.mass.gov/orgs/massachusetts-department-of-environmental-protection"
        >MassDEP</ExternalLink
      >. The heatmap below summarizes the number of observations collected for
      each month for different variables. Use this heatmap to help you decide
      what data you want to visualize or download. When you have an idea, go
      ahead and select the buoys, variables and dates to explore. Or download
      the data in the most appropriate format for your analyses! To begin,
      select a variable to see what data is available.
    </template>

    <template #heatmap>
      <StationHeatmap :summary="store.summary" :variables="store.variables" />
    </template>

    <template #learn-more>
      The historical data available on this site has been compiled from the
      <ExternalLink
        href="http://www.dem.ri.gov/programs/emergencyresponse/bart/stations.php"
        >Narragansett Bay Fixed-Site Monitoring Network</ExternalLink
      >. See <a href="/nbfsmn_disclaimer.pdf">the disclaimer</a> for more
      information on the data as well as how to cite it.
    </template>
  </BuoyDashboard>
</template>

<script setup lang="ts">
import { inject } from "vue";

import StationHeatmap from "@/components/buoy/StationHeatmap.vue";
import BuoyDashboard from "@/components/buoy/SummaryDashboard.vue";

import { BuoyStore } from "../../../store/buoy";
import ExternalLink from "../../../components/base/ExternalLink.vue";
const store = inject("store") as BuoyStore;

const scenarios = [
  {
    name: "Changes in Water Temperature at N. Prudence and Conimicut Pt. from 2010-2011",
    query: {
      ids: "bid2,bid3",
      variables: "WaterTempSurface,WaterTempBottom",
      start: "2010-05-01",
      end: "2011-10-31",
    },
  },
  {
    name: "Changes in Depth at Greenwich Bay and GSO Dock from 2008-2009",
    query: {
      ids: "bid15,bid17",
      variables: "depth",
      start: "2008-05-01",
      end: "2009-10-31",
    },
  },
];
</script>
