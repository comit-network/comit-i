import URI from "urijs";
import storage from "../storage";

export default function apiEndpoint() {
  if (window.getComitNodeApiEndpoint) {
    const { host, port } = window.getComitNodeApiEndpoint();

    if (host && port) {
      return new URI({
        protocol: "http",
        hostname: host,
        port: port.toString()
      });
    }
  }

  return new URI({
    protocol: "http",
    hostname: storage.getHost(),
    port: storage.getPort().toString()
  });
}
