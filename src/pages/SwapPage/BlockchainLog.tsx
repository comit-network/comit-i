import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography
} from "@material-ui/core";
import React from "react";
import { HtlcState, LedgerState, Role } from "../../api/getSwap";

interface LedgerCardProps {
  ledgerName: string;
  state: LedgerState;
  actions: Array<{ action: string; button: React.ReactNode }>;
}

function LedgerCard({ ledgerName, state, actions }: LedgerCardProps) {
  let transactions = [
    { verb: "deployed", hash: state.deploy_tx },
    { verb: "funded", hash: state.fund_tx },
    { verb: "redeemed", hash: state.redeem_tx },
    { verb: "refunded", hash: state.refund_tx }
  ];

  if (state.deploy_tx === state.fund_tx) {
    transactions = transactions.slice(1);
  }

  /* TODO: Link to a blockchain explorer if network is mainnet or
     testnet */
  /* TODO: Display transaction times if possible */
  return (
    <Card>
      <CardHeader title={ledgerName} />
      <CardContent>
        {state.status !== HtlcState.NotDeployed ? (
          transactions
            .filter(tx => !!tx.hash)
            .map(tx => {
              return (
                <React.Fragment key={tx.verb}>
                  <Typography>HTLC {tx.verb} with transaction</Typography>
                  <Typography noWrap={true}>{tx.hash}</Typography>
                </React.Fragment>
              );
            })
        ) : (
          <Typography>No recorded events</Typography>
        )}
      </CardContent>
      <CardActions>{actions.map(elem => elem.button)}</CardActions>
    </Card>
  );
}

interface BlockchainLogProps {
  alphaState: LedgerState;
  betaState: LedgerState;
  role: Role;
  actions: Array<{ action: string; button: React.ReactNode }>;
}

function BlockchainLog({
  alphaState,
  betaState,
  role,
  actions
}: BlockchainLogProps) {
  const alphaActions =
    role === Role.Alice
      ? actions.filter(
          elem =>
            elem.action === "deploy" ||
            elem.action === "fund" ||
            elem.action === "refund"
        )
      : actions.filter(elem => elem.action === "redeem");
  const betaActions =
    role === Role.Alice
      ? actions.filter(elem => elem.action === "redeem")
      : actions.filter(
          elem =>
            elem.action === "deploy" ||
            elem.action === "fund" ||
            elem.action === "refund"
        );

  return (
    <React.Fragment>
      <Grid item={true} xs={6}>
        <LedgerCard
          ledgerName="Alpha"
          state={alphaState}
          actions={alphaActions}
        />
      </Grid>
      <Grid item={true} xs={6}>
        <LedgerCard ledgerName="Beta" state={betaState} actions={betaActions} />
      </Grid>
    </React.Fragment>
  );
}

export default BlockchainLog;
