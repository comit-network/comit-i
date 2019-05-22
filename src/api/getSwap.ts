import axios from "axios";
import apiEndpoint from "./apiEndpoint";
import { Parameters, Protocol, Role, Status } from "./swapTypes";

export enum HtlcState {
  NotDeployed = "NotDeployed",
  Deployed = "Deployed",
  Funded = "Funded",
  Redeemed = "Redeemed",
  Refunded = "Refunded"
}

export interface LedgerState {
  status: HtlcState;
  htlc_location: any;
  deploy_tx: string;
  fund_tx: string;
  redeem_tx: string;
  refund_tx: string;
}

export enum CommunicationStatus {
  Sent = "SENT",
  Accepted = "ACCEPTED",
  Rejected = "REJECTED"
}

export interface CommunicationState {
  alpha_expiry: number;
  alpha_ledger_redeem_identity: string | null;
  alpha_ledger_refund_identity: string;
  beta_expiry: number;
  beta_ledger_redeem_identity: string;
  beta_ledger_refund_identity: string | null;
  secret_hash: string;
  status: CommunicationStatus;
}

export interface State {
  alpha_ledger: LedgerState;
  beta_ledger: LedgerState;
  communication: CommunicationState;
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
