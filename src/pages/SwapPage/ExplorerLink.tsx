import { Typography } from "@material-ui/core";
import React from "react";
import { Ledger } from "../../api/swapTypes";

export enum ResourceType {
  Transaction,
  Address
}

interface ExplorerLinkProps {
  ledger: Ledger;
  hash: string;
  resourceType: ResourceType;
}

function ExplorerLink({ ledger, hash, resourceType }: ExplorerLinkProps) {
  if (
    ledger.name === "bitcoin" &&
    (ledger.network === "mainnet" || ledger.network === "testnet")
  ) {
    const url =
      ledger.network === "mainnet"
        ? "https://live.blockcypher.com/btc/tx/"
        : "https://live.blockcypher.com/btc-testnet/tx/";

    return (
      <Typography noWrap={true}>
        <a target="_blank" href={url + hash}>
          {hash}
        </a>
      </Typography>
    );
  } else if (
    /* Ethereum testnet links not yet supported because the comit
       node doesn't specify whether it's Ropsten, Rinkeby... */
    ledger.name === "ethereum" &&
    ledger.network === "mainnet" &&
    resourceType
  ) {
    const url =
      resourceType === ResourceType.Address
        ? "https://etherscan.io/address/"
        : "https://etherscan.io/tx/";

    return (
      <Typography noWrap={true}>
        <a target="_blank" href={url + hash}>
          {hash}
        </a>
      </Typography>
    );
  } else {
    return <Typography noWrap={true}>{hash}</Typography>;
  }
}

export default ExplorerLink;
