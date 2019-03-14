import { useEffect, useState } from "react";
import Web3 from "web3";

interface Web3LoaderProps {
  ifPresent: (web3: Web3) => JSX.Element;
}

function Web3Loader(props : Web3LoaderProps) {
  const [web3, setWeb3]  = useState<Web3 | null>(null);

  useEffect(() => {
    setWeb3(window.web3);
  });

  return web3 && props.ifPresent(web3);
}

export default Web3Loader;
