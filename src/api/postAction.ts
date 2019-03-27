import axios from "axios";
import getHostAndPort from "./getHostAndPort";

export default async function postAction(url: uri.URI, body?: object) {
  const uri = url.authority(getHostAndPort()).toString();
  return axios.post(uri, body);
}
