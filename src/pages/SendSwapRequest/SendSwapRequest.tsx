import { Button, Grid } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/styles";
import queryString from "query-string";
import React, { useReducer, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import postSwap from "../../api/post_swap";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import Fieldset from "../../components/Fieldset";
import Page from "../../components/Page";
import TextField from "../../components/TextField";
import Rfc003ParamsForm, {
  defaultRfc003Params,
  Rfc003Params
} from "../../forms/Rfc003ParamsForm";
import SwapForm, {
  emptySwap,
  reducer as swapReducer
} from "../../forms/SwapForm";
import ledgers from "../../ledgerSpec";
import PeerTextField from "./PeerTextField";

const SendSwap = ({ location, history }: RouteComponentProps) => {
  const [swap, dispatch] = useReducer(swapReducer, emptySwap);

  const [params, setParams] = useState<Rfc003Params>(defaultRfc003Params);
  const [peer, setPeer] = useState("0.0.0.0:8011");
  const [displayError, setDisplayError] = useState(false);

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
      <Page title={"Send a swap request"}>
        <form onSubmit={handleFormSubmit}>
          <Grid container={true} spacing={40}>
            <SwapForm swap={swap} ledgers={ledgers} dispatch={dispatch} />
            <Grid item={true} xs={12}>
              <Fieldset legend="Protocol Parameters">
                <TextField
                  label={"Protocol"}
                  required={true}
                  value={protocol}
                  onChange={event => {
                    setProtocol(event.target.value);
                    setParams(defaultRfc003Params);
                  }}
                  select={true}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value={""} />
                  <option value={"rfc003"}>RFC003</option>
                </TextField>
                {protocol === "rfc003" && (
                  <Rfc003ParamsForm
                    alphaLedger={swap.alpha_ledger.name}
                    betaLedger={swap.beta_ledger.name}
                    params={params}
                    setParams={setParams}
                  />
                )}
              </Fieldset>
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
      </Page>
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

export default withRouter(SendSwap);
