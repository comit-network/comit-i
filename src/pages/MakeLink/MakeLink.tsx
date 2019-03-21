import { Grid, Paper, Typography } from "@material-ui/core";
import React, { useReducer } from "react";
import Page from "../../components/Page";
import { SubTitle } from "../../components/text";
import SwapForm, {
  emptySwap,
  reducer as swapReducer
} from "../../forms/SwapForm";
import ledgers from "../../ledgerSpec";

const MakeLink = () => {
  const [swap, dispatch] = useReducer(swapReducer, emptySwap);

  return (
    <Page title={"Create a new swap link"}>
      <Grid container={true} spacing={40}>
        <SwapForm swap={swap} ledgers={ledgers} dispatch={dispatch} />
        <Grid item={true} xs={12}>
          <SubTitle text={"The generated link"} />
          <Paper elevation={2}>
            <Typography variant={"body2"} align={"center"}>
              {`web+comit:swap?`}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};

export default MakeLink;
