import {
  BuoyConfig,
  BuoyCoordinate,
  BuoyData,
  BuoyDataset,
  BuoySummary,
  BuoyVariable,
  FetchedBuoyCoordinate,
  FetchedBuoyDataset,
  FetchedBuoySummary,
} from '@/types';
import { erddapAPIGet } from './erddap';

const MODEL_LINEWIDTH = 0.8;
const MEASUREMENT_LINEWIDTH = 1.8;

export const CONFIG_NAMES = ['ri-buoy', 'osom', 'ma-buoy', 'plankton', 'buoy-telemetry'] as const;

export type BuoyConfigName = (typeof CONFIG_NAMES)[number];

export const CONFIG: { [key in BuoyConfigName]: BuoyConfig } = {
  'ri-buoy': {
    name: 'ri-buoy',
    route: 'buoy',
    datasetId: 'combined_e784_bee5_492e',
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: 'Historical',
  },
  osom: {
    name: 'osom',
    route: 'model',
    datasetId: 'model_data_77bb_15c2_6ab3',
    lineWidth: MODEL_LINEWIDTH,
    title: 'OSOM',
  },
  'ma-buoy': {
    name: 'ma-buoy',
    route: 'mabuoy',
    datasetId: 'ma_buoy_data_a6c9_12eb_1ec5',
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: 'Historical',
  },
  plankton: {
    name: 'plankton',
    route: 'plankton',
    datasetId: 'plankton_time_series_7615_c513_ef8e',
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: 'Plankton',
  },
  'buoy-telemetry': {
    name: 'buoy-telemetry',
    route: 'telemetry-raw',
    datasetId: 'buoy_telemetry_0ffe_2dc0_916e',
    lineWidth: MEASUREMENT_LINEWIDTH,
    title: 'Real Time',
  },
};

function getConfig(configName: BuoyConfigName) {
  return CONFIG[configName];
}

export async function fetchSummaryData(configName: BuoyConfigName, bustCache = false) {
  const config = getConfig(configName);
  const bustCacheParam = bustCache ? `?cacheBust=${Math.random()}` : '';
  const summary = await erddapAPIGet<FetchedBuoySummary[]>(
    `${config.route}/summary${bustCacheParam}`
  );
  return summary.map((summary) => {
    const formattedSummary: BuoySummary = {
      ...summary,
      stationName: summary.station_name,
      date: new Date(summary.time),
    };
    return formattedSummary;
  });
}

export async function fetchBuoyData(configName: BuoyConfigName) {
  const config = getConfig(configName);
  // Note (AM): Get a better sense of where this data comes from.
  const ids = undefined;
  const vars = undefined;
  const startDate = undefined;
  const endDate = undefined;
  const fetchedDataset = await erddapAPIGet<FetchedBuoyDataset>(
    `${config.route}/query?ids=${ids}&variables=${vars}&start=${startDate}&end=${endDate}`
  );
  const dataset: BuoyDataset = {
    downsampled: fetchedDataset.downsampled,
    data: fetchedDataset.data.map(
      (data) => ({ ...data, stationName: data.station_name }) as BuoyData
    ),
  };
  return dataset;
}

export async function fetchBuoyCoordinates(configName: BuoyConfigName) {
  const config = getConfig(configName);
  const coordinates = await erddapAPIGet<FetchedBuoyCoordinate[]>(`/${config.route}/coordinates`);
  return coordinates.map(
    (c) =>
      ({
        ...c,
        fullName: `${c.station_name} (${c.buoyId})`,
        stationName: c.station_name,
      }) as BuoyCoordinate
  );
  /*
    c.fullName = `${c.station_name} (${c.buoyId})`;
    this.coordinates = coordinates;
    const colorMap = useColorMap();
    colorMap.update({ ids: coordinates.map((v) => v.station_name) });
    */
}

export async function fetchBuoyVariables(configName: BuoyConfigName) {
  const config = getConfig(configName);
  const variables = await erddapAPIGet<BuoyVariable[]>(`/${config.route}/variables`);
  return variables.sort(({ name: varA }, { name: varB }) => varA.localeCompare(varB));
}

export async function fetchTimeRange(configName: BuoyConfigName) {
  const config = getConfig(configName);
  const { min, max } = await erddapAPIGet<{ min: number; max: number }>(
    `/${config.route}/timerange`
  );
  return { minDateRaw: new Date(min), maxDateRaw: new Date(max) };
}

export async function fetchBaseData(config: BuoyConfigName) {
  const [summary, coordinates, variables, timerange] = await Promise.all([
    fetchSummaryData(config),
    fetchBuoyCoordinates(config),
    fetchBuoyVariables(config),
    fetchTimeRange(config),
  ]);
  return { summary, coordinates, variables, timerange };
}

export async function fetchSiteCoordinates(config: BuoyConfigName, siteName: string) {
  const coordinates = await fetchBuoyCoordinates(config);
  const coordinatesWithSite = coordinates.filter(({ stationName }) => stationName === siteName);
  if (coordinatesWithSite.length > 0) {
    const { longitude, latitude } = coordinatesWithSite[0];
    return [longitude, latitude];
  } else throw new Error(`No coordinates found for "${siteName}" under config "${config}".`);
}
