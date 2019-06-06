import axios from "axios";
import apiEndpoint from "./apiEndpoint";

export interface ComitNodeInfo {
  id: string;
  listen_addresses: string[];
}

export default function getComitInfo() {
  const uri = apiEndpoint()
    .path("/")
    .toString();
  return axios.get(uri).then(response => response.data as ComitNodeInfo);
}
