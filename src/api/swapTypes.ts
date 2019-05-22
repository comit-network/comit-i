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
