import { defineStore } from "pinia";
import { scaleSqrt, scaleDiverging } from "d3-scale";
import { interpolateTurbo } from "d3-scale-chromatic";

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
  selectedDate: Date;
}

export const useDAStore = defineStore("domoic-acid", {
  state: (): State => {
    return {
      name: "domoic-acid",
      route: "da",
      coordinates: [],
      samples: [],
      selectedDate: new Date(),
    };
  },
  actions: {
    async fetchCoordinates() {
      this.coordinates = (await erddapGet("/das/coordinates")) as Coordinate[];
    },
    async fetchSamples() {
      const samples = await erddapGet("/da/samples");
      samples.forEach((s) => {
        s.date = new Date(s.date);
      });
      this.samples = samples;
      this.selectedDate = this.dates[0];
    },
    async fetchBaseData(): Promise<void> {
      if (this.coordinates.length === 0) {
        await Promise.all([this.fetchCoordinates(), this.fetchSamples()]);
      }
    },
  },
  getters: {
    dates(): Date[] {
      return [...new Set(this.samples.map(({ date }) => date))].sort(
        (f, s) => f.valueOf() - s.valueOf()
      );
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
    activeCoordinates(): Coordinate[] {
      const activeSites = this.samples.map(({ station_name }) => station_name);
      return this.coordinates.filter(({ station_name }) =>
        activeSites.includes(station_name)
      );
    },
    maxDA() {
      return Math.max(...this.samples.map(({ pDA }) => pDA));
    },
    selectedSamples() {
      const daySamples = this.samples.filter(
        ({ date }) => date - this.selectedDate === 0
      );

      const domain = [0, this.maxDA];
      const sqrtScale = scaleSqrt().domain(domain).range([0.2, 1]);

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
