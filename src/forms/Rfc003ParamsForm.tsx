import { Grid, InputAdornment } from "@material-ui/core";
import React from "react";
import EthereumAddressTextField from "../components/EthereumAddressTextField";
import TextField from "../components/TextField";

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
  alpha_expiry: 5,
  beta_expiry: 3,
  alpha_ledger_refund_identity: undefined,
  beta_ledger_redeem_identity: undefined
};

export function resetAlphaIdentity(currentParams: Rfc003Params) {
  return {
    ...currentParams,
    alpha_ledger_refund_identity:
      defaultRfc003Params.alpha_ledger_refund_identity
  };
}

export function resetBetaIdentity(currentParams: Rfc003Params) {
  return {
    ...currentParams,
    beta_ledger_redeem_identity: defaultRfc003Params.beta_ledger_redeem_identity
  };
}

interface ExpiryInputProps {
  value: number;
  label: string;
  onChange: (expiry: string) => void;
  dataCy: string;
}

function ExpiryInput({ value, label, onChange, dataCy }: ExpiryInputProps) {
  return (
    <TextField
      required={true}
      label={label}
      value={value || ""}
      onChange={event => onChange(event.target.value)}
      type="number"
      InputProps={{
        endAdornment: <InputAdornment position="end">min</InputAdornment>
      }}
      data-cy={dataCy}
    />
  );
}

function Rfc003ParamsForm({
  alphaLedger,
  betaLedger,
  params,
  setParams
}: Rfc003ParamsProps) {
  const {
    alpha_expiry,
    beta_expiry,
    alpha_ledger_refund_identity,
    beta_ledger_redeem_identity
  } = params;

  const parseExpiry = (expiry: string) => {
    return parseInt(expiry, 10);
  };

  return (
    <React.Fragment>
      <Grid item={true} xs={12} container={true} spacing={0}>
        <Grid item={true} md={6} xs={12}>
          <ExpiryInput
            value={alpha_expiry}
            label="Alpha Expiry"
            onChange={(expiry: string) => {
              setParams({
                ...params,
                alpha_expiry: parseExpiry(expiry)
              });
            }}
            dataCy="alpha-expiry-input"
          />
        </Grid>
        {alphaLedger === "ethereum" && (
          <Grid item={true} md={6} xs={12}>
            <EthereumAddressTextField
              required={true}
              label="Alpha Refund Identity"
              value={alpha_ledger_refund_identity || ""}
              onChange={event =>
                setParams({
                  ...params,
                  alpha_ledger_refund_identity: event.target.value
                })
              }
              onAddress={address =>
                setParams({
                  ...params,
                  alpha_ledger_refund_identity: address
                })
              }
              data-cy="alpha-refund-identity-input"
            />
          </Grid>
        )}
      </Grid>
      <Grid item={true} xs={12} container={true} spacing={0}>
        <Grid item={true} md={6} xs={12}>
          <ExpiryInput
            value={beta_expiry}
            label="Beta Expiry"
            onChange={(expiry: string) => {
              setParams({
                ...params,
                beta_expiry: parseExpiry(expiry)
              });
            }}
            dataCy="beta-expiry-input"
          />
        </Grid>
        {betaLedger === "ethereum" && (
          <Grid item={true} md={6} xs={12}>
            <EthereumAddressTextField
              required={true}
              label="Beta Redeem Identity"
              value={beta_ledger_redeem_identity || ""}
              onChange={event =>
                setParams({
                  ...params,
                  beta_ledger_redeem_identity: event.target.value
                })
              }
              onAddress={address =>
                setParams({
                  ...params,
                  beta_ledger_redeem_identity: address
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
