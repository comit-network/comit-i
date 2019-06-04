import axios from "axios";
import update from "immutability-helper";
import { Rfc003Params } from "../forms/Rfc003ParamsForm";
import { Swap } from "../forms/SwapForm";
import { relativeMinutesToTimestamp } from "../time";
import apiEndpoint from "./apiEndpoint";

export interface DialInfo {
  peer_id: string;
  address_hint: string;
}

export default function postRfc003Swap(
  swap: Swap,
  params: Rfc003Params,
  peer: string | DialInfo
) {
  const uri = apiEndpoint()
    .path("swaps/rfc003")
    .toString();

  const adjustedParams = update(params, {
    alpha_expiry: { $apply: relativeMinutesToTimestamp },
    beta_expiry: { $apply: relativeMinutesToTimestamp }
  });

  return axios.post(
    uri,
    {
      ...swap,
      ...adjustedParams,
      peer
    },
    {
      timeout: 2000
    }
  );
}
