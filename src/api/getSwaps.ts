import axios from "axios";
import apiEndpoint from "./apiEndpoint";

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

export enum Protocol {
  Rfc003 = "rfc003"
}

export enum Status {
  InProgress = "IN_PROGRESS",
  Sent = "SWAPPED",
  NotSwapped = "NOT_SWAPPED",
  InternalFailure = "INTERNAL_FAILURE"
}

export enum Role {
  Alice = "Alice",
  Bob = "Bob"
}

export interface Properties {
  parameters: Parameters;
  protocol: Protocol;
  status: Status;
  role: Role;
}

export interface Link {
  rel: string[];
  href: string;
}

export interface Swap {
  properties: Properties;
  links: Link[];
}

export interface GetSwapsResponse {
  entities: Swap[];
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
    .then(body => body.entities);
}
