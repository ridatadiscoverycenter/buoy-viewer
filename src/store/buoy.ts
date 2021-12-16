import { defineStore } from "pinia";

import { initState, baseActions, baseGetters } from "@/utils/erddap.ts";

const MODEL_LINEWIDTH = 0.8;
const MEASUREMENT_LINEWIDTH = 1.8;

const config = [
  {
    name: "ri-buoy",
    route: "buoy",
    datasetId: "combined_e784_bee5_492e",
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: "Historial",
  },
  {
    name: "osom",
    route: "model",
    datasetId: "model_data_77bb_15c2_6ab3",
    lineWidth: MODEL_LINEWIDTH,
    title: "OSOM",
  },
  {
    name: "ma-buoy",
    route: "mabuoy",
    datasetId: "ma_buoy_data_a6c9_12eb_1ec5",
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: "Historial",
  },
  {
    name: "plankton",
    route: "plankton",
    datasetId: "plankton_time_series_7615_c513_ef8e",
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: "Plankton",
  },
];

export const buoyStores = config.reduce((obj, val) => {
  const useStore = defineStore(val.name, {
    state: initState(val),
    actions: baseActions(val.route),
    getters: baseGetters,
  });
  return { ...obj, [val.name]: { ...val, useStore } };
}, {});
