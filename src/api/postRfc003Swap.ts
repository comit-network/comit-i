import axios from "axios";
import URI from "urijs";
import { Rfc003Params } from "../forms/Rfc003ParamsForm";
import { Swap } from "../forms/SwapForm";
import storage from "../storage";

export default function postRfc003Swap(
  swap: Swap,
  params: Rfc003Params,
  peer: string
) {
  const uri = new URI({
    protocol: "http",
    hostname: storage.getHost(),
    port: storage.getPort().toString(),
    path: "swaps/rfc003"
  }).toString();

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
