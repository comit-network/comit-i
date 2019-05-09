import axios from "axios";
import update from "immutability-helper";
import { Rfc003Params } from "../forms/Rfc003ParamsForm";
import { Swap } from "../forms/SwapForm";
import apiEndpoint from "./apiEndpoint";

function relativeMinutesToTimestamp(minutes: number) {
  const now = Math.floor((Date.now ? Date.now() : new Date().getTime()) / 1000);
  return now + minutes * 60;
}

export default function postRfc003Swap(
  swap: Swap,
  params: Rfc003Params,
  peer: string
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
