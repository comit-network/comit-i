import { Button, TableCell, TableRow } from "@material-ui/core";
import { useState } from "react";
import React from "react";
import { Asset, Swap } from "../../api/get_swaps";
import CommunicationActionDialog from "./CommunicationActionDialog";
import LedgerActionDialog from "./LedgerActionDialog";

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

enum DialogState {
  Closed,
  CommunicationDialogOpen,
  LedgerDialogOpen
}

function SwapRow(swap: Swap) {
  const [dialogState, setDialogState] = useState(DialogState.Closed);
  const [communicationAction, setCommunicationAction] = useState({
    name: "",
    url: ""
  });
  const [ledgerActionUrl, setLedgerActionUrl] = useState("");

  const alphaIsTransitive = swap.parameters.alpha_ledger.name === "bitcoin";
  const betaIsTransitive = swap.parameters.beta_ledger.name === "bitcoin";

  const actionButtons = Object.entries(swap._links)
    .filter(([key, _]) => key !== "self")
    .map(([actionName, actionUrl]) => {
      if (actionName === "accept" || actionName === "decline") {
        return (
          <Button
            variant="outlined"
            color="primary"
            key={actionName}
            onClick={() =>
              handleClickCommunicationAction(actionName, actionUrl.href)
            }
          >
            {actionName}
          </Button>
        );
      } else {
        return (
          <Button
            variant="outlined"
            color="primary"
            key={actionName}
            onClick={() => handleClickLedgerAction(actionUrl.href)}
          >
            {actionName}
          </Button>
        );
      }
    });

  const acceptFields = [];
  if (!alphaIsTransitive) {
    acceptFields.push("alpha_ledger_redeem_identity");
  }
  if (!betaIsTransitive) {
    acceptFields.push("beta_ledger_refund_identity");
  }

  const handleClickCommunicationAction = (name: string, url: string) => {
    setCommunicationAction({ name, url });
    setDialogState(DialogState.CommunicationDialogOpen);
  };

  const handleClickLedgerAction = (url: string) => {
    setLedgerActionUrl(url);
    setDialogState(DialogState.LedgerDialogOpen);
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
      {dialogState === DialogState.CommunicationDialogOpen && (
        <CommunicationActionDialog
          action={communicationAction}
          acceptFields={acceptFields}
          onClose={() => setDialogState(DialogState.Closed)}
        />
      )}
      {dialogState === DialogState.LedgerDialogOpen && (
        <LedgerActionDialog
          path={ledgerActionUrl}
          onClose={() => setDialogState(DialogState.Closed)}
        />
      )}
    </React.Fragment>
  );
}

export default SwapRow;
