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
  class: string[];
}
