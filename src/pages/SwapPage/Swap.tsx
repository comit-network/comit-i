import { Card, CardActions, Grid } from "@material-ui/core";
import React from "react";
import {
  Role,
  Swap as SwapResource /* Link, Ledger */
} from "../../api/getSwap";
import actionDialogs from "../../components/ActionDialogs";
import Page from "../../components/Page";
import AssetCard from "./AssetCard";
import CommunicationCardHeader from "./CommunicationCard";

interface SwapProps {
  swap: SwapResource;
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

  return (
    <React.Fragment>
      <Page title="Swap">
        <Grid container={true} spacing={32} justify="space-evenly">
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
                {actions.buttons
                  .filter(
                    elem =>
                      elem.action === "accept" || elem.action === "decline"
                  )
                  .map(elem => elem.button)}
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Page>
      {actions.dialogs}
    </React.Fragment>
  );
}

export default Swap;
