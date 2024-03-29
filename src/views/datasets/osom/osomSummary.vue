<template>
  <BuoyDashboard :scenarios="scenarios">
    <template #available-data>
      The Ocean State Ocean Model (OSOM), developed in a collaboration between
      the University of Rhode Island and Brown University, is an application of
      the Regional Ocean Modeling System (ROMS). The model spans Rhode Island's
      major waterways: Narragansett Bay, Mt. Hope Bay, larger rivers, and the
      Block Island Shelf circulation from Long Island to Nantucket. Data is
      available by the year at 1.5 hour increments. As the model covers the
      entire Narragansett Bay, data is always available at all buoy locations.
    </template>

    <template #heatmap>
      <VariableHeatmap
        :summary="store.summary"
        :variables="store.variables"
        x-title="Year"
        x-unit="year"
      />
    </template>

    <template #learn-more>
      The Ocean State Ocean Model is an ongoing project, learn more about its
      history, current status, publications, and how to use the data with the
      <ExternalLink
        href="https://riddc-jupyter-book.web.app/notebooks/fox-kemper/osom_intro.html"
        >RIDDC Data Articles</ExternalLink
      >.
    </template>
  </BuoyDashboard>
</template>

<script setup lang="ts">
import { inject } from "vue";

import VariableHeatmap from "@/components/buoy/VariableHeatmap.vue";
import BuoyDashboard from "@/components/buoy/SummaryDashboard.vue";

import { type BuoyStore } from "../../../store/buoy";
import ExternalLink from "../../../components/base/ExternalLink.vue";
const store = inject("store") as BuoyStore;

const scenarios = [
  {
    name: "Changes in Water Temperature at N. Prudence and Conimicut Pt. in 2006",
    query: {
      ids: "bid2,bid3",
      variables: "WaterTempSurface,WaterTempBottom",
      start: "2006-01-01",
      end: "2006-12-31",
    },
  },
  {
    name: "Changes in Surface Salinity at Greenwich Bay and GSO Dock in 2018",
    query: {
      ids: "bid15,bid17",
      variables: "SalinitySurface",
      start: "2018-01-01",
      end: "2018-12-31",
    },
  },
];
</script>
