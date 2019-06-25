import {
  CircularProgress,
  TableCell,
  TableRow,
  Tooltip
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useReducer } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { EmbeddedRepresentationSubEntity } from "../../../../gen/siren";
import { Asset, Ledger, Properties, Role } from "../../../api/swapTypes";
import { mainUnitSymbol, toMainUnit } from "../../../api/unit";
import ActionButton from "../../../components/ActionButton";
import Dialog from "../../../components/Dialog";
import ExternalLink from "../../../components/ExternalLink";
import {
  actionButtonClicked,
  closeLedgerActionDialog,
  closeSirenParametersDialog,
  sirenParameterDialogSubmitted
} from "../../actions/events";
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
        activeSirenParameterDialog
      },
      sideEffect
    },
    dispatch
  ] = useReducer(reducer, initialState);

  useSideEffect(reload, dispatch, sideEffect);
  useAllowReload(
    !!activeLedgerActionDialog || !!activeSirenParameterDialog,
    setAllowReload
  );

  const classes = useStyles();

  const links = swap.links || [];
  const properties = swap.properties as Properties;
  const actions = swap.actions || [];
  const swapLink = links.find(link => link.rel.includes("self"));

  if (!swapLink) {
    throw new Error("Swap does not contain self link.");
  }

  const protocolSpecLink = links.find(link =>
    link.rel.includes("human-protocol-spec")
  );

  const assets = [
    properties.parameters.alpha_asset,
    properties.parameters.beta_asset
  ];
  const [sellAsset, buyAsset] =
    properties.role === Role.Alice ? assets : assets.reverse();

  const ledgers = [
    properties.parameters.alpha_ledger,
    properties.parameters.beta_ledger
  ];
  const [sellLedger, buyLedger] =
    properties.role === Role.Alice ? ledgers : ledgers.reverse();

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
        <TableCell>
          <AssetCell asset={buyAsset} ledger={buyLedger} />
        </TableCell>
        <TableCell>
          <AssetCell asset={sellAsset} ledger={sellLedger} />
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
      {activeLedgerActionDialog && (
        <Dialog open={true}>
          <LedgerActionDialogBody
            action={activeLedgerActionDialog}
            onClose={() => dispatch(closeLedgerActionDialog())}
          />
        </Dialog>
      )}
    </React.Fragment>
  );
}

interface AssetCellProps {
  asset: Asset;
  ledger: Ledger;
}

function AssetCell({ asset, ledger }: AssetCellProps) {
  return (
    <Tooltip title={"On " + ledger.name + " " + ledger.network}>
      <span>{toMainUnit(asset) + " " + mainUnitSymbol(asset)}</span>
    </Tooltip>
  );
}

export default withRouter(SwapRow);
