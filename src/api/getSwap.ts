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

export enum HtlcState {
  NotDeployed = "NotDeployed",
  Deployed = "Deployed",
  Funded = "Funded",
  Redeemed = "Redeemed",
  Refunded = "Refunded"
}

export interface LedgerState {
  status: HtlcState;
  htlcLocation: any;
  deployTx: string;
  fundTx: string;
  redeemTx: string;
  refundTx: string;
}

export enum CommunicationStatus {
  Sent = "SENT",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED"
}

export interface CommunicationState {
  alphaExpiry: number;
  alphaRedeemIdentity: string | null;
  alphaRefundIdentity: string;
  betaExpiry: number;
  betaRedeemIdentity: string;
  betaRefundIdentity: string | null;
  secretHash: string;
  status: CommunicationStatus;
}

export interface State {
  alphaLedgerState: LedgerState;
  betaLedgerState: LedgerState;
  communicationState: CommunicationState;
}

export interface Properties {
  parameters: Parameters;
  protocol: Protocol;
  status: Status;
  role: Role;
  state: State;
}

export interface Link {
  rel: string[];
  href: string;
}

export interface Swap {
  properties: Properties;
  links: Link[];
}

export default function getSwap(protocol: string, swapId: string) {
  const uri = apiEndpoint()
    .segment(0, "swaps")
    .segment(1, protocol)
    .segment(2, swapId)
    .toString();

  return axios.get(uri).then(res => res.data as Swap);
}
