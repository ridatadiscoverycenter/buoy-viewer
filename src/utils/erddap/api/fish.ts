import {
  FetchedFishCoordinate,
  FetchedTemperature,
  FishCoordinate,
  Info,
  Sample,
  SampleBase,
  StationName,
  Temperature,
} from '@/types';
import { getAnimalFromSpecies } from '../shared';
import { erddapAPIGet } from './erddap';

/**
 * Fetches Coordinate information from ERDDAP.
 * @returns {Promise<FishCoordinate[]>}
 */
export async function fetchCoordinates() {
  const coordinates = await erddapAPIGet<FetchedFishCoordinate[]>('fish/coordinates');
  return coordinates.map(
    (coordinate) => ({ ...coordinate, stationName: coordinate.station_name }) as FishCoordinate
  );
}

/**
 * Fetches Sample information from ERDDAP and computes an animal name
 * @returns {Promise<Sample[]>}
 */
export async function fetchSamples() {
  const rawSamples = await erddapAPIGet<SampleBase[]>('fish/species');
  return rawSamples.map(
    (sample) => ({ ...sample, animal: getAnimalFromSpecies(sample.species) }) as Sample
  );
}

/**
 * Alias for fetchTemperatures (backwards compatible).
 * @returns {Promise<Temperature[]>}
 */
export async function fetchTemps() {
  return fetchTemperatures();
}

/**
 * Fetches Temperature information from ERDDAP.
 * @returns {Promise<Temperature[]>}
 */
export async function fetchTemperatures() {
  const temperatures = await erddapAPIGet<FetchedTemperature[]>('fish/temps');
  return temperatures.map(
    (temperature) =>
      ({
        ...temperature,
        station: temperature.Station,
        timestamp: new Date(temperature.year_month),
        year: new Date(temperature.year_month).getUTCFullYear(),
        meanTemp: temperature.mean_temp,
        monthlyMean: temperature.monthly_mean,
      }) as Temperature
  );
}

export async function fetchInfo(species: string) {
  const speciesInfo = await erddapAPIGet<Info>(`/fish/info/${species}`);
  return speciesInfo;
}

/**
 * Fetches coordinate, sample, and temperature information.
 * @returns {Promise<{coordinates: Coordinate[], samples: Sample[], temperatures: Temperature[]}>}
 */
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

/**
 * Fetch coordinate information and returns a list of unique stations in alphabetic order.
 * @returns {Promise<StationName[]>}
 */
export async function fetchStations() {
  const coordinates = await fetchCoordinates();
  return Array.from(new Set<StationName>(coordinates.map(({ stationName }) => stationName))).sort();
}

/**
 * Fetch sample data and return a list of unique species in alphabetic order.
 * @returns {Promise<string[]>}
 */
export async function fetchSpecies() {
  const samples = await fetchSamples();
  return Array.from(new Set(samples.map(({ title }) => title))).sort();
}
