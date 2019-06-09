import { Tooltip } from "@material-ui/core";
import React from "react";
import { useWeb3 } from "./Web3Context";

interface Props {
  children: React.ReactNode;
}

function NoWeb3Tooltip({ children }: Props) {
  const { web3, declined } = useWeb3();

  // Need to wrap children of tooltip in span because tooltips don't show for
  // disabled children by default and children of this tooltip are likely to be
  // disabled when this one is shown e.g. when web3 is not available.
  const tooltip = (
    <Tooltip
      title={
        declined
          ? "Please give COMIT-i access to your metamask first."
          : "Please enable Metamask first."
      }
    >
      <span>{children}</span>
    </Tooltip>
  );

  return <React.Fragment>{web3 ? children : tooltip}</React.Fragment>;
}

export default NoWeb3Tooltip;
