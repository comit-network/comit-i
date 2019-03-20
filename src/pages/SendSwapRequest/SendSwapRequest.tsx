import {
  Button,
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select as MUISelect,
  Typography
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles, withStyles, WithStyles } from "@material-ui/styles";
import queryString from "query-string";
import React, { useReducer, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import postSwap from "../../api/post_swap";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import PeerTextField from "./PeerTextField";
import Rfc003ParamsForm, {
  defaultRfc003Params,
  Rfc003Params
} from "./Rfc003ParamsForm";
import { ParameterKind } from "./Select";
import SwapForm, { emptySwap, reducer as swapReducer } from "./SwapForm";

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

const SendSwap = ({ location, history, classes }: SendSwapProps) => {
  const [swap, dispatch] = useReducer(swapReducer, emptySwap);

  const [params, setParams] = useState<Rfc003Params>(defaultRfc003Params);
  const [peer, setPeer] = useState("0.0.0.0:8011");
  const [displayError, setDisplayError] = useState(false);

  const ledgers = [
    {
      name: "bitcoin",
      parameters: [
        {
          name: "network",
          type: ParameterKind.Network,
          options: ["mainnet", "testnet", "regtest"]
        }
      ],
      assets: [
        {
          name: "bitcoin",
          parameters: [
            {
              name: "quantity",
              type: ParameterKind.Quantity
            }
          ]
        }
      ]
    },
    {
      name: "ethereum",
      parameters: [
        {
          name: "network",
          type: ParameterKind.Network,
          options: ["mainnet", "ropsten", "regtest"]
        }
      ],
      assets: [
        {
          name: "ether",
          parameters: [
            {
              name: "quantity",
              type: ParameterKind.Quantity
            }
          ]
        }
      ]
    }
  ];

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    if (protocol instanceof Array) {
      protocol = protocol[0];
    }

    postSwap(protocol, {
      ...swap,
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
            <SwapForm swap={swap} ledgers={ledgers} dispatch={dispatch} />
            <Grid item={true} xs={12}>
              <fieldset className={classes.fieldset}>
                <legend>Protocol Parameters</legend>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor={"protocol"}>Protocol</InputLabel>
                  <MUISelect
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
                  </MUISelect>
                </FormControl>
                {protocol === "rfc003" && (
                  <Rfc003ParamsForm
                    alphaLedger={swap.alpha_ledger.name}
                    betaLedger={swap.beta_ledger.name}
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
