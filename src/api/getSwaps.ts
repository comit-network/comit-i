import axios from "axios";
import apiEndpoint from "./apiEndpoint";

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
  role: string;
}

export interface GetSwapsResponse {
  _embedded: {
    swaps: Swap[];
  };
}

export default function getSwaps() {
  const uri = apiEndpoint()
    .path("swaps")
    .toString();

  return axios
    .get(uri, {
      timeout: 2000
    })
    .then(response => response.data)
    .then(body => body as GetSwapsResponse)
    .then(body => body._embedded.swaps);
}