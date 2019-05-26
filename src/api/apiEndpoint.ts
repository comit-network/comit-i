import URI from "urijs";
import { LocalStorageSettingsStore } from "../settingsStore";
import { DefaultComitNodeApiConfig } from "./config";

const config = new DefaultComitNodeApiConfig(
  window,
  new LocalStorageSettingsStore(window.localStorage)
);

export default function apiEndpoint() {
  return new URI({
    protocol: "http",
    hostname: config.getEffectiveHost(),
    port: config.getEffectivePort().toString()
  });
}
