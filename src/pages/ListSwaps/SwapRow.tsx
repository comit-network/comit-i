import { Button, TableCell, TableRow } from "@material-ui/core";
import { useState } from "react";
import React from "react";
import { Asset, Swap } from "../../api/get_swaps";
import ActionDialog from "./ActionDialog";

interface AssetCellProps {
  asset: Asset;
}

function AssetCell({ asset }: AssetCellProps) {
  switch (asset.name) {
    case "Ether": {
      return <span>{asset.quantity} wei</span>;
    }
    case "Bitcoin": {
      return <span>{asset.quantity} sats</span>;
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

function SwapRow(swap: Swap) {
  const [actionOpen, setActionOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState({ name: "", url: "" });

  const alphaIsTransitive = swap.parameters.alpha_ledger.name === "bitcoin";
  const betaIsTransitive = swap.parameters.beta_ledger.name === "bitcoin";

  const actionButtons = Object.entries(swap._links)
    .filter(([key, _]) => key !== "self")
    .map(([actionName, actionUrl]) => (
      <Button
        variant="outlined"
        color="primary"
        key={actionName}
        onClick={() => handleClickAction(actionName, actionUrl.href)}
      >
        {actionName}
      </Button>
    ));

  const acceptFields = [];
  if (!alphaIsTransitive) {
    acceptFields.push("alpha_ledger_redeem_identity");
  }
  if (!betaIsTransitive) {
    acceptFields.push("beta_ledger_refund_identity");
  }

  const handleClickAction = (name: string, url: string) => {
    setCurrentAction({ name, url });
    setActionOpen(true);
  };

  return (
    <React.Fragment key={swap._links.self.href}>
      <TableRow data-cy="swap-row">
        <TableCell>{swap.parameters.alpha_ledger.name}</TableCell>
        <TableCell>
          <AssetCell asset={swap.parameters.alpha_asset} />
        </TableCell>
        <TableCell>{swap.parameters.beta_ledger.name}</TableCell>
        <TableCell>
          <AssetCell asset={swap.parameters.beta_asset} />
        </TableCell>
        <TableCell>{swap.protocol}</TableCell>
        <TableCell>{swap.status}</TableCell>
        <TableCell>{swap.role}</TableCell>
        <TableCell>{actionButtons}</TableCell>
      </TableRow>
      {actionOpen && (
        <ActionDialog
          action={currentAction}
          acceptFields={acceptFields}
          setOpen={setActionOpen}
        />
      )}
    </React.Fragment>
  );
}

export default SwapRow;
