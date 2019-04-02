import axios from "axios";
import { Rfc003Params } from "../forms/Rfc003ParamsForm";
import { Swap } from "../forms/SwapForm";
import getHostAndPort from "./getHostAndPort";

export default function postRfc003Swap(
  swap: Swap,
  params: Rfc003Params,
  peer: string
) {
  const uri = getHostAndPort() + "/swaps/rfc003";

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
