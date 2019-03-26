import axios from "axios";
import getHostAndPort from "./getHostAndPort";

export interface PostRfc003SwapRequest {
  alpha_ledger: any;
  beta_ledger: any;
  alpha_asset: any;
  beta_asset: any;
  alpha_ledger_refund_identity?: string;
  beta_ledger_redeem_identity?: string;
  alpha_expiry?: number;
  beta_expiry?: number;
  peer: string;
}

export default function postSwap(
  protocol: string,
  swapRequest: PostRfc003SwapRequest
) {
  return axios.post(
    "http://" + getHostAndPort() + "/swaps/" + protocol,
    swapRequest,
    {
      timeout: 2000
    }
  );
}
