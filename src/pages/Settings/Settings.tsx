import { Button, Grid, TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/styles";
import { useState } from "react";
import React from "react";
import Fieldset from "../../components/Fieldset";
import Page from "../../components/Page";

const useSettingsStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  }
}));

function Settings() {
  const [hostAndPort, setHostAndPort] = useState(
    localStorage.getItem("hostAndPort") || "localhost:8000"
  );

  const classes = useSettingsStyles();

  const handleSaveSettings = () => {
    localStorage.setItem("hostAndPort", hostAndPort);
  };

  return (
    <Page title="Set your settings">
      <form onSubmit={handleSaveSettings}>
        <Grid container={true} spacing={40}>
          <Grid item={true} xs={12}>
            <Fieldset legend="COMIT node">
              <TextField
                label="Host and port"
                value={hostAndPort}
                onChange={event => setHostAndPort(event.target.value)}
                SelectProps={{
                  native: true
                }}
              />
            </Fieldset>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          className={classes.button}
        >
          Save
          <SaveIcon className={classes.icon} />
        </Button>
      </form>
    </Page>
  );
}

export default Settings;
