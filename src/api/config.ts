import { SettingsStore } from "../settingsStore";

export interface ComitNodeApiConfig {
  isOverrideActive: () => boolean;
  getEffectivePort: () => number;
  getEffectiveHost: () => string;
}

export class DefaultComitNodeApiConfig implements ComitNodeApiConfig {
  private window: Window;
  private storage: SettingsStore;

  constructor(window: Window, storage: SettingsStore) {
    this.window = window;
    this.storage = storage;
  }

  public getEffectiveHost() {
    if (this.window.getComitNodeApiEndpoint) {
      return this.window.getComitNodeApiEndpoint().host;
    }

    return this.storage.getHost();
  }

  public getEffectivePort() {
    if (this.window.getComitNodeApiEndpoint) {
      return this.window.getComitNodeApiEndpoint().port;
    }

    return this.storage.getPort();
  }

  public isOverrideActive() {
    return typeof this.window.getComitNodeApiEndpoint === "function";
  }
}
