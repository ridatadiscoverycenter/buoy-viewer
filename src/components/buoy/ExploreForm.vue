<template>
  <BaseForm>
    <template #inputs>
      <div class="control-item">
        <label for="buoy-select" class="label">Select Buoys</label>
        <multiselect
          id="buoy-select"
          v-model="selectedBuoys"
          class="multiselect"
          :options="store.buoys"
          :multiple="true"
        />
      </div>

      <div class="control-item">
        <label for="variable-select-visualize" class="label"
          >Select Variables (up to 4)</label
        >
        <multiselect
          id="variable-select-visualize"
          v-model="selectedVariables"
          class="multiselect"
          :options="store.variables"
          :custom-label="formatVariable"
          track-by="name"
          :multiple="true"
        />
      </div>

      <div class="control-item">
        <label for="date-select" class="label">Select Date Range</label>
        <date-picker
          id="date-select"
          v-model="dateRange"
          :disabled-date="disabledDate"
          :default-value="[store.minDate, store.maxDate]"
          range
        />
      </div>
    </template>

    <template #buttons>
      <!-- TODO: fix link -->
      <!-- <router-link
        class="button is-link"
        :disabled="disabled"
        :to="{
          name: datasetPath,
          query: {
            buoyIds: selectedBuoysString,
            variables: selectedVariablesString,
            ...selectedDates,
          },
        }"
      >
        Visualize
      </router-link> -->
    </template>
  </BaseForm>
</template>

<script setup lang="ts">
import { inject, ref, withDefaults } from "vue";

import Multiselect from "vue-multiselect";
import DatePicker from "vue2-datepicker";

import BaseForm from "@/components/base/BaseForm.vue";

import { Variable } from "@/utils/erddap.ts";
import { formatVariable } from "@/utils/utils.ts";

interface Props {
  initVariables?: Variable[];
  initBuoys?: string[];
  initDateRange?: string[];
  dataset: string;
}

const props = withDefaults(defineProps<Props>(), {
  initVariables: () => [],
  initBuoys: () => [],
  initDateRange: () => [],
});

const store = inject("store");

const selectedBuoys = ref([...props.initBuoys]);
const selectedVariables = ref([...props.initVariables]);
const dateRange = ref(
  props.initDateRange.map((date) => {
    const dateParts = date
      .split("T")[0]
      .split("-")
      .map((val) => parseInt(val));
    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  })
);

// const disabled = computed(() => selectedVariables.value.length > 4 ||
//     selectedVariables.value.length === 0 ||
//     dateRange.value.length !== 2 ||
//     selectedBuoys.value.length === 0)

// const selectedDates = computed(() => {
//   try {
//     const isoDate = dateRange.value.map((date) => {
//       // convert to UTC from Local
//       return new Date(
//         Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
//       ).toISOString();
//     });
//     return { start: isoDate[0], end: isoDate[1] };
//   } catch (e) {
//     return null;
//   }
// })

// const selectedVariablesString = computed(() => selectedVariables.value.map((v) => v.name).join(','));
//
// const selectedBuoysString = computed(() => {
//   const bids = props.coordinates
//     .filter((r) => selectedBuoys.value.includes(r.fullName))
//     .map((r) => r.buoyId);
//   return bids.join(',');
// })

// const datasetPath = computed(() => `/datasets/${props.dataset}/dashboard`);

const disabledDate = (date) => {
  const utcDate = new Date(
    `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  );
  return utcDate < store.minDate || utcDate > store.maxDate;
};

// export default {
//   watch: {
//     initBuoys(cur) {
//       // for some reason (probably to do with computation graphs) initBuoys isn't always set
//       // on initial render, so we need to watch it and set if it comes in a little later
//       this.selectedBuoys = [...cur];
//     },
//     initVariables(cur) {
//       // for some reason (probably to do with computation graphs) initBuoys isn't always set
//       // on initial render, so we need to watch it and set if it comes in a little later
//       this.selectedVariables = [...cur];
//     },
//   },
// };
</script>
