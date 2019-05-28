import React, { ReactNode, useContext } from "react";
import Web3 from "web3";

const Web3Context = React.createContext<Web3 | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

function newWeb3() {
  if (window.web3) {
    const web3 = new Web3(window.web3.currentProvider);

    // Why? Because: https://github.com/ethereum/web3.js/issues/2822
    web3.eth.transactionConfirmationBlocks = 1;

    return web3;
  } else {
    return undefined;
  }
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <Web3Context.Provider value={newWeb3()}>{children}</Web3Context.Provider>
  );
}

interface Web3LoaderProps {
  ifPresent?: (web3: Web3) => JSX.Element;
  ifNotPresent?: () => JSX.Element;
}

export function Web3Loader({
  ifPresent = () => <span />,
  ifNotPresent = () => <span />
}: Web3LoaderProps) {
  return (
    <Web3Context.Consumer>
      {web3 => (web3 ? ifPresent(web3) : ifNotPresent())}
    </Web3Context.Consumer>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
