<template>
  <Heatmap
    v-if="!(summary.length === 0)"
    id="heatmap"
    :dataset="heatmapSummary"
    :min-width="400"
    x="date"
    :x-title="xTitle"
    :x-unit="xUnit"
    y="variable"
    y-title="Variable"
    variable="count"
    :enable-darkmode="false"
  />
</template>

<script lang="ts">
import * as aq from "arquero";

import Heatmap from "@/components/charts/HeatMap.vue";
import { type Variable } from "../../utils/erddap";
import { type PropType } from "vue";

export default {
  components: {
    Heatmap,
  },
  props: {
    summary: {
      type: Array,
      required: true,
    },
    variables: {
      type: Array as PropType<Array<Variable>>,
      required: true,
    },
    xTitle: {
      type: String,
      required: false,
      default: "Month/Year",
    },
    xUnit: {
      type: String,
      required: false,
      default: "month",
    },
  },
  computed: {
    heatmapSummary() {
      return aq
        .from(this.summary)
        .fold(
          this.variables.map((v: Variable) => v.name),
          { as: ["variable", "count"] },
        )
        .objects();
    },
  },
};
</script>
