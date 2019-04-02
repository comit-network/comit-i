import { Button, Grid } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import { makeStyles } from "@material-ui/styles";
import { useState } from "react";
import React from "react";
import Fieldset from "../../components/Fieldset";
import Page from "../../components/Page";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import TextField from "../../components/TextField";
import storage from "../../storage";

const useSettingsStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing.unit * 2
  },
  icon: {
    marginLeft: theme.spacing.unit
  }
}));

function Settings() {
  const [host, setHost] = useState(storage.getHost());
  const [port, setPort] = useState(storage.getPort());
  const [displaySaved, setDisplaySaved] = useState(false);

  const classes = useSettingsStyles();

  const handleSaveSettings = (event: any) => {
    event.preventDefault();

    storage.setHost(host);
    storage.setPort(port);

    setDisplaySaved(true);
    setTimeout(() => setDisplaySaved(false), 2500);
  };

  return (
    <React.Fragment>
      <Page title="Set your settings">
        <form onSubmit={handleSaveSettings}>
          <Fieldset legend="COMIT node">
            <Grid container={true} spacing={40}>
              <Grid item={true} xs={12} md={6}>
                <TextField
                  label="Host"
                  value={host}
                  onChange={event => setHost(event.target.value)}
                />
              </Grid>
              <Grid item={true} xs={12} md={6}>
                <TextField
                  label="Port"
                  value={port}
                  onChange={event => setPort(parseInt(event.target.value, 10))}
                />
              </Grid>
            </Grid>
          </Fieldset>
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
      {displaySaved && (
        <SuccessSnackbar
          message={"Your settings have been saved."}
          onClose={() => setDisplaySaved(false)}
          open={true}
        />
      )}
    </React.Fragment>
  );
}

export default Settings;
