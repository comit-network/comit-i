import Web3 from "web3";

declare global {
  interface Window {
    web3: Web3 | null;
  }

  interface Navigator {
    registerProtocolHandler(protocol: string, url: string, name: string);
  }
}
