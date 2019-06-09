import Web3 from "web3";

declare interface ComitNodeApiEndpoint {
  host: string;
  port: number;
}

declare interface Metamask {
  enable: () => Promise<string[]>;
}

declare global {
  interface Window {
    web3?: Web3;
    ethereum?: Metamask;
    getComitNodeApiEndpoint?: () => ComitNodeApiEndpoint;
  }

  interface Navigator {
    registerProtocolHandler(protocol: string, url: string, name: string);
  }
}
