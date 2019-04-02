import axios from "axios";
import { Rfc003Params } from "../forms/Rfc003ParamsForm";
import { Swap } from "../forms/SwapForm";
import apiEndpoint from "./apiEndpoint";

export default function postRfc003Swap(
  swap: Swap,
  params: Rfc003Params,
  peer: string
) {
  const uri = apiEndpoint()
    .path("swaps/rfc003")
    .toString();

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
