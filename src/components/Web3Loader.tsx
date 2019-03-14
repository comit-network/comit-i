import React, { useEffect, useState } from "react";
import Web3 from "web3";

interface Web3LoaderProps {
  ifPresent?: (web3: Web3) => JSX.Element;
  ifNotPresent?: () => JSX.Element ;
}

function Web3Loader({ifPresent = () => <span/>, ifNotPresent = () => <span/>} : Web3LoaderProps) {
  const [web3, setWeb3]  = useState<Web3 | null>(null);

  useEffect(() => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (window.web3) {
      // Use Mist/MetaMask's provider
      setWeb3(new Web3(window.web3.currentProvider))
    }
  }, []);

  return web3 ? ifPresent(web3) : ifNotPresent();
}

export default Web3Loader;
