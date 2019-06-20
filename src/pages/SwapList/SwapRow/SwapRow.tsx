import { CircularProgress, TableCell, TableRow } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useReducer } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { EmbeddedRepresentationSubEntity } from "../../../../gen/siren";
import { Asset, Properties } from "../../../api/swapTypes";
import { mainUnitSymbol, toMainUnit } from "../../../api/unit";
import ActionButton from "../../../components/ActionButton";
import Dialog from "../../../components/Dialog";
import ExternalLink from "../../../components/ExternalLink";
import {
  actionButtonClicked,
  closeLedgerActionDialog,
  closeSirenParametersDialog,
  ledgerActionSuccessful,
  sirenParameterDialogSubmitted
} from "../../actions/events";
import { LocalStorageLedgerActionStore } from "../../actions/ledgerActionStore";
import {
  ActionExecutionStatus,
  initialState,
  reducer
} from "../../actions/reducer";
import useAllowReload from "../../actions/useAllowReload";
import useSideEffect from "../../actions/useSideEffect";
import LedgerActionDialogBody from "../LedgerActionDialogBody";
import SirenActionParametersDialogBody from "../SirenActionParametersDialogBody";
import SwapStatusIcon from "../SwapStatusIcon";
import SwapId from "./SwapId";

interface AssetCellProps {
  asset: Asset;
}

function AssetCell({ asset }: AssetCellProps) {
  return <span>{toMainUnit(asset) + " " + mainUnitSymbol(asset)}</span>;
}

const useStyles = makeStyles(() => ({
  tableRow: {
    cursor: "pointer"
  }
}));

interface SwapRowProps extends RouteComponentProps {
  swap: EmbeddedRepresentationSubEntity;
  reload: () => void;
  setAllowReload: (arg: boolean) => void;
}

function SwapRow({ swap, history, reload, setAllowReload }: SwapRowProps) {
  const [
    {
      state: {
        actionExecutionStatus,
        activeLedgerActionDialog,
        activeSirenParameterDialog,
        activeLedgerActionName
      },
      sideEffect
    },
    dispatch
  ] = useReducer(reducer, initialState);

  useSideEffect(sideEffect, dispatch, reload);
  useAllowReload(
    !!activeLedgerActionDialog || !!activeSirenParameterDialog,
    setAllowReload
  );

  const classes = useStyles();

  const links = swap.links || [];
  const properties = swap.properties as Properties;
  const actions = (swap.actions || []).filter(action => {
    const ledgerActionStore = new LocalStorageLedgerActionStore(
      window.localStorage
    );
    return !ledgerActionStore.isStored(action.name, properties.id);
  });
  const swapLink = links.find(link => link.rel.includes("self"));

  if (!swapLink) {
    throw new Error("Swap does not contain self link.");
  }

  const protocolSpecLink = links.find(link =>
    link.rel.includes("human-protocol-spec")
  );

  function onLedgerActionSuccess(action: string, transactionId?: string) {
    dispatch(ledgerActionSuccessful(properties.id, action, transactionId));
  }

  return (
    <React.Fragment key={swapLink.href}>
      <TableRow
        hover={true}
        onClick={() => {
          history.push("/show_resource" + swapLink.href);
        }}
        className={classes.tableRow}
        data-cy="swap-row"
      >
        <TableCell align="center">
          <SwapStatusIcon status={properties.status} />
        </TableCell>
        <TableCell>
          <SwapId id={properties.id} />
        </TableCell>
        <TableCell>{properties.parameters.alpha_ledger.name}</TableCell>
        <TableCell>
          <AssetCell asset={properties.parameters.alpha_asset} />
        </TableCell>
        <TableCell>{properties.parameters.beta_ledger.name}</TableCell>
        <TableCell>
          <AssetCell asset={properties.parameters.beta_asset} />
        </TableCell>
        <TableCell>
          {protocolSpecLink ? (
            <ExternalLink
              href={protocolSpecLink.href}
              text={properties.protocol}
            />
          ) : (
            properties.protocol
          )}
        </TableCell>

        <TableCell>{properties.role}</TableCell>
        <TableCell>
          {actionExecutionStatus === ActionExecutionStatus.InProgress ? (
            <CircularProgress
              size={30}
              data-cy={"action-request-circular-progress"}
            />
          ) : (
            actions.map(action => (
              <ActionButton
                key={action.name}
                action={action}
                onClick={e => {
                  // otherwise we trigger the onClick handler of the whole row and go to the swap detail page
                  e.stopPropagation();

                  dispatch(actionButtonClicked(action));
                }}
              />
            ))
          )}
        </TableCell>
      </TableRow>
      {activeSirenParameterDialog && (
        <Dialog open={true}>
          <SirenActionParametersDialogBody
            action={activeSirenParameterDialog}
            onClose={() => dispatch(closeSirenParametersDialog())}
            onSubmit={data =>
              dispatch(
                sirenParameterDialogSubmitted(activeSirenParameterDialog, data)
              )
            }
          />
        </Dialog>
      )}
      {activeLedgerActionDialog && activeLedgerActionName && (
        <Dialog open={true}>
          <LedgerActionDialogBody
            action={activeLedgerActionDialog}
            onSuccess={onLedgerActionSuccess.bind(null, activeLedgerActionName)}
            onClose={() => dispatch(closeLedgerActionDialog())}
          />
        </Dialog>
      )}
    </React.Fragment>
  );
}

export default withRouter(SwapRow);
