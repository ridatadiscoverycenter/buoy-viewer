import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { erddapApi } from '@/utils/erddap';
import type { BuoyConfigName } from '@/utils/erddap/api/bouy';

const { erddapGet, fish, buoy, domoicAcid } = erddapApi;

function doFetch(fetchFunction: Promise<unknown>) {
  fetchFunction.then((data) => console.log(JSON.stringify(data, null, 2))).catch(console.error);
}

yargs(hideBin(process.argv))
  .command(
    'url [path]',
    'access a custom url',
    (yargs) => {
      return yargs.positional('path', {
        describe: 'erddap resource path (ex: `fish/species`)',
        default: '',
      });
    },
    ({ path }) => {
      console.log(`Fetching data from "${path}"`);
      erddapGet(path).then(console.log).catch(console.error);
    }
  )
  // FISH COMMANDS
  .command(
    'fish-basedata',
    'Fetches fish base data.',
    (y) => y,
    () => doFetch(fish.fetchBaseData())
  )
  .command(
    'fish-coordinates',
    'Fetches fish coordinate data.',
    (y) => y,
    () => doFetch(fish.fetchCoordinates())
  )
  .command(
    'fish-info [species]',
    'Fetches fish info.',
    {
      species: {
        type: 'string',
        alias: 's',
        description: 'Species name for the fish being queried.',
        required: true,
      },
    },
    ({ species }) => doFetch(fish.fetchInfo(species))
  )
  .command(
    'fish-species',
    'Fetches fish species data.',
    (y) => y,
    () => doFetch(fish.fetchSpecies())
  )
  .command(
    'fish-samples',
    'Fetches fish samples.',
    (y) => y,
    () => doFetch(fish.fetchSamples())
  )
  .command(
    'fish-stations',
    'Fetches fish stations.',
    (y) => y,
    () => doFetch(fish.fetchStations())
  )
  .command(
    'fish-temperatures',
    'Fetches fish temperature data.',
    (y) => y,
    () => doFetch(fish.fetchTemperatures())
  )
  // BUOY COMMANDS
  .command(
    'buoy-variables [config]',
    'Fetches buoy variable data for a specified config.',
    { config: { description: 'Category of Buoy.', required: true, choices: buoy.CONFIG_NAMES } },
    ({ config }) => doFetch(buoy.fetchBuoyVariables(config as BuoyConfigName))
  )
  .command(
    'buoy-coordinates [config]',
    'Fetches coordinates for a specified buoy config.',
    { config: { description: 'Category of Buoy.', required: true, choices: buoy.CONFIG_NAMES } },
    ({ config }) => doFetch(buoy.fetchBuoyCoordinates(config as BuoyConfigName))
  )
  .command(
    'buoy-data [config]',
    'Fetches buoy data for a specified buoy config.',
    { config: { description: 'Category of Buoy.', required: true, choices: buoy.CONFIG_NAMES } },
    ({ config }) => doFetch(buoy.fetchBuoyData(config as BuoyConfigName))
  )
  .command(
    'buoy-summary [config]',
    'Fetches buoy summary for a specified buoy config.',
    { config: { description: 'Category of Buoy.', required: true, choices: buoy.CONFIG_NAMES } },
    ({ config }) => doFetch(buoy.fetchSummaryData(config as BuoyConfigName))
  )
  .command(
    'buoy-time-range [config]',
    'Fetches a time range for a specified buoy config.',
    { config: { description: 'Category of Buoy.', required: true, choices: buoy.CONFIG_NAMES } },
    ({ config }) => doFetch(buoy.fetchTimeRange(config as BuoyConfigName))
  )
  .command(
    'buoy-all [config]',
    'Fetches all data for a specified buoy config.',
    { config: { description: 'Category of Buoy.', required: true, choices: buoy.CONFIG_NAMES } },
    ({ config }) => doFetch(buoy.fetchBaseData(config as BuoyConfigName))
  )
  .command(
    'buoy-site-coordinates [config] [siteName]',
    'Fetches all data for a specified buoy config.',
    {
      config: { description: 'Category of Buoy.', required: true, choices: buoy.CONFIG_NAMES },
      siteName: {
        type: 'string',
        description: 'Name of the site under the specified config.',
        required: true,
      },
    },
    ({ config, siteName }) => doFetch(buoy.fetchSiteCoordinates(config as BuoyConfigName, siteName))
  )
  // DOMOIC ACID COMMANDS
  .command('da-data', 'Fetches all domoic acid data.', {}, () =>
    doFetch(domoicAcid.fetchBaseData())
  )
  .command('da-coordinates', 'Fetches domoic acid coordinate data.', {}, () =>
    doFetch(domoicAcid.fetchCoordinates())
  )
  .command('da-samples', 'Fetches domoic acid sample data.', {}, () =>
    doFetch(domoicAcid.fetchSamples())
  )
  .command(
    'da-selected-date',
    'Fetches the selected date for the domoic acid sample data.',
    {},
    () => doFetch(domoicAcid.fetchSelectedDate())
  )
  .demandCommand(1)
  .parse();
