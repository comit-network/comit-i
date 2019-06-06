import { Grid } from "@material-ui/core";
import React from "react";
import { Ledger, LedgerKind, LedgerState, Role } from "../../api/swapTypes";
import LedgerCard from "./LedgerCard";

interface Rfc003BlockchainLogProps {
  alphaState: LedgerState;
  alphaLedger: Ledger;
  betaState: LedgerState;
  betaLedger: Ledger;
  role: Role;
  actions: Array<{ name: string; button: React.ReactNode }>;
  actionInProgress: boolean;
}

function Rfc003BlockchainLog({
  alphaState,
  alphaLedger,
  betaState,
  betaLedger,
  role,
  actions,
  actionInProgress
}: Rfc003BlockchainLogProps) {
  const alphaActions =
    role === Role.Alice
      ? actions.filter(
          elem =>
            elem.name === "deploy" ||
            elem.name === "fund" ||
            elem.name === "refund"
        )
      : actions.filter(elem => elem.name === "redeem");
  const betaActions =
    role === Role.Alice
      ? actions.filter(elem => elem.name === "redeem")
      : actions.filter(
          elem =>
            elem.name === "deploy" ||
            elem.name === "fund" ||
            elem.name === "refund"
        );

  return (
    <React.Fragment>
      <Grid item={true} xs={6}>
        <LedgerCard
          ledgerKind={LedgerKind.Alpha}
          ledger={alphaLedger}
          ledgerState={alphaState}
          otherLedgerState={betaState}
          role={role}
          actions={alphaActions}
          actionInProgress={actionInProgress}
        />
      </Grid>
      <Grid item={true} xs={6}>
        <LedgerCard
          ledgerKind={LedgerKind.Beta}
          ledger={betaLedger}
          ledgerState={betaState}
          otherLedgerState={alphaState}
          role={role}
          actions={betaActions}
          actionInProgress={actionInProgress}
        />
      </Grid>
    </React.Fragment>
  );
}

export default Rfc003BlockchainLog;
