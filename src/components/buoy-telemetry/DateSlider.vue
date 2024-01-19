<template>
  <div class="slider-container">
    <label class="x-axis" for="slider"></label>
    <input
      id="slider"
      class="slider mb-2"
      step="1"
      min="0"
      type="range"
      :max="numIntervals"
      :value="currentInterval"
      @input="changeDate"
    />
  </div>
</template>

v-model="value"
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { scaleTime } from "d3-scale";
import { select } from "d3-selection";
import { axisBottom } from "d3-axis";

const timeout = ref(null);

const FIFTEEN_MINUTE = 1000 * 60 * 15;

const props = defineProps<{
  endDate: Date;
  startDate: Date;
  selectedDate: Date;
}>();

const numIntervals = computed(() => {
  return (props.endDate.valueOf() - props.startDate.valueOf()) / FIFTEEN_MINUTE;
});

const currentInterval = computed(() => {
  return (
    (props.selectedDate.valueOf() - props.startDate.valueOf()) / FIFTEEN_MINUTE
  );
});

const domainArray = computed(() => [props.startDate, props.endDate]);

const emit = defineEmits(["new-selected-date"]);

const generateAxis = () => {
  try {
    // remove the old axis if it exists
    select(".x-axis svg").remove();
  } catch {}
  const svg = select(".x-axis").append("svg").attr("width", "calc(100%)");
  const scale = scaleTime()
    .domain(domainArray.value)
    .range([0, svg.node().getBoundingClientRect().width - 40]);
  const xAxis = axisBottom()
    .scale(scale)
    .ticks(Math.round(svg.node().getBoundingClientRect().width / 100));
  svg.append("g").attr("transform", "translate(20, 20)").call(xAxis);
};

const changeDate = (event) => {
  const interval = event.target.value;
  const newDate = new Date(
    props.startDate.valueOf() + interval * FIFTEEN_MINUTE,
  );
  emit("new-selected-date", newDate);
};

const onResize = () => {
  // debounce re-drawing axis
  if (timeout.value) clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    generateAxis();
  }, 300);
};

onMounted(() => {
  generateAxis();
  window.addEventListener("resize", onResize);
});
onBeforeUnmount(() => window.removeEventListener("resize", onResize));
</script>

<style lang="scss" scoped>
.slider-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  background: rgba(355, 355, 355, 0.7);
  z-index: 2;
  width: 95%;
  margin: auto;
  height: 70px;
  bottom: 30px;
  left: 2.5%;
}
.x-axis {
  z-index: 1000;
  height: 0;
  font-weight: 600;
  stroke-width: 1.5px;
}
input[type="range"].slider {
  margin-left: 20px;
  bottom: 0px;
  position: absolute;
  z-index: 1000;
  width: calc(100% - 40px);
}
</style>
