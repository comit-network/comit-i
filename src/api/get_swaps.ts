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
  return new Promise<GetSwapsResponse>((resolve, reject) => {
    setTimeout(() => {
      resolve(response as GetSwapsResponse);
    }, 2000);
  }).then(response => response._embedded.swaps);
};
