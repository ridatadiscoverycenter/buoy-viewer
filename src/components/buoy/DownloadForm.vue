<template>
  <BaseForm>
    <template #inputs>
      <div class="control-item">
        <label for="file-format" class="label">File Format</label>
        <multiselect
          id="file-format"
          v-model="fileFormat"
          class="multiselect"
          :options="FILE_FORMATS"
          :preselect-first="true"
          :allow-empty="false"
        />
      </div>

      <div class="control-item">
        <label for="buoy-id" class="label">Buoys</label>
        <multiselect
          id="buoy-id"
          v-model="downloadBuoys"
          class="multiselect"
          :options="store.buoys"
          :multiple="true"
        />
      </div>

      <div class="control-item">
        <label for="variable-select-download" class="label">Variables</label>
        <multiselect
          id="variable-select-download"
          v-model="downloadVariables"
          class="multiselect"
          :options="store.variables"
          :custom-label="formatVariable"
          track-by="name"
          :multiple="true"
        />
      </div>
    </template>

    <template #buttons>
      <a
        role="button"
        class="button is-link control-item-button"
        :href="downloadUrl"
        :disabled="
          downloadBuoys.length === 0 ||
          downloadVariables.length === 0 ||
          !fileFormat
        "
        >Download Data</a
      >
    </template>
  </BaseForm>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";

import Multiselect from "vue-multiselect";

import BaseForm from "@/components/base/BaseForm.vue";

import { formatVariable } from "@/utils/utils.ts";

const store = inject("store");

const FILE_FORMATS = [
  "htmlTable",
  "csv",
  "json",
  "nc",
  "geoJson",
  "mat",
  "xhtml",
  "graph",
  "tsv",
  "html",
  "dataTable",
];
const ERDDAP_BASE_URL = "https://pricaimcit.services.brown.edu/erddap";

const fileFormat = ref("json");
const downloadBuoys = ref([]);
const downloadVariables = ref([]);

const downloadUrl = computed(() => {
  const bids = store.coordinates
    .filter((r) => downloadBuoys.value.includes(r.fullName))
    .map((r) => r.buoyId);

  return `${ERDDAP_BASE_URL}/tabledap/${store.datasetId}.${
    fileFormat.value
  }?${downloadVariables.value
    .map((v) => v.name)
    .join(
      ","
    )},time,latitude,longitude,station_name&station_name=~"(${bids.join(
    "|"
  )})"`;
});
</script>
