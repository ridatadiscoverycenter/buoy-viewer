import { defineStore } from "pinia";

import { initState, baseActions, baseGetters } from "@/utils/store.ts";

const ROUTE = "buoy";
const DATASET_ID = "combined_e784_bee5_492e";

export const useRIBuoy = defineStore("buoy", {
  state: initState(DATASET_ID),
  actions: {
    ...baseActions(ROUTE),
  },
  getters: {
    ...baseGetters,
  },
});
