import { Typography } from "@material-ui/core";
import React from "react";
import { Ledger } from "../../api/swapTypes";
import ExplorerLink, { ResourceType } from "./ExplorerLink";

interface BitcoinHtlcLocation {
  txid: string;
  vout: number;
}

interface HtlcLocationTypographyProps {
  ledger: Ledger;
  location: any;
}

function HtlcLocationTypography({
  ledger,
  location
}: HtlcLocationTypographyProps) {
  if (ledger.name === "bitcoin") {
    const bitcoinLocation = location as BitcoinHtlcLocation;
    return (
      <React.Fragment>
        <Typography>
          HTLC located at vout {bitcoinLocation.vout} of transaction{" "}
        </Typography>
        <ExplorerLink
          ledger={ledger}
          hash={bitcoinLocation.txid}
          resourceType={ResourceType.Transaction}
        />
      </React.Fragment>
    );
  } else if (ledger.name === "ethereum") {
    return (
      <React.Fragment>
        <Typography>HTLC located at address</Typography>
        <ExplorerLink
          ledger={ledger}
          hash={location}
          resourceType={ResourceType.Address}
        />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        <Typography>HTLC located at</Typography>
        <Typography noWrap={true}>{location}</Typography>
      </React.Fragment>
    );
  }
}

export default HtlcLocationTypography;
