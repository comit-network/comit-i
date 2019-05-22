import { TableCell, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { toBitcoin } from "satoshi-bitcoin-ts";
import { fromWei } from "web3-utils";
import { Swap } from "../../api/getSwaps";
import { Asset } from "../../api/swapTypes";
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

const useStyles = makeStyles(() => ({
  tableRow: {
    cursor: "pointer"
  }
}));

interface SwapRowProps extends RouteComponentProps {
  swap: Swap;
}

function SwapRow({ swap, history }: SwapRowProps) {
  const classes = useStyles();
  const swapLink = swap.links.filter(link => link.rel[0] === "self")[0].href;

  const actions = actionDialogs(
    swap.links,
    swap.properties.role,
    swap.properties.parameters.alpha_ledger,
    swap.properties.parameters.beta_ledger
  );

  return (
    <React.Fragment key={swapLink}>
      <TableRow
        hover={true}
        onClick={() => history.push(swapLink)}
        className={classes.tableRow}
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
