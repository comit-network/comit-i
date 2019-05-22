import { toBitcoin } from "satoshi-bitcoin-ts";
import { fromWei } from "web3-utils";

export interface Asset {
  name: string;
  quantity: string;
  token_contract?: string;
}

export function toMainUnit(asset: Asset) {
  switch (asset.name) {
    case "ether":
      return fromWei(asset.quantity, "ether") + " ETH";
    case "bitcoin":
      return toBitcoin(asset.quantity) + " BTC";
    case "erc20":
      // TODO: Find and use token symbol if possible
      return asset.quantity + " ERC20";
    default:
      return asset.quantity + " " + asset.name;
  }
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
