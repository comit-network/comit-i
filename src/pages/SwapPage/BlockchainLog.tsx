import { Grid } from "@material-ui/core";
import React from "react";
import { LedgerState } from "../../api/swapResource";
import { Ledger, Role } from "../../api/swapTypes";
import LedgerCard from "./LedgerCard";

interface Rfc003BlockchainLogProps {
  alphaState: LedgerState;
  alphaLedger: Ledger;
  betaState: LedgerState;
  betaLedger: Ledger;
  role: Role;
  actions: Array<{ action: string; button: React.ReactNode }>;
}

function Rfc003BlockchainLog({
  alphaState,
  alphaLedger,
  betaState,
  betaLedger,
  role,
  actions
}: Rfc003BlockchainLogProps) {
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
          ledgerKind="Alpha"
          ledger={alphaLedger}
          state={alphaState}
          actions={alphaActions}
        />
      </Grid>
      <Grid item={true} xs={6}>
        <LedgerCard
          ledgerKind="Beta"
          ledger={betaLedger}
          state={betaState}
          actions={betaActions}
        />
      </Grid>
    </React.Fragment>
  );
}

export default Rfc003BlockchainLog;
