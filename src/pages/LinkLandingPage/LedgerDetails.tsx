import { Typography } from "@material-ui/core";
import React from "react";
import Fieldset from "../../components/Fieldset";
import { Asset, Ledger } from "./LinkLandingPage";

interface LedgerDetailProps {
  label: string;
  ledger: Ledger;
  asset: Asset;
}

function LedgerDetail({ label, ledger, asset }: LedgerDetailProps) {
  return (
    <Fieldset legend={label}>
      <Typography variant="body2">
        Ledger: {ledger.name} on {ledger.network}
        <br />
        Asset: {asset.amount} {asset.symbol}
        {asset.tokenId && (
          <React.Fragment>
            <br />
            {`Token ID ${asset.tokenId}`}
          </React.Fragment>
        )}
      </Typography>
    </Fieldset>
  );
}

export default LedgerDetail;
