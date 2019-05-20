import { TableCell, TableRow } from "@material-ui/core";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { toBitcoin } from "satoshi-bitcoin-ts";
import { fromWei } from "web3-utils";
import { Asset, Swap } from "../../api/getSwaps";
import actionDialogs from "../../components/ActionDialogs";

interface AssetCellProps {
  asset: Asset;
}

function AssetCell({ asset }: AssetCellProps) {
  switch (asset.name) {
    case "ether": {
      return <span>{fromWei(asset.quantity, "ether")} ETH</span>;
    }
    case "bitcoin": {
      return <span>{toBitcoin(asset.quantity)} BTC</span>;
    }
    default: {
      return (
        <span>
          {asset.quantity} {asset.name}
        </span>
      );
    }
  }
}

interface SwapRowProps extends RouteComponentProps {
  swap: Swap;
}

function SwapRow({ swap, history }: SwapRowProps) {
  const swapLink = swap.links.filter(link => link.rel[0] === "self")[0].href;

  const actions = actionDialogs(
    swap.links,
    swap.properties.role,
    swap.properties.parameters.alpha_ledger,
    swap.properties.parameters.beta_ledger
  );

  return (
    <React.Fragment key={swap.links[0].href}>
      <TableRow
        hover={true}
        onClick={() => history.push(swapLink)}
        data-cy="swap-row"
      >
        <TableCell>{swap.properties.parameters.alpha_ledger.name}</TableCell>

        <TableCell>
          <AssetCell asset={swap.properties.parameters.alpha_asset} />
        </TableCell>
        <TableCell>{swap.properties.parameters.beta_ledger.name}</TableCell>
        <TableCell>
          <AssetCell asset={swap.properties.parameters.beta_asset} />
        </TableCell>
        <TableCell>{swap.properties.protocol}</TableCell>
        <TableCell>{swap.properties.status}</TableCell>
        <TableCell>{swap.properties.role}</TableCell>
        <TableCell>{actions.buttons.map(elem => elem.button)}</TableCell>
      </TableRow>
      {actions.dialogs}
    </React.Fragment>
  );
}

export default withRouter(SwapRow);
