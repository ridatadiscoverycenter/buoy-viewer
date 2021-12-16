import axios from "axios";

import { useColorMap } from "@/store/colorMap.ts";

const erddapAxios = axios.create({
  baseURL:
    import.meta.env.VITE_RIDDC_API_BASEURL ||
    "https://api.riddc.brown.edu/erddap",
  headers: {
    common: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
});

const erddapGet = async (path: string) => {
  const response = await erddapAxios.get(path);
  if (response.status !== 200) {
    throw new Error(`Error fetching data from ERDDAP: ${path}`);
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
  minDate: Date;
  maxDate: Date;
}

export const initState =
  (config): BuoyState =>
  () => {
    return {
      ...config,
      data: [],
      coordinates: [],
      summary: [],
      variables: [],
      minDate: new Date(0),
      maxDate: new Date(),
      downsampled: false,
      initialized: false,
    };
  };

// not a fat arrow function so the `this` will refer to the pinia instance
export function baseActions(route: string) {
  return {
    // fetch the summary for the heatmaps
    async fetchSummaryData() {
      console.log("fetching summary");
      this.summary = await erddapGet(`/${route}/summary`);
      console.log("got summary");
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

      console.log("fetched summary data");
    },

    // just fetch data, don't save anything
    async fetchBuoyData({ ids, variables, start, end }): Promise<Data[]> {
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

      console.log("fetched coordinate data");
    },

    // fetch all of the buoy variables
    async fetchBuoyVariables(): Promise<void> {
      const variables = await erddapGet(`/${route}/variables`);
      variables.sort((a, b) =>
        a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
      );
      this.variables = variables;

      console.log("fetched variables data");
    },

    // fetch the base data in one call if not already loaded
    async fetchBaseData(): Promise<void> {
      if (this.coordinates.length === 0) {
        await Promise.all([
          this.fetchSummaryData(),
          this.fetchBuoyCoordinates(),
          this.fetchBuoyVariables(),
        ]);

        this.initialized = true;
      }
    },
  };
}

export const baseGetters = {
  buoys: (state) => state.coordinates.map((c) => c.fullName),
};
