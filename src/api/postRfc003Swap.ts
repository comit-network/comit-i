import axios from "axios";
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

  params.alpha_expiry = relativeMinutesToTimestamp(params.alpha_expiry);
  params.beta_expiry = relativeMinutesToTimestamp(params.beta_expiry);

  return axios.post(
    uri,
    {
      ...swap,
      ...params,
      peer
    },
    {
      timeout: 2000
    }
  );
}
