<template>
  <div class="content">
    <div
      v-for="(item, index) in store.activeCoordinates"
      :key="index"
      class="data-card-item"
    >
      <h6 class="mb-0">{{ item.station_name }}</h6>
      <p class="mb-0 is-size-7-half">
        {{ sampleText(item.station_name) }}
      </p>
      <svg height="10" :width="280 - 20 * 2">
        <rect
          :width="
            Math.max(0, sampleNormDA(item.station_name) * (280 - 20 * 2) + 2)
          "
          height="10"
          :style="'fill:' + sampleColor(item.station_name)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDAStore } from "../../store/domoic-acid";
const store = useDAStore();

const sampleText = (site) => {
  const match = store.selectedSamples.find((s) => s.station_name === site);
  if (match !== undefined) {
    return match.pDA === 0
      ? "DA not detected"
      : `${match.pDA}ng of DA / L of seawater`;
  } else {
    return "No sample";
  }
};

const sampleColor = (site) =>
  store.selectedSamples.find(({ station_name }) => station_name === site)
    ?.color ?? "white";

const sampleNormDA = (site) =>
  store.selectedSamples.find(({ station_name }) => station_name === site)
    ?.normDA ?? -1;
</script>

<style lang="scss" scoped>
.is-size-7-half {
  font-size: 0.85rem;
}
svg {
  display: block;
  margin-bottom: 10px;
}
</style>
