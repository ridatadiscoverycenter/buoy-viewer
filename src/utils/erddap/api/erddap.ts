const baseURL =
  ((process.env.VITE_RIDDC_API_BASEURL as string | false) || 'https://api.riddc.brown.edu') +
  '/erddap';

export async function erddapAPIGet<T>(path: string) {
  const response = await fetch(`${baseURL}/${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return (await response.json()) as T;
  }
  throw new Error(
    `An error ${response.status} occurred when fetching data from "${baseURL}/${path}": ${response.statusText}`
  );
}

export async function erddapGet<T>(path: string) {
  const response = await fetch(`${baseURL}/${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    return (await response.json()) as T;
  }
  throw new Error(
    `An error ${response.status} occurred when fetching data from "${baseURL}/${path}": ${response.statusText}`
  );
}
