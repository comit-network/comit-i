import storage from "../storage";

export default function getHostAndPort() {
  return storage.getHost() + ":" + storage.getPort().toString();
}
