import axios from "axios";
import getHostAndPort from "./getHostAndPort";

export default async function postAction(url: string, body?: object) {
  return axios.post("http://" + getHostAndPort() + url, body);
}
