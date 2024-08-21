import { z } from 'zod';
import { getAnimalFromSpecies, getTitleFromSpecies } from '../shared';
import { Comparators, extractValues, queryErddapTable } from './db';
import { getDataForSpecies } from './fishData';

// API FUNCTIONS

/**
 * Helper function to fetch and format Fish Sample data.
 * @returns {Sample[]}
 * @throws {string} If any errors arise during the fetch or format process.
 */
export async function fetchSamples(params: SampleParams = '') {
  try {
    const samples = await querySamples(params);
    return formatSamples(samples);
  } catch (ex) {
    throw new Error(`An error occured while fetching Fish Samples. ${ex}`);
  }
}

/**
 * Helper function to fetch and format temperature data.
 * @returns {Temperature[]}
 */
export async function fetchTemperatures(params: TemperatureParams = '') {
  try {
    const temperatures = await queryTemperatures(params);
    return formatTemperatures(temperatures);
  } catch (ex) {
    throw new Error(`An error occured while fetching Temperature Data. ${ex}`);
  }
}

/**
 * "Fetches" coordinate data.
 * Note (AM): This is hardcoded in the ERDDAP API. The same values will be
 *            hard-coded here to match, but will not be "fetched".
 * https://github.com/ridatadiscoverycenter/buoy-api/blob/3826efc19ef6ea2026debccbaf57d312abacd7f6/app/routes/erddap/fish.js#L18C1-L21C3
 * @returns {Coordinate[]}
 */
export async function fetchCoordinates() {
  return Promise.resolve(COORDINATES);
}

/**
 * "Fetches" fish species data. 
 * Note (AM): This is hardcoded in the ERDDAP API. The JSON files used to 
 *            populate this query have been ported to fishData.ts.
 * @param species 
 * @returns 
 */
export async function fetchInfo(species: string) {
  return Promise.resolve(getDataForSpecies(species));
}

// COMPUTED FUNCTIONS

/**
 * Queries a list of all the species from ERDDAP.
 * @returns {string[]}
 */
export async function fetchSpecies() {
  const samples = await fetchSamples();
  return Array.from(new Set(samples.map(({ species }) => species))).sort();
}

export async function fetchStations() {
  const coordinates = await fetchCoordinates();
  return Array.from(new Set(coordinates.map(({ stationName }) => stationName))).sort();
}

export async function fetchBaseData() {
  const [coordinates, samples, temperatures] = await Promise.all([
    fetchCoordinates(),
    fetchSamples(),
    fetchTemperatures(),
  ]);
  return {
    coordinates,
    samples,
    temperatures,
  };
}

// QUERY FUNCTIONS

/**
 * Queries ERDDAP For Fish Sample Data.
 * @returns {SampleRow[]}
 */
async function querySamples(params: SampleParams = '') {
  const samples = extractValues(await queryErddapTable(FISH_DATASETS.catch, params));
  // Validate Formatted schema with Zod.
  if (dbRowIsSampleRow(samples)) {
    return samples;
  } else {
    throw new Error('ERDDAP sample data did not match expected sample schema');
  }
}

type SampleParams = string | Array<SampleParamYear | SampleParamStation>;
type SampleParamYear = { key: "Year", comparator: Comparators, value: number };
type SampleParamStation = { key: "Station", comparator: Comparators, value: "Fox Island" | "Whale Rock" };

/**
 * Queries ERDDAP for Buoy Temperature Data
 * @returns {TemperatureDbRow[]}
 */
async function queryTemperatures(params: TemperatureParams = '') {
  const temperatures = extractValues(await queryErddapTable(FISH_DATASETS.temp, params));
  // Validate Formatted schema with Zod.
  if (dbRowIsTemperatureRow(temperatures)) {
    return temperatures;
  } else {
    throw new Error('ERDDAP temperature data did not match expected temperature schema');
  }
}

type TemperatureParams = string | Array<TemperatureParamsTime | TemperatureParamsStation>;
type TemperatureParamsTime = { key: "time", comparator: Comparators, value: Date };
type TemperatureParamsStation = { key: "Station", comparator: Comparators, value: "Fox Island" | "Whale Rock" };

// FORMATTERS

/**
 * Formats database rows as useful JS objects.
 * @param samples
 * @returns {Sample[]}
 */
