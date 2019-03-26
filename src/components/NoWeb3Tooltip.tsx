import { Tooltip } from "@material-ui/core";
import React from "react";
import { useWeb3 } from "./Web3Context";

interface Props {
  title: string;
  children: React.ReactNode;
}

function NoWeb3Tooltip({ title, children }: Props) {
  const web3 = useWeb3();

  // Need to wrap children of tooltip in span because tooltips don't show for
  // disabled children by default and children of this tooltip are likely to be
  // disabled when this one is shown e.g. when web3 is not available.
  const tooltip = (
    <Tooltip title={title}>
      <span>{children}</span>
    </Tooltip>
  );

  return <React.Fragment>{web3 ? children : tooltip}</React.Fragment>;
}

export default NoWeb3Tooltip;
