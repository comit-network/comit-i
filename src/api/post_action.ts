import axios from "axios";

export default async function postAction(url: string, body?: object) {
  return axios
    .post("http://localhost:8010" + url, body)
    .then(res => res.data.payload);
}