export function formatSamples(samples: SampleRow[]) {
  // Split each row into an object for each sample.
  const splitSamples = samples.map((sample) => {
    const { year, station } = sample;
    const speciesData = Object.entries(sample).filter(
      ([key]) => key !== 'year' && key !== 'station'
    ) as [Species, number][];
    return speciesData.map(
      ([species, abun]) =>
        ({
          year,
          station,
          species,
          abun,
          animal: getAnimalFromSpecies(species),
          title: getTitleFromSpecies(species),
        }) as Sample
    );
  });
  return splitSamples.reduce((prev, next) => prev.concat(next), []);
}

/**
 * Formats TemperatureRow as Temperature and applies that to the entire array.
 * @param {TemperatureRow[]} temperatures
 * @returns {Temperature[]}
 */
export function formatTemperatures(temperatures: TemperatureRow[]) {
  return temperatures.map(
    (temperature) =>
      ({
        station: temperature.station,
        bottomTemperature: temperature.bottomTemperature || undefined,
        surfaceTemperature: temperature.surfaceTemperature || undefined,
        timestamp: new Date(temperature.time),
      }) as Temperature
  );
}

// TYPES AND VALIDATORS

/**
 * Helper function to validate schema for returned Sample Data.
 * @param {unknown[]} samples
 * @returns {boolean}
 */
function dbRowIsSampleRow(samples: unknown[]): samples is SampleRow[] {
  try {
    z.array(ZodSampleRow).parse(samples);
    return true;
  } catch (ex) {
    console.error(ex);
    return false;
  }
}

/**
 * Helper function to validate schema for returned Sample Data.
 * @param {unknown[]} temperatures
 * @returns {boolean}
 */
function dbRowIsTemperatureRow(temperatures: unknown[]): temperatures is TemperatureRow[] {
  try {
    z.array(ZodTemperatureRow).parse(temperatures);
    return true;
  } catch (ex) {
    //console.error(ex);
    return false;
  }
}

// TYPES AND SCHEMAS

const FISH_DATASETS = {
  ysi: 'fish_trawl_79f9_f9fd_5a43',
  temp: 'fish_trawl_79f9_f9fd_5a42',
  catch: 'fish_trawl_3ce2_fedf_6833',
} as const;

type Coordinate = { stationName: string; longitude: number; latitude: number };

const COORDINATES: Coordinate[] = [
  { stationName: 'Whale Rock', longitude: -71.4208, latitude: 41.4395 },
  { stationName: 'Fox Island', longitude: -71.4186, latitude: 41.5542 },
] as const;

const SPECIES_NAMES = [
  'alosaSpp',
  'atlanticHerring',
  'bluefish',
  'butterfish',
  'cancerCrab',
  'cunner',
  'fourspotFlounder',
  'horseshoeCrab',
  'ladyCrab',
  'littleSkate',
  'lobster',
  'longFinnedSquid',
  'longhornedSculpin',
  'northernSearobin',
  'redHake',
  'scup',
  'seaStar',
  'silverHake',
  'spiderCrab',
  'stripedSearobin',
  'summerFlounder',
  'tautog',
  'weakfish',
  'windowpane',
  'winterFlounder',
] as const;

type Species = (typeof SPECIES_NAMES)[number];

type SampleRow = {
  year: number;
  station: string;
} & {
  [key in Species]: number | null;
};

type Sample = {
  year: number;
  station: string;
  species: Species;
  abun: number;
  animal: string;
  title: string;
};

type TemperatureRow = {
  time: string;
  station: string;
  surfaceTemperature: number | null;
  bottomTemperature: number | null;
};

type Temperature = {
  timestamp: Date;
  station: string;
  surfaceTemperature: number | undefined;
  bottomTemperature: number | undefined;
};

const ZodTemperatureRow = z.object({
  time: z.string().datetime(),
  station: z.string(),
  surfaceTemperature: z.union([z.number(), z.null()]),
  bottomTemperature: z.union([z.number(), z.null()]),
});

const ZodSampleRow = z.object({
  ...Object.fromEntries(SPECIES_NAMES.map((name) => [name, z.union([z.number(), z.null()])])),
  year: z.number(),
  station: z.string(),
});
