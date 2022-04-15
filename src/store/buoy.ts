import { defineStore } from "pinia";
import { scaleSqrt, scaleDiverging } from "d3-scale";
import { interpolateTurbo } from "d3-scale-chromatic";

import {
  erddapGet,
  Summary,
  Variable,
  Coordinate,
  Dataset,
} from "../utils/erddap";

import { useColorMap } from "./colorMap";
import { localISODate } from "../utils/utils";

const MODEL_LINEWIDTH = 0.8;
const MEASUREMENT_LINEWIDTH = 1.8;

const CONFIG = {
  "ri-buoy": {
    name: "ri-buoy",
    route: "buoy",
    datasetId: "combined_e784_bee5_492e",
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: "Historical",
  },
  osom: {
    name: "osom",
    route: "model",
    datasetId: "model_data_77bb_15c2_6ab3",
    lineWidth: MODEL_LINEWIDTH,
    title: "OSOM",
  },
  "ma-buoy": {
    name: "ma-buoy",
    route: "mabuoy",
    datasetId: "ma_buoy_data_a6c9_12eb_1ec5",
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: "Historical",
  },
  plankton: {
    name: "plankton",
    route: "plankton",
    datasetId: "plankton_time_series_7615_c513_ef8e",
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: "Plankton",
  },
  "buoy-telemetry": {
    name: "buoy-telemetry",
    route: "telemetry-raw",
    datasetId: "buoy_telemetry_0ffe_2dc0_916e",
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: "Real Time",
  },
};

interface BuoyConfig {
  name: string;
  route: string;
  datasetId: string;
  lineWidth: number;
  title: string;
}

interface BuoyState extends BuoyConfig {
  coordinates: Coordinate[];
  summary: Summary[];
  variables: Variable[];
  minDateRaw: Date;
  maxDateRaw: Date;
}

const createStore = (config: BuoyConfig, bustCache = false) => {
  const { route, name } = config;
  return defineStore(name, {
    state: (): BuoyState => {
      return {
        ...config,
        coordinates: [],
        summary: [],
        variables: [],
        minDateRaw: new Date(0),
        maxDateRaw: new Date(),
      };
    },
    actions: {
      // fetch the summary for the heatmaps
      async fetchSummaryData() {
        // assign to intermediate variable for performance while updating date/time data
        const summary = await erddapGet(
          `/${route}/summary${bustCache ? "?cacheBust=" + Math.random() : ""}`
        );
        this.summary = summary.map((d) => ({ date: new Date(d.time), ...d }));
      },

      // just fetch data, don't save anything
      async fetchBuoyData({ ids, variables, start, end }): Promise<Dataset> {
        const startDate = start || this.minDate;
        const endDate = end || this.maxDate;
        return await erddapGet(
          `/${route}/query?ids=${ids}&variables=${variables}&start=${startDate}&end=${endDate}`
        );
      },

      // fetch all of the buoy coordinates
      async fetchBuoyCoordinates() {
        const coordinates = await erddapGet(`/${route}/coordinates`);
        coordinates.forEach((c) => {
          c.fullName = `${c.station_name} (${c.buoyId})`;
        });
        this.coordinates = coordinates;
        const colorMap = useColorMap();
        colorMap.update({ ids: coordinates.map((v) => v.station_name) });
      },

      // fetch all of the buoy variables
      async fetchBuoyVariables(): Promise<void> {
        const variables = await erddapGet(`/${route}/variables`);
        variables.sort((a, b) =>
          a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
        );
        this.variables = variables;
      },

      // fetch the min/max date for the dataset
      async fetchTimeRange(): Promise<void> {
        const { min, max } = await erddapGet(`/${route}/timerange`);
        this.minDateRaw = new Date(min);
        this.maxDateRaw = new Date(max);
      },

      // fetch the base data in one call if not already loaded
      async fetchBaseData(): Promise<void> {
        if (this.summary.length === 0) {
          await Promise.all([
            this.fetchSummaryData(),
            this.fetchBuoyCoordinates(),
            this.fetchBuoyVariables(),
            this.fetchTimeRange(),
          ]);
        }
      },
    },
    getters: {
      dates(): Date[] {
        // unique sorted dates
        return this.samples
          .map(({ date }) => date)
          .filter((v, i, a) => a.indexOf(v) === i)
          .sort((f, s) => f.valueOf() - s.valueOf());
      },
      minDate(): string {
        return localISODate(this.minDateRaw);
      },
      maxDate(): string {
        return localISODate(this.maxDateRaw);
      },
      siteCoordinates() {
        return function (site: string) {
          const match = this.coordinates.find(
            ({ station_name }) => station_name === site
          );
          if (match) {
            return [match.longitude, match.latitude];
          } else {
            return [0, 0];
          }
        };
      },
      selectedSamples() {
        const daySamples = this.samples.filter(
          ({ date }) => date - this.maxDate === 0
        );

        const domain = [0, this.hydrocatTemperature];
        const sqrtScale = scaleSqrt().domain(domain).range([0.2, 1]);

        const colorScale = scaleDiverging()
          .domain([0, 20, 1])
          .interpolator(interpolateTurbo)
          .clamp(true);

        const getColor = (val) => {
          return val <= 0 ? "rgb(67, 163, 65)" : colorScale(val);
        };

        return daySamples.map((row) => {
          return {
            ...row,
            color: getColor(row.hydrocatTemperature),
            size: sqrtScale(row.hydrocatTemperature),
          };
        });
      },
      startDate() {
        return this.dates[0];
      },
      endDate() {
        return this.dates.slice(-1)[0];
      },
      dateLength() {
        return (this.endDate - this.startDate) / 1000 / 60 / 60 / 24;
      },
    },
  });
};

export type BuoyStore = ReturnType<ReturnType<typeof createStore>>;

export const buoyStores = {
  "ri-buoy": { useStore: createStore(CONFIG["ri-buoy"]) },
  "ma-buoy": { useStore: createStore(CONFIG["ma-buoy"]) },
  osom: { useStore: createStore(CONFIG["osom"]) },
  plankton: { useStore: createStore(CONFIG["plankton"]) },
  "buoy-telemetry": { useStore: createStore(CONFIG["buoy-telemetry"], true) },
};
