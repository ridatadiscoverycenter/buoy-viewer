import { test, expect } from '@playwright/test';
import {
  fetchSamples,
  fetchTemperatures,
  fetchCoordinates,
  fetchInfo,
  fetchSpecies,
  fetchStations,
} from '@/utils/erddap/db';

test('fetchSamples', async () => {
  const samples = await fetchSamples();
  await expect(samples).toBeInstanceOf(Array);
  await expect(samples.length).toBeGreaterThan(0);
  const firstSample = samples[0];
  await expect(firstSample).toBeInstanceOf(Object);
  await expect(Object.keys(firstSample).sort()).toMatchObject(
    ['abun', 'animal', 'species', 'station', 'title', 'year'].sort()
  );
  const samplesWithYearParam = await fetchSamples([{ key: 'Year', comparator: '>', value: 2000 }]);
  await expect(samplesWithYearParam).toBeInstanceOf(Array);
  await expect(Math.min(...samplesWithYearParam.map(({ year }) => year))).toEqual(2001);
  const samplesWithStationParam = await fetchSamples([
    { key: 'Station', comparator: '=', value: 'Fox Island' },
  ]);
  await expect(samplesWithStationParam).toBeInstanceOf(Array);
  const stations = Array.from(new Set(samplesWithStationParam.map(({ station }) => station)));
  await expect(stations.length).toEqual(1);
  await expect(stations[0]).toEqual('Fox Island');
});

test('fetchSpecies', async () => {
  const species = await fetchSpecies();
  await expect(species).toBeInstanceOf(Array);
  await expect(species.length).toBeGreaterThan(0);
  await expect(typeof species[0]).toEqual('string');
});

test('fetchTemperatures', async () => {
  const temperatures = await fetchTemperatures();
  await expect(temperatures).toBeInstanceOf(Array);
  await expect(temperatures.length).toBeGreaterThan(0);
  await expect(temperatures[0]).toBeInstanceOf(Object);
  await expect(Object.keys(temperatures[0]).sort()).toMatchObject(
    ['bottomTemperature', 'surfaceTemperature', 'station', 'timestamp'].sort()
  );
  const temperaturesWithStationParams = await fetchTemperatures([
    { key: 'Station', comparator: '=', value: 'Fox Island' },
  ]);
  await expect(temperaturesWithStationParams).toBeInstanceOf(Array);
  const stations = Array.from(new Set(temperaturesWithStationParams.map(({ station }) => station)));
  await expect(stations.length).toEqual(1);
  await expect(stations[0]).toEqual('Fox Island');
  const dateMin = new Date('01/01/2000 12:00 AM');
  const temperaturesWithTimeParams = await fetchTemperatures([
    { key: 'time', comparator: '>', value: dateMin },
  ]);
  await expect(temperaturesWithTimeParams).toBeInstanceOf(Array);
  await expect(
    Math.min(...temperaturesWithTimeParams.map(({ timestamp }) => Number(timestamp)))
  ).toBeGreaterThan(Number(dateMin));
});

test('fetchStations', async () => {
  const stations = await fetchStations();
  await expect(stations).toBeInstanceOf(Array);
  await expect(typeof stations[0]).toEqual('string');
});

test('fetchCoordinates', async () => {
  const coordinates = await fetchCoordinates();
  await expect(coordinates).toBeInstanceOf(Array);
  await expect(coordinates[0]).toBeInstanceOf(Object);
  await expect(Object.keys(coordinates[0]).sort()).toMatchObject(
    ['latitude', 'longitude', 'stationName'].sort()
  );
});

test('fetchInfo', async () => {
  await expect(() => fetchInfo('sdlkfsdf')).rejects.toThrowError();
  expect(() => fetchInfo('lobster')).resolves;
  const lobsterInfo = await fetchInfo('lobster');
  await expect(lobsterInfo).toBeInstanceOf(Object);
  await expect(Object.keys(lobsterInfo).sort()).toMatchObject(['name', 'sciName'].sort());
});
