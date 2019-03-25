import { Grid, InputAdornment, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

const useRfc003ParamsStyles = makeStyles(theme => ({
  expiry: {
    margin: theme.spacing.unit,
    width: "10rem"
  },
  identity: {
    margin: theme.spacing.unit,
    width: "100%"
  },
  grid: {
    /* FIXME: border-bottom does not respect the margin completely with
     * this style */
    overflow: "hidden"
  }
}));

interface Rfc003ParamsProps {
  alphaLedger: string;
  betaLedger: string;
  params: Rfc003Params;
  setParams: (params: Rfc003Params) => void;
}

export interface Rfc003Params {
  alphaExpiry?: number;
  betaExpiry?: number;
  alphaRefundIdentity?: string;
  betaRedeemIdentity?: string;
}

export const defaultRfc003Params = {
  alphaExpiry: 30,
  betaExpiry: 15,
  alphaRefundIdentity: undefined,
  betaRedeemIdentity: undefined
};

export function resetParams(currentParams: Rfc003Params) {
  return {
    ...currentParams,
    alphaRefundIdentity: defaultRfc003Params.alphaRefundIdentity,
    betaRedeemIdentity: defaultRfc003Params.betaRedeemIdentity
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
    alphaExpiry,
    betaExpiry,
    alphaRefundIdentity,
    betaRedeemIdentity
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
            className={classes.expiry}
            label="Alpha Expiry"
            value={alphaExpiry || ""}
            onChange={event => {
              setParams({
                ...params,
                alphaExpiry: parseExpiry(event.target.value)
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
              className={classes.identity}
              label="Alpha Refund Identity"
              value={alphaRefundIdentity || ""}
              onChange={event =>
                setParams({
                  ...params,
                  alphaRefundIdentity: event.target.value
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
            className={classes.expiry}
            label="Beta Expiry"
            value={betaExpiry || ""}
            onChange={event =>
              setParams({
                ...params,
                betaExpiry: parseExpiry(event.target.value)
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
              className={classes.identity}
              label="Beta Redeem Identity"
              value={betaRedeemIdentity || ""}
              onChange={event =>
                setParams({
                  ...params,
                  betaRedeemIdentity: event.target.value
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
