import { Button } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import postSwap from "../../api/post_swap";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import Fieldset from "../../components/Fieldset";
import TextField from "../../components/TextField";
import Rfc003ParamsForm, {
  defaultRfc003Params,
  Rfc003Params
} from "../../forms/Rfc003ParamsForm";
import { SwapParams } from "./parseSwapParams";

interface Props extends RouteComponentProps {
  swapParams: SwapParams;
}

const LinkLandingForm = ({ swapParams, history }: Props) => {
  const alphaLedger = swapParams.alphaLedger;
  const betaLedger = swapParams.betaLedger;
  const protocol = swapParams.protocol;

  const [params, setParams] = useState<Rfc003Params>(defaultRfc003Params);
  const [displayError, setDisplayError] = useState(false);

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    postSwap(protocol, {
      alpha_ledger: swapParams.alphaLedger,
      beta_ledger: swapParams.betaLedger,
      alpha_asset: {
        name: swapParams.alphaAsset.symbol,
        quantity: swapParams.alphaAsset.amount
      }, // TODO handle erc20
      beta_asset: {
        name: swapParams.betaAsset.symbol,
        quantity: swapParams.betaAsset.amount
      },
      alpha_ledger_refund_identity: params.alphaRefundIdentity,
      beta_ledger_redeem_identity: params.betaRedeemIdentity,
      alpha_expiry: params.alphaExpiry,
      beta_expiry: params.betaExpiry,
      peer: swapParams.peer
    })
      .then(() => history.push("/"))
      .catch(() => setDisplayError(true));
  };

  const hideError = () => setDisplayError(false);

  return (
    <React.Fragment>
      <form onSubmit={handleFormSubmit}>
        <Fieldset legend={"Input Parameters"}>
          <TextField
            select={true}
            SelectProps={{
              native: true
            }}
            value={protocol}
            onChange={() => {
              setParams(defaultRfc003Params);
            }}
            label={"Protocol"}
          >
            <option value={""} />
            <option value={"rfc003"}>RFC003</option>
          </TextField>
          {protocol === "rfc003" && (
            <Rfc003ParamsForm
              alphaLedger={alphaLedger.name}
              betaLedger={betaLedger.name}
              params={params}
              setParams={setParams}
            />
          )}
        </Fieldset>
        <SendButton />
      </form>
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

export default withRouter(LinkLandingForm);
