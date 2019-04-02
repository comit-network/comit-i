import axios from "axios";

export default function postAction(uri: uri.URI, body?: object) {
  return axios.post(uri.toString(), body);
}
