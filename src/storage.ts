export interface Storage {
  getHost(): string;
  getPort(): number;
  setHost(host: string): void;
  setPort(port: number): void;
}

const hostKey = "comit_node.host";
const portKey = "comit_node.port";

const storage: Storage = {
  getHost: () => {
    return localStorage.getItem(hostKey) || "localhost";
  },

  getPort: () => {
    const port = localStorage.getItem(portKey) || "8000";
    return parseInt(port, 10);
  },

  setHost: (host: string) => {
    localStorage.setItem(hostKey, host);
  },

  setPort: (port: number) => {
    localStorage.setItem(portKey, port.toString());
  }
};

export default storage;
