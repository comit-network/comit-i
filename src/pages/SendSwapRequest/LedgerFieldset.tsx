import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import AssetSelect, { Asset, AssetAction } from "./AssetSelect";
import LedgerSelect from "./LedgerSelect";
import NetworkSelect from "./NetworkSelect";

const useLedgerFieldSetStyles = makeStyles(theme => ({
  root: theme.mixins.border(theme)
}));

interface LedgerFieldSetProps {
  label: string;
  ledger: string;
  setLedger: (ledger: string) => void;
  network: string;
  setNetwork: (network: string) => void;
  asset: Asset;
  assetDispatch: (assetAction: AssetAction) => void;
  otherLedger: string;
}

function LedgerFieldSet({
  label,
  ledger,
  setLedger,
  network,
  setNetwork,
  asset,
  assetDispatch,
  otherLedger
}: LedgerFieldSetProps) {
  const classes = useLedgerFieldSetStyles();

  return (
    <fieldset className={classes.root}>
      <legend>{label}</legend>
      <Grid item={true} xs={12} container={true} spacing={0}>
        <Grid item={true} xs={12} md={6}>
          <LedgerSelect
            disabledValues={[otherLedger]}
            selected={ledger}
            setSelected={setLedger}
            label={"Ledger"}
          />
        </Grid>
        {ledger && (
          <Grid item={true} xs={12} md={6}>
            <NetworkSelect
              ledger={ledger}
              selected={network}
              setSelected={setNetwork}
              label={"Network"}
            />
          </Grid>
        )}
      </Grid>
      {ledger && (
        <AssetSelect
          ledger={ledger}
          asset={asset}
          assetDispatch={assetDispatch}
        />
      )}
    </fieldset>
  );
}

export default LedgerFieldSet;
