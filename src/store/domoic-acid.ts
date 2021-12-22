import { defineStore } from "pinia";

import { erddapGet } from "@/utils/erddap.ts";

interface Coordinate {
  station_name: string;
  longitude: number;
  latitude: number;
}

interface Sample {
  date: Date;
  station_name: string;
  pDA: number;
  normDA: number;
}

interface State {
  name: string;
  route: string;
  coordinates: Coordinate[];
  samples: Sample[];
}

export const useDAStore = defineStore("domoic-acid", {
  state: (): State => {
    return {
      name: "domoic-acid",
      route: "da",
      coordinates: [],
      samples: [],
    };
  },
  actions: {
    async fetchCoordinates() {
      this.coordinates = (await erddapGet("/da/coordinates")) as Coordinate[];
    },
    async fetchSamples() {
      const samples = await erddapGet("/da/samples");
      samples.forEach((s) => {
        s.date = new Date(s.date);
      });
      this.samples = samples;
    },
    async fetchBaseData(): Promise<void> {
      if (this.coordinates.length === 0) {
        await Promise.all([this.fetchCoordinates(), this.fetchSamples()]);
      }
    },
  },
  getters: {
    dates(): Date[] {
      return [...new Set(this.samples.map((s) => s.date))].sort(
        (f, s) => f - s
      );
    },
    siteCoordinates: (state) => (site: string) => {
      const match = state.coordinates.find(
        ({ station_name }) => station_name === site
      );
      if (match) {
        return [match.longitude, match.latitude];
      } else {
        return [0, 0];
      }
    },
    activeCoordinates() {
      const activeSites = this.samples.map(({ station_name }) => station_name);
      return this.coordinates.filter(({ station_name }) =>
        activeSites.includes(station_name)
      );
    },
    selectedSamples: (state, getters) => {
      const daySamples = state.samples.filter(
        (sample) => sample.date - state.selectedDate === 0
      );

      const domain = [0, getters.maxDA];
      const sqrtScale = scaleSqrt().domain(domain).range([10, 50]);

      const colorScale = scaleDiverging()
        .domain([-100, -0.4, 1])
        .interpolator(interpolateTurbo)
        .clamp(true);

      const getColor = (val) => {
        return val <= 0 ? "rgb(67, 163, 65)" : colorScale(val);
      };

      return daySamples.map((row) => {
        return {
          ...row,
          color: getColor(row.normDA),
          size: sqrtScale(row.pDA),
        };
      });
    },
    selectedSamplesGeoJSON: (state, getters) => {
      const daySamples = getters.selectedSamples;
      const rows = daySamples.map((row) => {
        return {
          type: "Feature",
          properties: {
            date: row.date,
            site: row.station_name,
            da: row.pDA,
            norm_da: row.normDA,
            color: row.color,
            size: row.size,
          },
          geometry: {
            type: "Point",
            coordinates: getters.siteCoordinates(row.station_name),
          },
        };
      });
      return {
        type: "geojson",
        data: {
          id: "buoy",
          type: "FeatureCollection",
          features: rows,
        },
      };
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
