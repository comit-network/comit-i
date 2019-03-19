import {
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select,
  Typography
} from "@material-ui/core";
import { createStyles, withStyles, WithStyles } from "@material-ui/styles";
import React, { useState } from "react";
import LedgerFieldSet from "../SendSwapRequest/LedgerFieldset";
import PeerTextField from "../SendSwapRequest/PeerTextField";

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

interface MakeLinkProps extends WithStyles<typeof styles> {}

const MakeLink = ({ classes }: MakeLinkProps) => {
  const [alphaLedger, setAlphaLedger] = useState("");
  const [betaLedger, setBetaLedger] = useState("");
  const [alphaAsset, setAlphaAsset] = useState("bitcoin");
  const [betaAsset, setBetaAsset] = useState("ether");
  const [alphaNetwork, setAlphaNetwork] = useState("regtest");
  const [betaNetwork, setBetaNetwork] = useState("regtest");
  const [alphaQuantity, setAlphaQuantity] = useState("1");
  const [betaQuantity, setBetaQuantity] = useState("100");
  const [peer, setPeer] = useState("0.0.0.0:8011");
  const [protocol, setProtocol] = useState("");

  return (
    <React.Fragment>
      <Paper elevation={1} className={classes.root}>
        <Typography className={classes.title} variant="h4">
          Create a SWAP link
        </Typography>
        <Grid container={true} spacing={40}>
          <Grid item={true} xs={12}>
            <LedgerFieldSet
              label={"Alpha"}
              ledger={alphaLedger}
              setLedger={ledger => {
                setAlphaLedger(ledger);
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
                  }}
                  inputProps={{
                    name: "protocol"
                  }}
                >
                  <option value={""} />
                  <option value={"rfc003"}>RFC003</option>
                </Select>
              </FormControl>
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
      </Paper>
    </React.Fragment>
  );
};

export default withStyles(styles)(MakeLink);
