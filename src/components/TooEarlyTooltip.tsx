import { Tooltip } from "@material-ui/core";
import moment from "moment";
import React from "react";

interface Props {
  whenValid: number;
  networkNow: number;
  children: React.ReactElement;
}

function TooEarlyTooltip({ whenValid, networkNow, children }: Props) {
  const whenValidFormatted = moment.unix(whenValid).format("LLL");
  const networkNowFormatted = moment.unix(networkNow).format("LLL");

  const message =
    "This transaction is only valid once the Ethereum network time is at least " +
    whenValidFormatted +
    ". The current network time is " +
    networkNowFormatted +
    ".";

  return <Tooltip title={message}>{children}</Tooltip>;
}

export default TooEarlyTooltip;
