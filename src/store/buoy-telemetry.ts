import { defineStore } from "pinia";

import { Variable } from "../utils/erddap";
import { useColorMap } from "./colorMap";

// ======= TYPES AND CONSTANTS =======
const STATIONS = ["Buoy-620", "Buoy-720", "Castle_Hill"] as const;
type StationName = typeof STATIONS[number];

interface Coordinate {
  station_name: StationName;
  latitude: number;
  longitude: number;
}

interface State {
  name: string;
  route: string;
  coordinates: Coordinate[];
  datasetId: string;
  variables: Variable[];
}

// ====== API HELPER FUNCTIONS ======
import axios from "axios";

const telemetryAxios = axios.create({
  baseURL:
    ((import.meta.env.VITE_RIDDC_API_BASEURL as string | false) ||
      "https://api.riddc.brown.edu") + "/telemetry",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const telemetryGet = async (path: string) => {
  const response = await telemetryAxios.get(path);
  if (response.status !== 200) {
    throw new Error(`Error fetching data from ERDDAP: ${path}`);
  }

  return response.data;
};

// ====== STORE DEFINITION =======
export const useBuoyTelemetryStore = defineStore("buoy-telemetry", {
  state: (): State => {
    return {
      name: "buoy-telemetry",
      route: "telemetry-raw",
      datasetId: "buoy_telemetry_0ffe_2dc0_916e",
      coordinates: [],
      variables: [],
    };
  },
  actions: {
    // fetch all of the buoy locations
    async fetchCoordinates() {
      this.coordinates = await Promise.all(
        STATIONS.map(async (station_name) => {
          const res = await telemetryGet(`/${station_name}/GPSData/lastone`);
          const { Latitude: latitude, Longitude: longitude } = res[0];
          return { station_name, latitude, longitude };
        })
      );

      const colorMap = useColorMap();
      colorMap.update({ ids: this.stations, unique: false });
    },

    async fetchBaseData(): Promise<void> {
      if (this.coordinates.length === 0) {
        await Promise.all([this.fetchCoordinates()]);
      }
    },
  },
  getters: {
    stations(): string[] {
      return this.coordinates.map(({ station_name }) => station_name).sort();
    },
  },
});

export type BuoyTelemetryStore = ReturnType<typeof useBuoyTelemetryStore>;
