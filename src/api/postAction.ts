import axios from "axios";
import getHostAndPort from "./getHostAndPort";

export default function postAction(path: uri.URI, body?: object) {
  const uri = path.authority(getHostAndPort()).toString();
  return axios.post(uri, body);
}
