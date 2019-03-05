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

export default () => {
  return Promise.resolve(response as GetSwapsResponse).then(response => response._embedded.swaps);
};
