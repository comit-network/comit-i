export interface SettingsStore {
  getHost(): string;
  getPort(): number;
  setHost(host: string): void;
  setPort(port: number): void;
}

const hostKey = "comit_node.host";
const portKey = "comit_node.port";

export class LocalStorageSettingsStore implements SettingsStore {
  private localStorage: Storage;

  constructor(localStorage: Storage) {
    this.localStorage = localStorage;
  }

  public getHost = () => {
    return this.localStorage.getItem(hostKey) || "localhost";
  };

  public getPort = () => {
    const port = this.localStorage.getItem(portKey) || "8000";
    return parseInt(port, 10);
  };

  public setHost = (host: string) => {
    this.localStorage.setItem(hostKey, host);
  };

  public setPort = (port: number) => {
    this.localStorage.setItem(portKey, port.toString());
  };
}

export default new LocalStorageSettingsStore(window.localStorage);
