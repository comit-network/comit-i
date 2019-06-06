import { Grid } from "@material-ui/core";
import React, { useReducer, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import URI from "urijs";
import postRfc003Swap from "../../api/postRfc003Swap";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import Fieldset from "../../components/Fieldset";
import Page from "../../components/Page";
import PeerAddressHintTextField from "../../components/PeerAddressHintTextField";
import PeerIDTextField from "../../components/PeerIDTextField";
import ProtocolTextField from "../../components/ProtocolTextField";
import SendButton from "../../components/SendButton";
import Rfc003ParamsForm, {
  defaultRfc003Params,
  resetAlphaIdentity,
  resetBetaIdentity,
  Rfc003Params
} from "../../forms/Rfc003ParamsForm";
import SwapForm, {
  emptySwap,
  reducer as swapReducer
} from "../../forms/SwapForm";
import ledgers from "../../ledgerSpec";

const SendSwap = ({ location, history }: RouteComponentProps) => {
  const [swap, dispatch] = useReducer(swapReducer, emptySwap);

  const [params, setParams] = useState<Rfc003Params>(defaultRfc003Params);
  const [peerId, setPeerId] = useState();
  const [addressHint, setAddressHint] = useState();
  const [displayError, setDisplayError] = useState(false);

  const queryParams = URI.parseQuery(location.search) as {
    protocol: string | undefined;
  };
  const protocol = queryParams.protocol || "";

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    postRfc003Swap(swap, params, peerId, addressHint).then(
      () => history.push("/"),
      () => setDisplayError(true)
    );
  };

  const setProtocol = (protocolName: string) => {
    history.push({ search: `?protocol=${protocolName}` });
  };

  return (
    <React.Fragment>
      <Page title={"Send a swap request"}>
        <form onSubmit={handleFormSubmit}>
          <Grid container={true} spacing={2}>
            <SwapForm
              swap={swap}
              ledgers={ledgers}
              dispatch={dispatch}
              onAlphaLedgerChange={() => setParams(resetAlphaIdentity(params))}
              onBetaLedgerChange={() => setParams(resetBetaIdentity(params))}
            />
            <Grid item={true} xs={12}>
              <Fieldset legend="Protocol Parameters">
                <Grid item={true} xs={12} md={6}>
                  <ProtocolTextField
                    protocol={protocol}
                    onChange={newProtocol => {
                      setProtocol(newProtocol);
                      setParams(defaultRfc003Params);
                    }}
                  />
                </Grid>
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
              <Fieldset legend={"To"}>
                <Grid item={true} xs={12}>
                  <PeerIDTextField
                    peerID={peerId}
                    onPeerIDChange={setPeerId}
                    helperText={
                      "The PeerID of the COMIT node you want to send the SWAP request to."
                    }
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <PeerAddressHintTextField
                    addressHint={addressHint}
                    onAddressHintChange={setAddressHint}
                  />
                </Grid>
              </Fieldset>
            </Grid>
            <Grid item={true} xs={12}>
              <SendButton />
            </Grid>
          </Grid>
        </form>
      </Page>
      <ErrorSnackbar
        message={"Failed to create swap."}
        onClose={() => setDisplayError(false)}
        open={displayError}
      />
    </React.Fragment>
  );
};

export default withRouter(SendSwap);
