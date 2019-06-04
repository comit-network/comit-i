import axios from "axios";
import update from "immutability-helper";
import { Rfc003Params } from "../forms/Rfc003ParamsForm";
import { Swap } from "../forms/SwapForm";
import { relativeMinutesToTimestamp } from "../time";
import apiEndpoint from "./apiEndpoint";

export default function postRfc003Swap(
  swap: Swap,
  params: Rfc003Params,
  peerId: string,
  addressHint: string
) {
  const uri = apiEndpoint()
    .path("swaps/rfc003")
    .toString();

  const adjustedParams = update(params, {
    alpha_expiry: { $apply: relativeMinutesToTimestamp },
    beta_expiry: { $apply: relativeMinutesToTimestamp }
  });

  let peer = {};
  if (addressHint) {
    peer = { peer_id: peerId, address_hint: addressHint };
  }

  return axios.post(
    uri,
    {
      ...swap,
      ...adjustedParams,
      peer: peer ? peer : peerId
    },
    {
      timeout: 2000
    }
  );
}
