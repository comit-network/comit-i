import { Card, CardActions, Grid } from "@material-ui/core";
import React from "react";
import { CommunicationStatus, GetSwapResponse } from "../../api/swapResource";
import { Role } from "../../api/swapTypes";
import actionDialogs from "../../components/ActionDialogs";
import Page from "../../components/Page";
import { SubTitle } from "../../components/text";
import AssetCard from "./AssetCard";
import BlockchainLog from "./BlockchainLog";
import CommunicationCardHeader from "./CommunicationCard";

interface SwapProps {
  swap: GetSwapResponse;
}

function Swap({ swap }: SwapProps) {
  const [alphaLedger, betaLedger] = [
    swap.properties.parameters.alpha_ledger,
    swap.properties.parameters.beta_ledger
  ];
  const [alphaAsset, betaAsset] = [
    swap.properties.parameters.alpha_asset,
    swap.properties.parameters.beta_asset
  ];

  const [alphaExpiry, betaExpiry] = [
    swap.properties.state.communication.alpha_expiry,
    swap.properties.state.communication.beta_expiry
  ];

  const tradeActions = ["Selling", "Buying"];
  const [alphaTradeAction, betaTradeAction] =
    swap.properties.role === Role.Alice ? tradeActions : tradeActions.reverse();

  const actions = actionDialogs(
    swap.links,
    swap.properties.role,
    alphaLedger,
    betaLedger
  );

  const communicationActionsButtons = actions.buttons.filter(
    elem => elem.action === "accept" || elem.action === "decline"
  );
  const ledgerActionsButtons = actions.buttons.filter(
    elem => !(elem.action === "accept" || elem.action === "decline")
  );

  return (
    <React.Fragment>
      <Page title="Swap">
        <Grid container={true} spacing={16} justify="space-evenly">
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
                status={swap.properties.state.communication.status}
                role={swap.properties.role}
              />
              <CardActions>
                {communicationActionsButtons.map(elem => elem.button)}
              </CardActions>
            </Card>
          </Grid>
          {swap.properties.state.communication.status ===
            CommunicationStatus.Accepted && (
            <React.Fragment>
              <Grid item={true} xs={12}>
                <SubTitle text={"Ledger events and actions"} />
              </Grid>
              <BlockchainLog
                alphaState={swap.properties.state.alpha_ledger}
                betaState={swap.properties.state.beta_ledger}
                role={swap.properties.role}
                actions={ledgerActionsButtons}
              />
            </React.Fragment>
          )}
        </Grid>
      </Page>
      {actions.dialogs}
    </React.Fragment>
  );
}

export default Swap;
