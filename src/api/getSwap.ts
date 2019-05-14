import axios from "axios";
import apiEndpoint from "./apiEndpoint";

export default function getSwap(protocol: string, swapId: string) {
  const uri = apiEndpoint()
    .segment(0, "swaps")
    .segment(1, protocol)
    .segment(2, swapId)
    .toString();

  return axios.get(uri).then(res => res.data);
}
