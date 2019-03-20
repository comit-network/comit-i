import { makeStyles } from "@material-ui/styles";
import React, { Dispatch } from "react";
import AssetSelect, { Asset, AssetAction } from "./AssetSelect";
import LedgerSelect, { Ledger, LedgerAction } from "./LedgerSelect";

const useLedgerFieldSetStyles = makeStyles(theme => ({
  root: theme.mixins.border(theme)
}));

interface LedgerFieldSetProps {
  label: string;
  ledger: Ledger;
  ledgerDispatch: Dispatch<LedgerAction>;
  asset: Asset;
  assetDispatch: Dispatch<AssetAction>;
  otherLedger: Ledger;
}

function LedgerFieldSet({
  label,
  ledger,
  ledgerDispatch,
  asset,
  assetDispatch,
  otherLedger
}: LedgerFieldSetProps) {
  const classes = useLedgerFieldSetStyles();

  return (
    <fieldset className={classes.root}>
      <legend>{label}</legend>
      <LedgerSelect
        ledger={ledger}
        dispatch={ledgerDispatch}
        disabledValues={[otherLedger.name]}
      />
      {ledger.name && (
        <AssetSelect
          ledger={ledger.name}
          asset={asset}
          dispatch={assetDispatch}
        />
      )}
    </fieldset>
  );
}

export default LedgerFieldSet;
