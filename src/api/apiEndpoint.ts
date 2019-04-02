import URI from "urijs";
import storage from "../storage";

export default function apiEndpoint() {
  return new URI({
    protocol: "http",
    hostname: storage.getHost(),
    port: storage.getPort().toString()
  });
}
