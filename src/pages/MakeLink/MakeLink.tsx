import { Button, Grid, Paper, Tooltip, Typography } from "@material-ui/core";
import CheckCircleOutlined from "@material-ui/icons/CheckCircleOutlined";
import ErrorOutlined from "@material-ui/icons/ErrorOutlined";
import FileCopy from "@material-ui/icons/FileCopy";
import copy from "copy-to-clipboard";
import React, { useReducer, useState } from "react";
import { toBitcoin } from "satoshi-bitcoin-ts";
import URI from "urijs";
import { fromWei } from "web3-utils";
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
  const [peer, setPeer] = useState("");
  const [addressHint, setAddressHint] = useState("");

  let comitLink = new URI({
    protocol: "web+comit",
    hostname: "swap"
  });

  const alphaLedgerQueryValue = ledgerToQueryValue(swap.alpha_ledger);
  if (alphaLedgerQueryValue) {
    comitLink = comitLink.addQuery("alpha_ledger", alphaLedgerQueryValue);
  }

  const betaLedgerQueryValue = ledgerToQueryValue(swap.beta_ledger);
  if (betaLedgerQueryValue) {
    comitLink = comitLink.addQuery("beta_ledger", betaLedgerQueryValue);
  }

  const alphaAssetQueryValue = assetToQueryValue(swap.alpha_asset);
  if (alphaAssetQueryValue) {
    comitLink = comitLink.addQuery("alpha_asset", alphaAssetQueryValue);
  }

  const betaAssetQueryValue = assetToQueryValue(swap.beta_asset);
  if (betaAssetQueryValue) {
    comitLink = comitLink.addQuery("beta_asset", betaAssetQueryValue);
  }

  if (protocol) {
    comitLink = comitLink.addQuery("protocol", protocol);
  }

  if (peer) {
    if (addressHint) {
      const peerWithAddress = `${peer}@${addressHint}`;
      comitLink = comitLink.addQuery("peer", peerWithAddress);
    } else {
      comitLink = comitLink.addQuery("peer", peer);
    }
  }

  const linkIsValid =
    alphaLedgerQueryValue &&
    betaLedgerQueryValue &&
    alphaAssetQueryValue &&
    betaAssetQueryValue &&
    protocol &&
    peer;

  const icon = linkIsValid ? (
    <CheckCircleOutlined color={"primary"} />
  ) : (
    <ErrorOutlined color={"error"} />
  );
  const button = (
    <Button
      size={"small"}
      disabled={!linkIsValid}
      onClick={() => {
        copy(comitLink.toString());
      }}
    >
      Copy <FileCopy />
    </Button>
  );

  return (
    <Page title={"Create a new swap link"}>
      <Grid container={true} spacing={40}>
        <SwapForm swap={swap} ledgers={ledgers} dispatch={dispatch} />
        <Grid item={true} xs={12}>
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
        </Grid>
        <Grid item={true} xs={12} md={6}>
          <TextField
            value={peer}
            onChange={event => setPeer(event.target.value)}
            label={"Peer"}
            helperText={"Peer ID"}
          />
        </Grid>
        <Grid item={true} xs={12} md={6}>
          <TextField
            value={addressHint}
            onChange={event => setAddressHint(event.target.value)}
            label={"Peer Address Hint"}
            helperText={"Hint for the peer address in multiaddress format"}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <SubTitle text={"The generated link"} />
          <Paper elevation={2}>
            <Grid container={true} spacing={16} alignItems={"center"}>
              <Grid item={true} container={true} xs={2} justify={"center"}>
                {icon}
              </Grid>
              <Grid item={true} xs={8}>
                <Typography noWrap={true} variant={"body2"} align={"center"}>
                  {comitLink.toString()}
                </Typography>
              </Grid>
              <Grid item={true} container={true} xs={2} justify={"center"}>
                {!linkIsValid ? (
                  <Tooltip
                    title={"Please complete the form before copying the link."}
                  >
                    <span>{button}</span>
                  </Tooltip>
                ) : (
                  <Tooltip
                    disableHoverListener={true}
                    title={"Link has been copied to clipboard!"}
                  >
                    {button}
                  </Tooltip>
                )}
              </Grid>
            </Grid>
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
        return `${toBitcoin(value.quantity, true)}BTC`;
      }
      case "ether": {
        return `${fromWei(value.quantity)}ETH`;
      }
    }
  }
}
