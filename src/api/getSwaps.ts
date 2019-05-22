import axios from "axios";
import apiEndpoint from "./apiEndpoint";
import { Parameters, Protocol, Role, Status } from "./swapTypes";

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
