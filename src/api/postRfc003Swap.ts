import axios from "axios";
import { Rfc003Params } from "../forms/Rfc003ParamsForm";
import { Swap } from "../forms/SwapForm";

export default function postRfc003Swap(
  swap: Swap,
  params: Rfc003Params,
  peer: string
) {
  return axios.post(
    "http://localhost:8000/swaps/rfc003",
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
