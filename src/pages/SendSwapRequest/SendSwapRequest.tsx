import {
  Button,
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select,
  Typography
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles, withStyles, WithStyles } from "@material-ui/styles";
import queryString from "query-string";
import React, { useReducer, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import postSwap from "../../api/post_swap";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import AssetSelect, {
  Asset,
  AssetAction,
  ParameterKind as AssetParameterKind
} from "./AssetSelect";
import LedgerSelect, {
  Ledger,
  LedgerAction,
  ParameterKind as LedgerParameterKind
} from "./LedgerSelect";
import PeerTextField from "./PeerTextField";
import Rfc003ParamsForm, {
  defaultRfc003Params,
  Rfc003Params
} from "./Rfc003ParamsForm";

// Have to use any to access custom mixins
const styles = (theme: any) =>
  createStyles({
    root: {
      margin: "auto",
      [theme.breakpoints.up("md")]: {
        maxWidth: "50vw"
      },
      [theme.breakpoints.up("xl")]: {
        maxWidth: "40vw"
      },
      padding: theme.spacing.unit * 3
    },
    group: theme.mixins.border(theme),
    title: {
      marginBottom: theme.spacing.unit * 3
    },
    fieldset: theme.mixins.border(theme),
    formControl: {
      margin: theme.spacing.unit,
      minWidth: "10rem"
    }
  });

interface SendSwapProps
  extends RouteComponentProps,
    WithStyles<typeof styles> {}

function assetReducer(state: Asset, action: AssetAction): Asset {
  switch (action.type) {
    case "change-parameter": {
      return {
        ...state,
        [action.payload.name]: action.payload.newValue
      };
    }
    case "change-asset": {
      return {
        name: action.payload.newAsset,
        parameters: [{ name: "quantity", type: AssetParameterKind.Quantity }]
      };
    }
  }
}

function ledgerReducer(state: Ledger, action: LedgerAction): Ledger {
  switch (action.type) {
    case "change-parameter": {
      return {
        ...state,
        [action.payload.name]: action.payload.newValue
      };
    }
    case "change-ledger": {
      const ledgerNetworks: { [ledger: string]: string[] | undefined } = {
        bitcoin: ["", "mainnet", "regtest", "testnet"],
        ethereum: ["", "mainnet", "regtest", "ropsten"]
      };
      const name = action.payload.newLedger;
      return {
        name,
        parameters: [
          {
            name: "network",
            type: LedgerParameterKind.Network,
            options: ledgerNetworks[name] || []
          }
        ]
      };
    }
  }
}

const SendSwap = ({ location, history, classes }: SendSwapProps) => {
  const initAsset: Asset = { name: "", parameters: [] };
  const initLedger: Ledger = { name: "", parameters: [] };
  const [alphaLedger, alphaLedgerDispatch] = useReducer(
    ledgerReducer,
    initLedger
  );
  const [betaLedger, betaLedgerDispatch] = useReducer(
    ledgerReducer,
    initLedger
  );
  const [alphaAsset, alphaAssetDispatch] = useReducer(assetReducer, initAsset);
  const [betaAsset, betaAssetDispatch] = useReducer(assetReducer, initAsset);

  const [params, setParams] = useState<Rfc003Params>(defaultRfc003Params);
  const [peer, setPeer] = useState("0.0.0.0:8011");
  const [displayError, setDisplayError] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    if (protocol instanceof Array) {
      protocol = protocol[0];
    }

    postSwap(protocol, {
      alpha_ledger: { name: alphaLedger.name, network: alphaLedger.network },
      beta_ledger: { name: betaLedger.name, network: betaLedger.network },
      alpha_asset: { name: alphaAsset.name, quantity: alphaAsset.quantity },
      beta_asset: { name: betaAsset.name, quantity: betaAsset.quantity },
      alpha_ledger_refund_identity: params.alphaRefundIdentity,
      beta_ledger_redeem_identity: params.betaRedeemIdentity,
      alpha_expiry: params.alphaExpiry,
      beta_expiry: params.betaExpiry,
      peer
    })
      .then(() => history.push("/"))
      .catch(() => setDisplayError(true));
  };

  const hideError = () => setDisplayError(false);

  const setProtocol = (protocolName: string) => {
    history.push({ search: `?protocol=${protocolName}` });
  };
  let protocol = queryString.parse(location.search).protocol || "";
  if (protocol instanceof Array) {
    protocol = protocol[0];
  }

  return (
    <React.Fragment>
      <Paper elevation={1} className={classes.root}>
        <Typography className={classes.title} variant="h4">
          Send a swap request
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <Grid container={true} spacing={40}>
            <Grid item={true} xs={12}>
              <fieldset className={classes.root}>
                <legend>Alpha</legend>
                <LedgerSelect
                  ledger={alphaLedger}
                  dispatch={alphaLedgerDispatch}
                  disabledValues={[betaLedger.name]}
                />
                {alphaLedger.name && (
                  <AssetSelect
                    ledger={alphaLedger.name}
                    asset={alphaAsset}
                    dispatch={alphaAssetDispatch}
                  />
                )}
              </fieldset>
            </Grid>
            <Grid item={true} xs={12}>
              <fieldset className={classes.root}>
                <legend>Beta</legend>
                <LedgerSelect
                  ledger={betaLedger}
                  dispatch={betaLedgerDispatch}
                  disabledValues={[betaLedger.name]}
                />
                {betaLedger.name && (
                  <AssetSelect
                    ledger={betaLedger.name}
                    asset={betaAsset}
                    dispatch={betaAssetDispatch}
                  />
                )}
              </fieldset>
            </Grid>
            <Grid item={true} xs={12}>
              <fieldset className={classes.fieldset}>
                <legend>Protocol Parameters</legend>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor={"protocol"}>Protocol</InputLabel>
                  <Select
                    native={true}
                    required={true}
                    value={protocol}
                    onChange={event => {
                      setProtocol(event.target.value);
                      setParams(defaultRfc003Params);
                    }}
                    inputProps={{
                      name: "protocol"
                    }}
                  >
                    <option value={""} />
                    <option value={"rfc003"}>RFC003</option>
                  </Select>
                </FormControl>
                {protocol === "rfc003" && (
                  <Rfc003ParamsForm
                    alphaLedger={alphaLedger.name}
                    betaLedger={betaLedger.name}
                    params={params}
                    setParams={setParams}
                  />
                )}
              </fieldset>
            </Grid>
            <Grid item={true} xs={12}>
              <PeerTextField
                selected={peer}
                setSelected={setPeer}
                label={"Peer"}
                helperText={"IPv4 Socket Address"}
              />
            </Grid>
          </Grid>
          <SendButton />
        </form>
      </Paper>
      <ErrorSnackbar
        message={"Failed to create swap."}
        onClose={hideError}
        open={displayError}
      />
    </React.Fragment>
  );
};

const useSendButtonStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  }
}));

function SendButton() {
  const classes = useSendButtonStyles();

  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      className={classes.button}
    >
      Send
      <SendIcon className={classes.icon} />
    </Button>
  );
}

export default withRouter(withStyles(styles)(SendSwap));
