import { Card, CardActions, CircularProgress, Grid } from "@material-ui/core";
import React, { useReducer } from "react";
import { Entity } from "../../../gen/siren";
import {
  AdditionalProperties,
  CommunicationStatus,
  LedgerKind,
  Properties,
  Role
} from "../../api/swapTypes";
import ActionButton from "../../components/ActionButton";
import Dialog from "../../components/Dialog";
import Page from "../../components/Page";
import { SubTitle } from "../../components/text";
import {
  actionButtonClicked,
  closeLedgerActionDialog,
  closeSirenParametersDialog,
  ledgerActionSuccessful,
  sirenParameterDialogSubmitted
} from "../actions/events";
import { LocalStorageLedgerActionStore } from "../actions/ledgerActionStore";
import {
  ActionExecutionStatus,
  initialState,
  reducer
} from "../actions/reducer";
import useAllowReload from "../actions/useAllowReload";
import useSideEffect from "../actions/useSideEffect";
import LedgerActionDialogBody from "../SwapList/LedgerActionDialogBody";
import SirenActionParametersDialogBody from "../SwapList/SirenActionParametersDialogBody";
import AssetCard from "./AssetCard";
import CommunicationCardHeader from "./CommunicationCard";
import LedgerCard from "./LedgerCard";
import SwapMetaDataCard from "./SwapMetaDataCard";

const ledgerActionStore = new LocalStorageLedgerActionStore(
  window.localStorage
);

interface SwapProps {
  swap: Entity;
  reload: () => void;
  setAllowReload: (arg: boolean) => void;
}

function Swap({ swap, reload, setAllowReload }: SwapProps) {
  const properties = swap.properties as Properties & AdditionalProperties;
  const [alphaLedger, betaLedger] = [
    properties.parameters.alpha_ledger,
    properties.parameters.beta_ledger
  ];
  const [alphaAsset, betaAsset] = [
    properties.parameters.alpha_asset,
    properties.parameters.beta_asset
  ];

  const [alphaExpiry, betaExpiry] = [
    properties.state.communication.alpha_expiry,
    properties.state.communication.beta_expiry
  ];

  const tradeActions = ["Selling", "Buying"];
  const [alphaTradeAction, betaTradeAction] =
    properties.role === Role.Alice ? tradeActions : tradeActions.reverse();

  const communicationActions = (swap.actions || []).filter(
    action => action.name === "accept" || action.name === "decline"
  );

  const ledgerActions = (swap.actions || []).filter(
    action => action.name !== "accept" && action.name !== "decline"
  );
  const alphaLedgerActions =
    properties.role === Role.Alice
      ? ledgerActions.filter(
          action =>
            action.name === "deploy" ||
            action.name === "fund" ||
            action.name === "refund"
        )
      : ledgerActions.filter(action => action.name === "redeem");
  const betaLedgerActions =
    properties.role === Role.Alice
      ? ledgerActions.filter(action => action.name === "redeem")
      : ledgerActions.filter(
          action =>
            action.name === "deploy" ||
            action.name === "fund" ||
            action.name === "refund"
        );

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

  const isActionInProgress =
    actionExecutionStatus === ActionExecutionStatus.InProgress;

  function onLedgerActionSuccess(action: string, transactionId?: string) {
    dispatch(ledgerActionSuccessful(properties.id, action, transactionId));
  }

  return (
    <React.Fragment>
      <Page title="Swap">
        <Grid container={true} spacing={2} justify="space-evenly">
          <Grid item={true} xs={12}>
            <SwapMetaDataCard
              swapId={properties.id}
              counterparty={properties.counterparty}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <AssetCard
              title="Alpha"
              tradeAction={alphaTradeAction}
              ledger={alphaLedger}
              asset={alphaAsset}
              expiry={alphaExpiry}
            />
          </Grid>
          <Grid item={true} xs={6}>
            <AssetCard
              title="Beta"
              tradeAction={betaTradeAction}
              ledger={betaLedger}
              asset={betaAsset}
              expiry={betaExpiry}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <Card>
              <CommunicationCardHeader
                status={properties.state.communication.status}
                role={properties.role}
              />
              <CardActions>
                {isActionInProgress ? (
                  <CircularProgress
                    size={30}
                    data-cy={"action-request-circular-progress"}
                  />
                ) : (
                  communicationActions.map(action => (
                    <ActionButton
                      key={action.name}
                      action={action}
                      onClick={() => dispatch(actionButtonClicked(action))}
                    />
                  ))
                )}
              </CardActions>
            </Card>
          </Grid>
          {properties.state.communication.status ===
            CommunicationStatus.Accepted && (
            <React.Fragment>
              <Grid item={true} xs={12}>
                <SubTitle text={"Ledger events and actions"} />
              </Grid>
              <Grid item={true} xs={6}>
                <LedgerCard
                  ledgerKind={LedgerKind.Alpha}
                  ledger={properties.parameters.alpha_ledger}
                  ledgerState={properties.state.alpha_ledger}
                  otherLedgerState={properties.state.beta_ledger}
                  role={properties.role}
                  actions={alphaLedgerActions.map(action => {
                    return (
                      <ActionButton
                        key={action.name}
                        action={action}
                        onClick={() => dispatch(actionButtonClicked(action))}
                        actionDoneBefore={ledgerActionStore.isStored(
                          action.name,
                          properties.id
                        )}
                      />
                    );
                  })}
                  isActionInProgress={isActionInProgress}
                />
              </Grid>
              <Grid item={true} xs={6}>
                <LedgerCard
                  ledgerKind={LedgerKind.Beta}
                  ledger={properties.parameters.beta_ledger}
                  ledgerState={properties.state.beta_ledger}
                  otherLedgerState={properties.state.alpha_ledger}
                  role={properties.role}
                  actions={betaLedgerActions.map(action => {
                    return (
                      <ActionButton
                        key={action.name}
                        action={action}
                        onClick={() => dispatch(actionButtonClicked(action))}
                        actionDoneBefore={ledgerActionStore.isStored(
                          action.name,
                          properties.id
                        )}
                      />
                    );
                  })}
                  isActionInProgress={isActionInProgress}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
      </Page>
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
            actionDoneBefore={ledgerActionStore.isStored(
              activeLedgerActionName,
              properties.id
            )}
          />
        </Dialog>
      )}
    </React.Fragment>
  );
}

export default Swap;
