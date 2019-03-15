import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";
import AssetSelect from "./AssetSelect";
import LedgerSelect from "./LedgerSelect";
import NetworkSelect from "./NetworkSelect";
import QuantityText from "./QuantityTextField";

const useLedgerFieldSetStyles = makeStyles(theme => ({
  // TODO: Hard-coded values should instead be derived from theme. Create issue in MaterialUI repo
  root: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: theme.shape.borderRadius,
    borderColor:
      theme.palette.type === "light"
        ? "rgba(0, 0, 0, 0.42)"
        : "rgba(255, 255, 255, 0.7)"
  }
}));

interface LedgerFieldSetProps {
  label: string;
  ledger: string;
  setLedger: (ledger: string) => void;
  network: string;
  setNetwork: (network: string) => void;
  asset: string;
  setAsset: (asset: string) => void;
  quantity: string;
  setQuantity: (quantity: string) => void;
  otherLedger: string;
}

function LedgerFieldSet({
  label,
  ledger,
  setLedger,
  network,
  setNetwork,
  asset,
  setAsset,
  quantity,
  setQuantity,
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
        <Grid item={true} xs={12} container={true} spacing={0}>
          <Grid item={true} xs={12} md={6}>
            <AssetSelect
              ledger={ledger}
              selected={asset}
              setSelected={setAsset}
              label={"Asset"}
            />
          </Grid>
          <Grid item={true} xs={12} md={6}>
            <QuantityText selected={quantity} setSelected={setQuantity} />
          </Grid>
        </Grid>
      )}
    </fieldset>
  );
}

export default LedgerFieldSet;
