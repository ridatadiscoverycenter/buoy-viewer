import { erddapDb } from '@/utils/erddap';

erddapDb
  .fetchTemperatures()
  .then((d) => console.log(JSON.stringify(d[0], null, 2)))
  .catch(console.error);

/*const baseURL =
  process.env.BUOY_API_ERDDAP_URL ?? 'https://pricaimcit.services.brown.edu/erddap/tabledap';

const DA_DATASETS = {
  da: 'da_4566_36f0_124a',
  location: 'da_3691_b8df_31d7',
};

const FISH_DATASETS = {
  ysi: 'fish_trawl_79f9_f9fd_5a43',
  temp: 'fish_trawl_79f9_f9fd_5a42',
  catch: 'fish_trawl_3ce2_fedf_6833',
};

const BUOY_DATASETS = {
  buoy: 'combined_e784_bee5_492e',
  mabuoy: 'ma_buoy_data_a6c9_12eb_1ec5',
  model: 'model_data_77bb_15c2_6ab3',
  plankton: 'plankton_time_series_7615_c513_ef8e',
  telemetryRaw: 'buoy_telemetry_0ffe_2dc0_916e',
};
const summaryUnitMap = {
  buoy: 'month',
  mabuoy: 'month',
  model: 'year',
  plankton: 'month',
  telemetryRaw: 'day',
};

const downsampleDataset = {
  plankton: false,
};

async function doFetch() {
  const resp = await fetch(`${baseURL}/${BUOY_DATASETS.buoy}.json`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const json = await resp.json();
  console.log(json);
  return;
  const rows = convertErddapTableToObject(json.table as ErddapTable);
  console.log(rows);
}

type ErddapTable = {
  columnNames: string[];
  columnTypes: string[];
  columnUnits: Array<string | null>;
  rows: Array<string | number>[];
};

function convertKeyToCamelCase(key: string) {
  const keySegments = key.toLowerCase().split('_');
  const collectedSegments = keySegments.reduce(
    (prev, next) => `${prev}${next[0].toUpperCase()}${next.slice(1)}`,
    ''
  );
  return `${collectedSegments[0].toLowerCase()}${collectedSegments.slice(1)}`;
}

function convertErddapTableToObject(table: ErddapTable) {
  const columnNames = table.columnNames.map(convertKeyToCamelCase);
  const columnTypes = table.columnTypes.map(convertKeyToCamelCase);
  const rows = table.rows.map((row) =>
    row.reduce(
      (prev, next, i) => ({
        ...prev,
        [columnNames[i]]: { value: next, type: columnTypes[i], unit: table.columnUnits[i] },
      }),
      {} as Map<string, string | number>
    )
  );
  return rows;
}

doFetch();
*/
