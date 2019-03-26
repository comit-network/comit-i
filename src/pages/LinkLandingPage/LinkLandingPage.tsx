import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Fieldset from "../../components/Fieldset";
import Page from "../../components/Page";
import LedgerDetails from "./LedgerDetails";
import LinkLandingForm from "./LinkLandingForm";
import parseQuery from "./parseQuery";
import parseSwapParams from "./parseSwapParams";

const LinkLandingPage = ({ location }: RouteComponentProps) => {
  let swapParams;
  let showError = false;
  let errorMessage = "";

  try {
    swapParams = parseSwapParams(parseQuery(location.search));
  } catch (error) {
    showError = true;
    errorMessage = error.toString();
  }

  return (
    <Page title={"Send a swap request"}>
      <Grid container={true} spacing={40}>
        <Grid item={true} xs={12}>
          <Fieldset legend="Offer Details">
            <Grid item={true} xs={6}>
              {swapParams && (
                <LedgerDetails
                  label="Alpha"
                  asset={swapParams.alphaAsset}
                  ledger={swapParams.alphaLedger}
                />
              )}
            </Grid>
            <Grid item={true} xs={6}>
              {swapParams && (
                <LedgerDetails
                  label="Beta"
                  asset={swapParams.betaAsset}
                  ledger={swapParams.betaLedger}
                />
              )}
            </Grid>
            <Grid xs={12}>
              <Fieldset legend="Peer Detail">
                {swapParams && (
                  <Typography variant="body2">
                    Peer: {swapParams.peer} <br />
                    Protocol: {swapParams.protocol} <br />
                    Trade ID: {swapParams.id} <br />
                  </Typography>
                )}
              </Fieldset>
            </Grid>
            {showError && <div className="error-message">{errorMessage}</div>}
          </Fieldset>
        </Grid>
        <Grid item={true} xs={12}>
          {swapParams && <LinkLandingForm swapParams={swapParams} />}
        </Grid>
      </Grid>
    </Page>
  );
};

export default withRouter(LinkLandingPage);
