import {
  Button,
  Card,
  CardActions,
  CircularProgress,
  Grid
} from "@material-ui/core";
import React, { useEffect, useReducer } from "react";
import { Entity } from "../../../gen/siren";
import executeAction from "../../api/executeAction";
import {
  AdditionalProperties,
  CommunicationStatus,
  LedgerKind,
  Properties,
  Role
} from "../../api/swapTypes";
import Dialog from "../../components/Dialog";
import Page from "../../components/Page";
import { SubTitle } from "../../components/text";
import LedgerActionDialogBody from "../SwapList/LedgerActionDialogBody";
import SirenActionParametersDialogBody from "../SwapList/SirenActionParametersDialogBody";
import {
  actionButtonClicked,
  actionFailed,
  actionSuccessful,
  closeLedgerActionDialog,
  closeSirenParametersDialog,
  sirenParameterDialogSubmitted
} from "../SwapList/SwapRow/events";
import {
  ActionExecutionStatus,
  initialState,
  reducer
} from "../SwapList/SwapRow/reducer";
import AssetCard from "./AssetCard";
import CommunicationCardHeader from "./CommunicationCard";
import LedgerCard from "./LedgerCard";
import SwapMetaDataCard from "./SwapMetaDataCard";

interface SwapProps {
  swap: Entity;
  reload: () => void;
}

function Swap({ swap, reload }: SwapProps) {
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

  const actions = (swap.actions || []).map(action => ({
    name: action.name,
    button: (
      <Button
        data-cy={`${action.name}-button`}
        type={"button"}
        key={action.name}
        variant={"contained"}
        onClick={() => {
          dispatch(actionButtonClicked(action));
        }}
      >
        {action.title || action.name}
      </Button>
    )
  }));
  const communicationActions = actions.filter(
    action => action.name === "accept" || action.name === "decline"
  );
  const ledgerActions = actions.filter(
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
      : actions.filter(action => action.name === "redeem");
  const betaLedgerActions =
    properties.role === Role.Alice
      ? actions.filter(action => action.name === "redeem")
      : actions.filter(
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
        activeSirenParameterDialog
      },
      sideEffect
    },
    dispatch
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!sideEffect) {
      return;
    }

    switch (sideEffect.type) {
      case "reloadData": {
        reload();
        return;
      }
      case "executeAction": {
        executeAction(sideEffect.payload.action, sideEffect.payload.data).then(
          response => dispatch(actionSuccessful(response)),
          error => dispatch(actionFailed(error))
        );
        return;
      }
    }
  }, [sideEffect, reload]);

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
                {actionExecutionStatus === ActionExecutionStatus.InProgress ? (
                  <CircularProgress
                    size={30}
                    data-cy={"action-request-circular-progress"}
                  />
                ) : (
                  communicationActions.map(action => action.button)
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
                  actions={alphaLedgerActions}
                  actionInProgress={
                    actionExecutionStatus === ActionExecutionStatus.InProgress
                  }
                />
              </Grid>
              <Grid item={true} xs={6}>
                <LedgerCard
                  ledgerKind={LedgerKind.Beta}
                  ledger={properties.parameters.beta_ledger}
                  ledgerState={properties.state.beta_ledger}
                  otherLedgerState={properties.state.alpha_ledger}
                  role={properties.role}
                  actions={betaLedgerActions}
                  actionInProgress={
                    actionExecutionStatus === ActionExecutionStatus.InProgress
                  }
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

export default Swap;
