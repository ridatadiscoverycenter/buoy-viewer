export type BuoyCoordinateBase = {
  buoyId: string;
  latitude: number;
  longitude: number;
};
export type FetchedBuoyCoordinate = BuoyCoordinateBase & {
  station_name: string;
};
export type BuoyCoordinate = BuoyCoordinateBase & {
  stationName: string;
  fullName: string;
};

export type BaseBuoySummaryStatic = {
  time: string;
  date: Date;
};
export type FetchedBuoySummaryStatic = BaseBuoySummaryStatic & { station_name: string };
export type BuoySummaryStatic = BaseBuoySummaryStatic & { stationName: string };
export type FetchedBuoySummary = FetchedBuoySummaryStatic & {
  [key: string]: number;
};
// Note (AM): According to the original code, all dynamic data is a number, but specifying that causes errors during the fetching process src/utils/erddap/bouy.ts.
export type BuoySummary = BuoySummaryStatic & {
  [key: string]: string | number | Date;
};

export type BuoyVariable = {
  name: string;
  units?: string;
};

export type BuoyConfig = {
  name: string;
  route: string;
  datasetId: string;
  lineWidth: number;
  title: string;
};

export type BuoyState = BuoyConfig & {
  coordinates: BuoyCoordinate[];
  summary: BuoySummary[];
  variables: BuoyVariable[];
  minDateRaw: Date;
  maxDateRaw: Date;
};

export type BaseBuoyData = {
  variable: string;
  value: number;
  time: string;
  units?: string;
};

export type FetchedBuoyData = BaseBuoyData & {
  station_name: string;
};
export type BuoyData = BaseBuoyData & {
  stationName: string;
};

export type FetchedBuoyDataset = {
  data: FetchedBuoyData[];
  downsampled: boolean;
};

export type BuoyDataset = {
  data: BuoyData[];
  downsampled: boolean;
};
