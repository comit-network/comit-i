import { TableCell, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Swap } from "../../api/swapsResource";
import { Asset, toMainUnit } from "../../api/swapTypes";
import actionDialogs from "../../components/ActionDialogs";

interface AssetCellProps {
  asset: Asset;
}

function AssetCell({ asset }: AssetCellProps) {
  return <span>{toMainUnit(asset)}</span>;
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
  function onRowClick() {
    history.push("/show_resource" + swapLink);
    /* FIXME: This is bad, but otherwise the Swap component doesn't mount */
    window.location.reload();
  }

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
        onClick={onRowClick}
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
