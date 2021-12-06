import axios from "axios";

import { useColorMap } from "@/store/colorMap.ts";

const erddapAxios = axios.create({
  baseURL:
    import.meta.env.RIDDC_API_BASEURL || "https://api.riddc.brown.edu/erddap",
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
});

const erddapGet = async (path) => {
  const response = await erddapAxios.get(path);
  if (response.status !== 200) {
    throw new Error(`Error fetching data from ERDDAP: ${path}`);
    return;
  }

  return response.data;
};

export interface Data {
  variable: string;
  value: number;
  station_name: string;
  time: string;
  units: string | null;
}

export interface Coordinate {
  station_name: string;
  buoyId: string;
  fullName: string;
  latitude: number;
  longitude: number;
}

export interface Summary {
  station_name: string;
  time: string;
  date: Date;
  [key: string]: number;
}

export interface Variable {
  name: string;
  units: string | null;
}

interface BuoyState {
  data: Data[];
  coordinates: Coordinate[];
  summary: Summary[];
  variables: Variables[];
  datasetId: string;
  minDate: Date;
  maxDate: Date;
  downsampled: boolean;
}

export const initState =
  (datasetId: string): BuoyState =>
  () => {
    return {
      data: [],
      coordinates: [],
      summary: [],
      variables: [],
      datasetId,
      minDate: new Date(0),
      maxDate: new Date(),
      downsampled: false,
    };
  };

// not a fat arrow function so the `this` will refer to the pinia instance
export function baseActions(route) {
  return {
    async fetchSummaryData() {
      this.summary = await erddapGet(`/${route}/summary`);
      let minDate = new Date();
      let maxDate = new Date(0);
      this.summary.map((d) => {
        d.date = new Date(d.time);
        if (d.date < minDate) {
          minDate = d.date;
        }
        if (d.date > maxDate) {
          maxDate = d.date;
        }
        return d;
      });
      this.minDate = minDate;
      this.maxDate = maxDate;
    },
    async fetchBuoyData({ ids, variables, start, end }) {
      const startDate = start || this.minDate;
      const endDate = end || this.maxDate;
      const { data, downsampled } = await erddapGet(
        `/${route}/query?ids=${ids}&variables=${variables}&start=${startDate}&end=${endDate}`
      );
      this.downsampled = downsampled;
      this.data = data;
    },
    async fetchBuoyCoordinates() {
      const coordinates = await erddapGet(`/${route}/coordinates`);
      coordinates.forEach((c) => {
        c.fullName = `${c.station_name} (${c.buoyId})`;
      });
      this.coordinates = coordinates;
      const colorMap = useColorMap();
      colorMap.update({ ids: coordinates.map((v) => v.station_name) });
    },
    async fetchBuoyVariables() {
      const variables = await erddapGet(`/${route}/variables`);
      variables.sort((a, b) =>
        a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
      );
      this.variables = variables;
    },
    async fetchBaseData() {
      if (this.coordinates.length === 0) {
        await Promise.all([
          this.fetchSummaryData(),
          this.fetchBuoyCoordinates(),
          this.fetchBuoyVariables(),
        ]);
      }
    },
  };
}

export const baseGetters = {
  buoys: (state) => state.coordinates.map((c) => c.fullName),
};
