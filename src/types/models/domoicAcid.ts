export type DomoicAcidCoordinateBase = {
  longitude: number;
  latitude: number;
};

export type DomoicAcidFetchedCoordiate = DomoicAcidCoordinateBase & { station_name: string };

export type DomoicAcidCoordiate = DomoicAcidCoordinateBase & { stationName: string };

export type BaseDomoicAcidSample = {
  pDA: number;
  normDA: number;
};
export type FetchedDomoicAcidSample = BaseDomoicAcidSample & { station_name: string; date: string };
export type DomoicAcidSample = BaseDomoicAcidSample & { stationName: string; date: Date };
