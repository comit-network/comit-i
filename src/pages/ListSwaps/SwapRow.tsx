import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableCell,
  TableRow
} from "@material-ui/core";
import React from "react";
import { useReducer, useState } from "react";
import { toBitcoin } from "satoshi-bitcoin-ts";
import URI from "urijs";
import { fromWei } from "web3-utils";
import apiEndpoint from "../../api/apiEndpoint";
import { Asset, Swap } from "../../api/getSwaps";
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

interface LedgerActionSpec {
  field_name: string;
  form_label: string;
}

function actionQueryParams(swap: Swap, actionName: string): LedgerActionSpec[] {
  const ledger = actionLedger(swap, actionName);

  if (!ledger) {
    return [];
  }

  if (
    ledger.name === "bitcoin" &&
    (actionName === "redeem" || actionName === "refund")
  ) {
    return [
      { field_name: "address", form_label: "Bitcoin address" },
      { field_name: "fee_per_byte", form_label: "Fee per byte" }
    ];
  } else {
    return [];
  }
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
      return (
        <Button
          variant="outlined"
          color="primary"
          key={actionName}
          onClick={() =>
            handleClickAction(actionName, apiEndpoint().path(actionUrl.href))
          }
        >
          {actionName}
        </Button>
      );
    });

  // TODO: Default values could come from config file or MetaMask
  const acceptFields = [];
  if (!alphaIsTransitive) {
    acceptFields.push({
      key: "alpha_ledger_redeem_identity",
      label: "Alpha Redeem Identity",
      default: "0x493A5A0EaFDEaE28f430F74Ac5031b3eE37B6a6D"
    });
  }
  if (!betaIsTransitive) {
    acceptFields.push({
      key: "beta_ledger_refund_identity",
      label: "Beta Refund Identity",
      default: "0x493A5A0EaFDEaE28f430F74Ac5031b3eE37B6a6D"
    });
  }

  const handleClickAction = (name: string, url: uri.URI) => {
    setAction({ name, url });

    switch (name) {
      case "accept":
      case "decline":
        setDialogState(DialogState.CommunicationDialogOpen);
        break;
      case "fund":
      case "deploy":
      case "redeem":
      case "refund":
        const params = actionQueryParams(swap, name);

        if (params.length > 0) {
          setLedgerActionParamSpec(params);
          setDialogState(DialogState.LedgerDialogParamsOpen);
        } else {
          setDialogState(DialogState.LedgerDialogOpen);
        }
        break;
    }
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
          action={action}
          acceptFields={acceptFields}
          onClose={() => setDialogState(DialogState.Closed)}
        />
      )}
      {dialogState === DialogState.LedgerDialogParamsOpen && (
        <Dialog open={true}>
          <DialogTitle>Action parameters</DialogTitle>
          <DialogContent>
            {ledgerActionParamSpec.map(spec => (
              <TextField
                key={spec.field_name}
                label={spec.form_label}
                required={true}
                value={ledgerActionParams[spec.field_name] || ""}
                onChange={event =>
                  dispatchLedgerActionParams({
                    name: spec.field_name,
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
