import { defineStore } from "pinia";

import { initState, baseActions, baseGetters } from "@/utils/erddap.ts";

const ROUTE = "model";
const DATASET_ID = "model_data_77bb_15c2_6ab3";

export const useModel = defineStore("model", {
  state: initState(DATASET_ID),
  actions: {
    ...baseActions(ROUTE),
  },
  getters: {
    ...baseGetters,
  },
});
