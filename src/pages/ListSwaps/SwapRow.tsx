import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow
} from "@material-ui/core";
import { useReducer, useState } from "react";
import React from "react";
import { toBitcoin } from "satoshi-bitcoin-ts";
import URI from "urijs";
import { fromWei } from "web3-utils";
import { Asset, Swap } from "../../api/get_swaps";
import TextField from "../../components/TextField";
import CommunicationActionDialog from "./CommunicationActionDialog";
import LedgerActionDialog from "./LedgerActionDialog";

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

enum DialogState {
  Closed,
  CommunicationDialogOpen,
  LedgerDialogParamsOpen,
  LedgerDialogOpen
}

function actionQueryParams(swap: Swap, actionName: string) {
  const ledger = actionLedger(swap, actionName);

  if (!ledger) {
    return [];
  }

  if (
    ledger.name === "bitcoin" &&
    (actionName === "redeem" || actionName === "refund")
  ) {
    return [{ name: "address" }, { name: "fee_per_byte" }];
  } else {
    return [];
  }
}

interface LedgerActionSpec {
  name: string;
}

interface LedgerParamsField {
  name: string;
  value: string;
}

function ledgerParamsReducer(currentState: object, field: LedgerParamsField) {
  return { ...currentState, [field.name]: field.value };
}

function actionLedger(swap: Swap, action: string) {
  switch (action) {
    case "redeem":
      return swap.role === "Alice"
        ? swap.parameters.beta_ledger
        : swap.parameters.alpha_ledger;
    case "refund":
    case "fund":
      return swap.role === "Alice"
        ? swap.parameters.alpha_ledger
        : swap.parameters.beta_ledger;
    default:
      return null;
  }
}

function SwapRow(swap: Swap) {
  const [dialogState, setDialogState] = useState(DialogState.Closed);
  const [action, setAction] = useState({
    name: "",
    url: URI("")
  });
  const [ledgerActionParamSpec, setLedgerActionParamSpec] = useState<
    LedgerActionSpec[]
  >([]);
  const initialLedgerActionParams = {} as { [key: string]: string };
  const [ledgerActionParams, dispatchLedgerActionParams] = useReducer(
    ledgerParamsReducer,
    initialLedgerActionParams
  );

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
              handleClickCommunicationAction(actionName, URI(actionUrl.href))
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
            onClick={() =>
              handleClickLedgerAction(actionName, URI(actionUrl.href))
            }
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

  const handleClickCommunicationAction = (name: string, url: uri.URI) => {
    setAction({ name, url });
    setDialogState(DialogState.CommunicationDialogOpen);
  };

  const handleClickLedgerAction = (name: string, url: uri.URI) => {
    const params = actionQueryParams(swap, name);

    setAction({ name, url });

    if (params.length > 0) {
      setLedgerActionParamSpec(params);
      setDialogState(DialogState.LedgerDialogParamsOpen);
    } else {
      setDialogState(DialogState.LedgerDialogOpen);
    }
  };

  const ledger = actionLedger(swap, action.name);

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
          action={action}
          acceptFields={acceptFields}
          onClose={() => setDialogState(DialogState.Closed)}
        />
      )}
      {dialogState === DialogState.LedgerDialogParamsOpen && (
        <Dialog open={true}>
          <DialogTitle>
            {ledger ? `${ledger.name} ${action.name} parameters` : ""}
          </DialogTitle>
          <DialogContent>
            {ledgerActionParamSpec.map(spec => (
              <TextField
                key={spec.name}
                label={spec.name}
                required={true}
                value={ledgerActionParams[spec.name] || ""}
                onChange={event =>
                  dispatchLedgerActionParams({
                    name: spec.name,
                    value: event.target.value
                  })
                }
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                const url = action.url.query(ledgerActionParams);

                setAction({ ...action, url });
                setDialogState(DialogState.LedgerDialogOpen);
              }}
              color="primary"
            >
              {"Submit"}
            </Button>
            <Button
              onClick={() => setDialogState(DialogState.Closed)}
              color="secondary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {dialogState === DialogState.LedgerDialogOpen && (
        <LedgerActionDialog
          path={action.url}
          onClose={() => setDialogState(DialogState.Closed)}
        />
      )}
    </React.Fragment>
  );
}

export default SwapRow;
