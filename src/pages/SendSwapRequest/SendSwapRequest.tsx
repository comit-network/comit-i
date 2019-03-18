import {
  Button,
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select,
  Theme,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/styles";
import queryString from "query-string";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import postSwap from "../../api/post_swap";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import LedgerFieldSet from "./LedgerFieldset";
import PeerTextField from "./PeerTextField";
import Rfc003ParamsForm, {
  defaultRfc003Params,
  resetParams,
  Rfc003Params
} from "./Rfc003ParamsForm";

const styles = (theme: Theme) =>
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
    group: {
      border: "1px solid",
      borderRadius: theme.shape.borderRadius,
      borderColor: theme.palette.divider
    },
    title: {
      marginBottom: theme.spacing.unit * 3
    },
    fieldset: {
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: theme.shape.borderRadius,
      borderColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.42)"
          : "rgba(255, 255, 255, 0.7)"
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: "10rem"
    }
  });

interface SendSwapProps
  extends RouteComponentProps,
    WithStyles<typeof styles> {}

const SendSwap = ({ location, history, classes }: SendSwapProps) => {
  const [alphaLedger, setAlphaLedger] = useState("");
  const [betaLedger, setBetaLedger] = useState("ethereum");
  const [alphaAsset, setAlphaAsset] = useState("bitcoin");
  const [betaAsset, setBetaAsset] = useState("ether");
  const [alphaNetwork, setAlphaNetwork] = useState("regtest");
  const [betaNetwork, setBetaNetwork] = useState("regtest");
  const [alphaQuantity, setAlphaQuantity] = useState("1");
  const [betaQuantity, setBetaQuantity] = useState("100");
  const [params, setParams] = useState<Rfc003Params>(defaultRfc003Params);
  const [peer, setPeer] = useState("0.0.0.0:8011");
  const [displayError, setDisplayError] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    if (protocol instanceof Array) {
      protocol = protocol[0];
    }

    postSwap(protocol, {
      alpha_ledger: { name: alphaLedger, network: alphaNetwork },
      beta_ledger: { name: betaLedger, network: betaNetwork },
      alpha_asset: { name: alphaAsset, quantity: alphaQuantity },
      beta_asset: { name: betaAsset, quantity: betaQuantity },
      alpha_ledger_refund_identity: params.alphaRefundIdentity,
      beta_ledger_redeem_identity: params.betaRedeemIdentity,
      alpha_expiry: params.alphaExpiry,
      beta_expiry: params.betaExpiry,
      peer
    })
      .then(() => history.push("/"))
      .catch(() => setDisplayError(() => true));
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
              <LedgerFieldSet
                label={"Alpha"}
                ledger={alphaLedger}
                setLedger={ledger => {
                  setAlphaLedger(ledger);
                  setParams(resetParams(params));
                }}
                network={alphaNetwork}
                setNetwork={setAlphaNetwork}
                asset={alphaAsset}
                setAsset={setAlphaAsset}
                quantity={alphaQuantity}
                setQuantity={setAlphaQuantity}
                otherLedger={betaLedger}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <LedgerFieldSet
                label={"Beta"}
                ledger={betaLedger}
                setLedger={ledger => {
                  setBetaLedger(ledger);
                  setParams(resetParams(params));
                }}
                network={betaNetwork}
                setNetwork={setBetaNetwork}
                asset={betaAsset}
                setAsset={setBetaAsset}
                quantity={betaQuantity}
                setQuantity={setBetaQuantity}
                otherLedger={alphaLedger}
              />
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
                    alphaLedger={alphaLedger}
                    betaLedger={betaLedger}
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

export default withStyles(styles)(withRouter(SendSwap));
