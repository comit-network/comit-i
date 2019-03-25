import axios from "axios";

interface AcceptActionField {
  name: string;
  value: string;
}

export function acceptReducer(currentState: object, field: AcceptActionField) {
  return { ...currentState, [field.name]: field.value };
}

export default async function postAction(url: string, body?: object) {
  return axios
    .post("http://localhost:8010" + url, body)
    .then(res => res.data.payload);
}
