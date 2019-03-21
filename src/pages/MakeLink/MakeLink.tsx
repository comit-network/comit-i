import { Grid, Paper, Typography } from "@material-ui/core";
import React, { useReducer, useState } from "react";
import URI from "urijs";
import Fieldset from "../../components/Fieldset";
import Page from "../../components/Page";
import { SubTitle } from "../../components/text";
import TextField from "../../components/TextField";
import SwapForm, {
  emptySwap,
  reducer as swapReducer,
  SwapValue
} from "../../forms/SwapForm";
import ledgers from "../../ledgerSpec";

const MakeLink = () => {
  const [swap, dispatch] = useReducer(swapReducer, emptySwap);
  const [protocol, setProtocol] = useState("");

  let uri = URI("web+comit:swap");

  const alphaLedgerQueryValue = ledgerToQueryValue(swap.alpha_ledger);
  if (alphaLedgerQueryValue) {
    uri = uri.addQuery("alpha_ledger", alphaLedgerQueryValue);
  }

  const betaLedgerQueryValue = ledgerToQueryValue(swap.beta_ledger);
  if (betaLedgerQueryValue) {
    uri = uri.addQuery("beta_ledger", betaLedgerQueryValue);
  }

  const alphaAssetQueryValue = assetToQueryValue(swap.alpha_asset);
  if (alphaAssetQueryValue) {
    uri = uri.addQuery("alpha_asset", alphaAssetQueryValue);
  }

  const betaAssetQueryValue = assetToQueryValue(swap.beta_asset);
  if (betaAssetQueryValue) {
    uri = uri.addQuery("beta_asset", betaAssetQueryValue);
  }

  if (protocol) {
    uri = uri.addQuery("protocol", protocol);
  }

  return (
    <Page title={"Create a new swap link"}>
      <Grid container={true} spacing={40}>
        <SwapForm swap={swap} ledgers={ledgers} dispatch={dispatch} />
        <Grid item={true} xs={12}>
          <Fieldset legend="Protocol">
            <TextField
              label={"Protocol"}
              required={true}
              value={protocol}
              onChange={event => {
                setProtocol(event.target.value);
              }}
              select={true}
              SelectProps={{
                native: true
              }}
            >
              <option value={""} />
              <option value={"rfc003"}>RFC003</option>
            </TextField>
          </Fieldset>
        </Grid>
        <Grid item={true} xs={12}>
          <SubTitle text={"The generated link"} />
          <Paper elevation={2}>
            <Typography variant={"body2"} align={"center"}>
              {uri.toString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};

export default MakeLink;

function ledgerToQueryValue(value: SwapValue) {
  if (value.network) {
    switch (value.name) {
      case "bitcoin":
      case "ethereum": {
        return `${value.name}-${value.network}`;
      }
    }
  }
}

function assetToQueryValue(value: SwapValue) {
  if (value.quantity) {
    switch (value.name) {
      case "bitcoin": {
        return `${value.quantity}BTC`;
      }
      case "ether": {
        return `${value.quantity}ETH`;
      }
    }
  }
}
