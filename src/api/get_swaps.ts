import response from "../api/mock_response.json";

export interface Links {
  [rel: string]: {
    href: string;
  };
}

export interface Asset {
  name: string;
  quantity: string;
}

export interface Ledger {
  name: string;
  network: string;
}

export interface Parameters {
  alpha_asset: Asset;
  alpha_ledger: Ledger;
  beta_asset: Asset;
  beta_ledger: Ledger;
}

export interface Swap {
  _links: Links;
  parameters: Parameters;
  protocol: string;
  status: string;
}

export interface GetSwapsResponse {
  _embedded: {
    swaps: Swap[];
  };
}

export default function getSwaps() {
  return fetchWithTimeout("http://localhost:8080/swaps", 2000)
    .then(response => response.json())
    .then(body => body as GetSwapsResponse)
    .then(body => body._embedded.swaps);
}

function fetchWithTimeout(
  url: RequestInfo,
  timeout: number
): Promise<Response> {
  return new Promise((resolve, reject) => {
    // Set timeout timer
    let timer = setTimeout(
      () => reject(new Error("Request timed out")),
      timeout
    );

    fetch(url)
      .then(response => resolve(response), err => reject(err))
      .finally(() => clearTimeout(timer));
  });
}
