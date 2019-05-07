import { Grid, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import titleCase from "title-case";
import TextField from "../components/TextField";

const useRfc003ParamsStyles = makeStyles({
  grid: {
    /* FIXME: border-bottom does not respect the margin completely with
     * this style */
    overflow: "hidden"
  }
});

interface Rfc003ParamsProps {
  alphaLedger: string;
  betaLedger: string;
  params: Rfc003Params;
  setParams: (params: Rfc003Params) => void;
}

export interface Rfc003Params {
  alpha_expiry: number;
  beta_expiry: number;
  alpha_ledger_refund_identity?: string;
  beta_ledger_redeem_identity?: string;
}

export const defaultRfc003Params: Rfc003Params = {
  alpha_expiry: 30,
  beta_expiry: 15,
  alpha_ledger_refund_identity: undefined,
  beta_ledger_redeem_identity: undefined
};

export function resetParams(currentParams: Rfc003Params) {
  return {
    ...currentParams,
    alpha_ledger_refund_identity:
      defaultRfc003Params.alpha_ledger_refund_identity,
    beta_ledger_redeem_identity: defaultRfc003Params.beta_ledger_redeem_identity
  };
}

function Rfc003ParamsForm({
  alphaLedger,
  betaLedger,
  params,
  setParams
}: Rfc003ParamsProps) {
  const classes = useRfc003ParamsStyles();
  const {
    alpha_expiry,
    beta_expiry,
    alpha_ledger_refund_identity,
    beta_ledger_redeem_identity
  } = params;

  const parseExpiry = (expiry: string) => {
    return expiry !== "" ? parseInt(expiry, 10) : undefined;
  };

  function LedgerFields(
    ledger: string,
    expiryKey: string,
    identityKey: string,
    expiry: number,
    identity: string | undefined
  ) {
    const expiryLabel = titleCase(expiryKey);
    const identityLabel = titleCase(identityKey);

    return (
      <Grid item={true} xs={12} container={true} spacing={0}>
        <Grid item={true} md={6} xs={12}>
          <TextField
            required={true}
            label={expiryLabel}
            value={expiry || ""}
            onChange={event => {
              setParams({
                ...params,
                [expiryKey]: parseExpiry(event.target.value)
              });
            }}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">min</InputAdornment>
            }}
            data-cy={expiryKey.split("_").join("-") + "-input"}
          />
        </Grid>
        {ledger === "ethereum" && (
          <Grid className={classes.grid} item={true} md={6} xs={12}>
            <TextField
              required={true}
              label={identityLabel}
              value={identity || ""}
              onChange={event => {
                setParams({
                  ...params,
                  [identityKey]: event.target.value
                });
              }}
              data-cy={identityKey.split("_").join("-") + "-input"}
            />
          </Grid>
        )}
      </Grid>
    );
  }

  return (
    <React.Fragment>
      {LedgerFields(
        alphaLedger,
        "alpha_expiry",
        "alpha_ledger_refund_identity",
        alpha_expiry,
        alpha_ledger_refund_identity
      )}
      {LedgerFields(
        betaLedger,
        "beta_expiry",
        "beta_ledger_redeem_identity",
        beta_expiry,
        beta_ledger_redeem_identity
      )}
    </React.Fragment>
  );
}

export default Rfc003ParamsForm;
