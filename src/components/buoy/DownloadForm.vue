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
        class="button is-primary control-item-button"
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
import { inject, ref } from "vue";

import Multiselect from "vue-multiselect";

import BaseForm from "@/components/base/BaseForm.vue";

import { formatVariable } from "@/utils/utils.ts";
import { useErddapDownload } from "@/composables/useErddapDownload.ts";

const store = inject("store");

const fileFormat = ref("json");
const downloadBuoys = ref([]);
const downloadVariables = ref([]);

const { FILE_FORMATS, downloadUrl } = useErddapDownload({
  datasetId: store.datasetId,
  variables: downloadVariables,
  coordinates: downloadBuoys,
  fileFormat,
});
</script>
