import React, { ReactNode, useContext, useEffect, useState } from "react";
import Web3 from "web3";

interface Web3ContextData {
  web3?: Web3;
  declined: boolean;
  defaultAccount?: string;
}

const Web3Context = React.createContext<Web3ContextData>({
  declined: false
});

interface Web3ProviderProps {
  window?: Window;
  children: ReactNode;
}

const globalWindow = window;

export function Web3Provider({
  children,
  window = globalWindow
}: Web3ProviderProps) {
  const [contextData, setContextData] = useState<Web3ContextData>({
    declined: false
  });

  useEffect(() => {
    const injectedEthereum = window.ethereum;
    const injectedWeb3 = window.web3;

    if (injectedEthereum && injectedWeb3) {
      injectedEthereum.enable().then(
        accounts => {
          const web3 = new Web3(injectedWeb3.currentProvider);

          // Why? Because: https://github.com/ethereum/web3.js/issues/2822
          web3.eth.transactionConfirmationBlocks = 1;

          setContextData({
            web3,
            declined: false,
            defaultAccount: accounts[0]
          });
        },
        () => {
          setContextData({
            declined: true
          });
        }
      );
    }
  }, [window.web3, window.ethereum]);

  return (
    <Web3Context.Provider value={contextData}>{children}</Web3Context.Provider>
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
      {({ web3, declined }) =>
        web3 && !declined ? ifPresent(web3) : ifNotPresent()
      }
    </Web3Context.Consumer>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
