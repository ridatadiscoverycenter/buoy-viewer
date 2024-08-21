import {
  DomoicAcidCoordiate,
  DomoicAcidFetchedCoordiate,
  DomoicAcidSample,
  FetchedDomoicAcidSample,
} from '@/types';
import { erddapAPIGet } from './erddap';

export async function fetchCoordinates() {
  const coordinates = await erddapAPIGet<DomoicAcidFetchedCoordiate[]>('/da/coordinates');
  return coordinates.map((c) => ({ ...c, stationName: c.station_name }) as DomoicAcidCoordiate);
}

export async function fetchSamples() {
  const fetchedSamples = await erddapAPIGet<FetchedDomoicAcidSample[]>('/da/samples');
  const samples = fetchedSamples.map(
    (s) => ({ ...s, date: new Date(s.date), stationName: s.station_name }) as DomoicAcidSample
  );
  return { samples, selectedDate: getDatesFromSamples(samples)[0] };
}

export async function fetchSelectedDate() {
  const { selectedDate } = await fetchSamples();
  return selectedDate;
}

function getDatesFromSamples(samples: DomoicAcidSample[]) {
  return Array.from(new Set(samples.map(({ date }) => date))).sort();
}

export async function fetchBaseData() {
  const [coordinates, { samples, selectedDate }] = await Promise.all([
    fetchCoordinates(),
    fetchSamples(),
  ]);
  return { coordinates, samples, selectedDate };
}
