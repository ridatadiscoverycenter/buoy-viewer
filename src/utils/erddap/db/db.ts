import { z } from 'zod';

export const ERDDAP_URL =
  process.env.BUOY_API_ERDDAP_URL ?? 'https://pricaimcit.services.brown.edu/erddap/tabledap';

export async function queryErddapTable(datasetId: string, params: Params = '') {
  const resp = await fetch(formatUrl(datasetId, params), {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const data = await resp.json();
  if (ensureErddapTableSchema(data)) {
    const rows = convertErddapTableToObject(data.table);
    return rows;
  } else {
    throw new Error(`Unexpected format for data from ${datasetId}`);
  }
}

export function extractValues(queryValues: Awaited<ReturnType<typeof queryErddapTable>>) {
  return queryValues.map((data) =>
    Object.fromEntries(Object.entries(data).map(([key, { value }]) => [key, value]))
  );
}

// Utility Types

export type Comparators = '=' | '>' | '<' | '>=' | '<=';
export type Params =
  | string
  | Array<{ key: string; comparator: Comparators; value: string | number | Date }>;

export type ErddapTableData = {
  columnNames: string[];
  columnTypes: string[];
  columnUnits: Array<string | null>;
  rows: Array<string | number>[];
};

export type ErddapTable = {
  table: ErddapTableData;
};

export type ErddapStringData = { value: string | number | undefined; type?: string; unit?: string };
export type ErddapNumberData = { value: string | number | undefined; type?: string; unit?: string };
export type ErddapData = ErddapStringData | ErddapNumberData;
export type ErddapRow = { [key: string]: ErddapData };

const ZodErddapTable = z
  .object({
    columnNames: z.array(z.string()),
    columnTypes: z.array(z.string()),
    columnUnits: z.array(z.union([z.string(), z.null()])),
    rows: z.array(z.array(z.union([z.string(), z.number(), z.null()]))),
  })
  .refine(
    ({ columnNames, columnTypes, columnUnits }) =>
      columnNames.length === columnTypes.length && columnNames.length === columnUnits.length
  );

const ZodTableObj = z.object({
  table: ZodErddapTable,
});

// Utility Functions

function ensureErddapTableSchema(table: unknown): table is ErddapTable {
  try {
    ZodTableObj.parse(table);
    return true;
  } catch (ex) {
    return false;
  }
}

function convertErddapTableToObject(table: ErddapTableData) {
  const columnNames = table.columnNames.map(convertKeyToCamelCase);
  const columnTypes = table.columnTypes.map(convertKeyToCamelCase);
  return table.rows.map((row) =>
    Object.fromEntries(
      row.map((value, index) => [
        columnNames[index],
        { value, type: columnTypes[index], unit: table.columnUnits[index] || undefined },
      ])
    )
  );
}

function formatParams(params: Params) {
  if (typeof params === 'string') return params;
  const paramEntries = params.map(
    ({ key, comparator, value }) =>
      `${key}${comparator}${
        typeof value === 'string'
          ? `"${value}"`
          : value instanceof Date
            ? value.toISOString()
            : `${value}`
      }`
  );
  return paramEntries.join('&');
}

function formatUrl(databaseId: string, params: Params) {
  const formattedParams = params === '' ? '' : `?&${formatParams(params)}`;
  return `${ERDDAP_URL}/${databaseId}.json${formattedParams}`;
}

function convertKeyToCamelCase(key: string) {
  const keySegments = key.toLowerCase().split('_');
  const collectedSegments = keySegments.reduce(
    (prev, next) => `${prev}${next[0].toUpperCase()}${next.slice(1)}`,
    ''
  );
  return `${collectedSegments[0].toLowerCase()}${collectedSegments.slice(1)}`;
}
