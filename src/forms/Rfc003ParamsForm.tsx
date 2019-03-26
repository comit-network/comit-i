import { Grid, InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
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
  alpha_expiry?: number;
  beta_expiry?: number;
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

  return (
    <React.Fragment>
      <Grid item={true} xs={12} container={true} spacing={0}>
        <Grid item={true} md={6} xs={12}>
          <TextField
            required={true}
            label="Alpha Expiry"
            value={alpha_expiry || ""}
            onChange={event => {
              setParams({
                ...params,
                alpha_expiry: parseExpiry(event.target.value)
              });
            }}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">min</InputAdornment>
            }}
            data-cy="alpha-expiry-input"
          />
        </Grid>
        {alphaLedger === "ethereum" && (
          <Grid className={classes.grid} item={true} md={6} xs={12}>
            <TextField
              required={true}
              label="Alpha Refund Identity"
              value={alpha_ledger_refund_identity || ""}
              onChange={event =>
                setParams({
                  ...params,
                  alpha_ledger_refund_identity: event.target.value
                })
              }
              data-cy="alpha-refund-identity-input"
            />
          </Grid>
        )}
      </Grid>
      <Grid item={true} xs={12} container={true} spacing={0}>
        <Grid item={true} md={6} xs={12}>
          <TextField
            required={true}
            label="Beta Expiry"
            value={beta_expiry || ""}
            onChange={event =>
              setParams({
                ...params,
                beta_expiry: parseExpiry(event.target.value)
              })
            }
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">min</InputAdornment>
            }}
            data-cy="beta-expiry-input"
          />
        </Grid>
        {betaLedger === "ethereum" && (
          <Grid className={classes.grid} item={true} md={6} xs={12}>
            <TextField
              required={true}
              label="Beta Redeem Identity"
              value={beta_ledger_redeem_identity || ""}
              onChange={event =>
                setParams({
                  ...params,
                  beta_ledger_redeem_identity: event.target.value
                })
              }
              data-cy="beta-redeem-identity-input"
            />
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
}

export default Rfc003ParamsForm;
