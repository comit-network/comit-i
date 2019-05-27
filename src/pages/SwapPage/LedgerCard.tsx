import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography
} from "@material-ui/core";
import React from "react";
import { HtlcState, LedgerState } from "../../api/swapResource";
import { Ledger } from "../../api/swapTypes";
import ExplorerLink, { ResourceType } from "./ExplorerLink";
import HtlcLocationTypography from "./HtlcLocationTypography";

interface LedgerCardProps {
  ledgerKind: string;
  ledger: Ledger;
  state: LedgerState;
  actions: Array<{ action: string; button: React.ReactNode }>;
}

function LedgerCard({ ledgerKind, ledger, state, actions }: LedgerCardProps) {
  let transactions = [
    { verb: "deployed", hash: state.deploy_tx },
    { verb: "funded", hash: state.fund_tx },
    { verb: "redeemed", hash: state.redeem_tx },
    { verb: "refunded", hash: state.refund_tx }
  ];

  if (state.deploy_tx === state.fund_tx) {
    transactions = transactions.slice(1);
  }

  /* TODO: Display transaction times when possible */
  return (
    <Card>
      <CardHeader title={ledgerKind} />
      <CardContent>
        {state.htlc_location && (
          <HtlcLocationTypography
            ledger={ledger}
            location={state.htlc_location}
          />
        )}
        {state.status !== HtlcState.NotDeployed ? (
          transactions
            .filter(tx => !!tx.hash)
            .map(tx => {
              return (
                <React.Fragment key={tx.verb}>
                  <Typography>HTLC {tx.verb} with transaction</Typography>
                  <ExplorerLink
                    ledger={ledger}
                    hash={tx.hash}
                    resourceType={ResourceType.Transaction}
                  />
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

export default LedgerCard;
