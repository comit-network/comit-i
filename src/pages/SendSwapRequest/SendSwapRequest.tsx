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
import Select from "./Select";

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

export type Action =
  | {
      type: "change-parameter";
      of: keyof FormData;
      payload: { name: string; newValue: string };
    }
  | {
      type: "change-selection";
      of: keyof FormData;
      payload: { newSelection: string };
    };

interface FormData {
  alpha_ledger: {
    name: string;
    [parameter: string]: string | undefined;
  };
  alpha_asset: {
    name: string;
    [parameter: string]: string | undefined;
  };
  beta_ledger: {
    name: string;
    [parameter: string]: string | undefined;
  };
  beta_asset: {
    name: string;
    [parameter: string]: string | undefined;
  };
}

interface State {
  formData: FormData;
}

const initialState = {
  formData: {
    alpha_ledger: {
      name: ""
    },
    alpha_asset: {
      name: ""
    },
    beta_ledger: {
      name: ""
    },
    beta_asset: {
      name: ""
    }
  },
  formSpec: {
    alphaLedger: {}
  }
};

function reducer(state: State, action: Action): State {
  const formData = {
    ...state.formData
  };

  switch (action.type) {
    case "change-parameter": {
      formData[action.of][action.payload.name] = action.payload.newValue;
      break;
    }
    case "change-selection":
      {
        formData[action.of] = {
          name: action.payload.newSelection
        };

        switch (action.of) {
          case "beta_ledger": {
            formData.beta_asset = { name: "" };
            break;
          }
          case "alpha_ledger": {
            formData.alpha_asset = { name: "" };
            break;
          }
        }
      }

      break;
  }

  return {
    ...state,
    formData
  };
}

const assetsByLedger: { [key: string]: string[] | undefined } = {
  bitcoin: ["bitcoin"],
  ethereum: ["ether"]
};

const SendSwap = ({ location, history, classes }: SendSwapProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [params, setParams] = useState<Rfc003Params>(defaultRfc003Params);
  const [peer, setPeer] = useState("0.0.0.0:8011");
  const [displayError, setDisplayError] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    if (protocol instanceof Array) {
      protocol = protocol[0];
    }

    postSwap(protocol, {
      ...state.formData,
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

  const alphaLedger = state.formData.alpha_ledger;
  const betaLedger = state.formData.beta_ledger;
  const alphaAsset = state.formData.alpha_asset;
  const betaAsset = state.formData.beta_asset;

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
                <Select
                  selection={alphaLedger}
                  options={["bitcoin", "ethereum"]}
                  disabledOptions={[betaLedger.name]}
                  onSelectionChange={selection =>
                    dispatch({
                      type: "change-selection",
                      of: "alpha_ledger",
                      payload: { newSelection: selection }
                    })
                  }
                  onParameterChange={(name, value) =>
                    dispatch({
                      of: "alpha_ledger",
                      type: "change-parameter",
                      payload: { name, newValue: value }
                    })
                  }
                  parameters={[]}
                  label={"Ledger"}
                />
                {alphaLedger.name && (
                  <Select
                    selection={alphaAsset}
                    options={assetsByLedger[alphaLedger.name] || []}
                    onSelectionChange={selection =>
                      dispatch({
                        type: "change-selection",
                        of: "alpha_asset",
                        payload: { newSelection: selection }
                      })
                    }
                    onParameterChange={(name, value) =>
                      dispatch({
                        type: "change-parameter",
                        of: "alpha_asset",
                        payload: { name, newValue: value }
                      })
                    }
                    disabledOptions={[]}
                    parameters={[]}
                    label={"Asset"}
                  />
                )}
              </fieldset>
            </Grid>
            <Grid item={true} xs={12}>
              <fieldset className={classes.root}>
                <legend>Beta</legend>
                <Select
                  selection={betaLedger}
                  options={["bitcoin", "ethereum"]}
                  disabledOptions={[alphaLedger.name]}
                  onSelectionChange={selection =>
                    dispatch({
                      of: "beta_ledger",
                      type: "change-selection",
                      payload: { newSelection: selection }
                    })
                  }
                  onParameterChange={(name, value) =>
                    dispatch({
                      type: "change-parameter",
                      of: "beta_ledger",
                      payload: { name, newValue: value }
                    })
                  }
                  parameters={[]}
                  label={"Ledger"}
                />
                {betaLedger.name && (
                  <Select
                    selection={betaAsset}
                    options={assetsByLedger[betaLedger.name] || []}
                    onSelectionChange={selection =>
                      dispatch({
                        of: "beta_asset",
                        type: "change-selection",
                        payload: { newSelection: selection }
                      })
                    }
                    onParameterChange={(name, value) =>
                      dispatch({
                        type: "change-parameter",
                        of: "beta_asset",
                        payload: { name, newValue: value }
                      })
                    }
                    disabledOptions={[]}
                    parameters={[]}
                    label={"Asset"}
                  />
                )}
              </fieldset>
            </Grid>
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
