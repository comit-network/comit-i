import {
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Theme,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import queryString from "query-string";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

const useLedgerSelectStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: "10rem"
  }
}));

interface LedgerSelectProps {
  selected?: string;
  setSelected: (ledger: string) => void;
  label: string;
  disabledValues: string[];
}

function LedgerSelect({
  selected,
  setSelected,
  label,
  disabledValues
}: LedgerSelectProps) {
  const classes = useLedgerSelectStyles();
  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelected(event.target.value);
  const inputName = label.replace(" ", "-").toLowerCase();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={inputName}>{label}</InputLabel>
      <Select
        variant="outlined"
        value={selected}
        onChange={handleOnChange}
        inputProps={{
          name: inputName
        }}
      >
        <MenuItem
          disabled={disabledValues.indexOf("bitcoin-mainnet") !== -1}
          value={"bitcoin-mainnet"}
        >
          Bitcoin-Mainnet
        </MenuItem>
        <MenuItem
          disabled={disabledValues.indexOf("bitcoin-testnet") !== -1}
          value={"bitcoin-testnet"}
        >
          Bitcoin-Testnet
        </MenuItem>
        <MenuItem
          disabled={disabledValues.indexOf("bitcoin-regtest") !== -1}
          value={"bitcoin-regtest"}
        >
          Bitcoin-Regtest
        </MenuItem>
        <MenuItem
          disabled={disabledValues.indexOf("ethereum-mainnet") !== -1}
          value={"ethereum-mainnet"}
        >
          Ethereum-Mainnet
        </MenuItem>
      </Select>
    </FormControl>
  );
}

const useProtocolSelectStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: "8rem"
  }
}));

interface ProtocolSelectProps {
  selected?: string;
  setSelected: (protocol: string) => void;
  label: string;
}

function ProtocolSelect({ selected, setSelected, label }: ProtocolSelectProps) {
  const classes = useProtocolSelectStyles();
  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelected(event.target.value);
  const inputName = label.replace(" ", "-").toLowerCase();

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={inputName}>{label}</InputLabel>
      <Select
        value={selected}
        onChange={handleOnChange}
        inputProps={{
          name: inputName
        }}
      >
        <MenuItem value={"rfc003"}>RFC003</MenuItem>
      </Select>
    </FormControl>
  );
}

function Rfc003ParamsSelect() {
  return (
    <React.Fragment>
      <Grid item={true} xs={6}>
        <Grid item={true} xs={12}>
          <FormControl>
            <TextField label="Alpha Expiry" variant="outlined" />
          </FormControl>
        </Grid>
        <Grid item={true} xs={12}>
          <FormControl>
            <TextField label="Refund Identity" variant="outlined" />
          </FormControl>
        </Grid>
      </Grid>
      <Grid item={true} xs={6}>
        <Grid item={true} xs={12}>
          <FormControl>
            <TextField label="Beta Expiry" variant="outlined" />
          </FormControl>
        </Grid>
        <Grid item={true} xs={12}>
          <FormControl>
            <TextField label="Redeem Identity" variant="outlined" />
          </FormControl>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

const styles = (theme: Theme) =>
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
    group: {
      border: "1px solid",
      borderRadius: theme.shape.borderRadius,
      borderColor: theme.palette.divider
    }
  });

interface SendSwapProps
  extends RouteComponentProps,
    WithStyles<typeof styles> {}

const SendSwap = ({ location, history, classes }: SendSwapProps) => {
  const [alphaLedger, setAlphaLedger] = useState("");
  const [betaLedger, setBetaLedger] = useState("");
  const setProtocol = (protocolName: string) => {
    history.push({ search: `?protocol=${protocolName}` });
  };
  let protocol = queryString.parse(location.search).protocol || "";
  if (protocol instanceof Array) {
    protocol = protocol[0];
  }

  return (
    <Paper elevation={1} className={classes.root}>
      <Typography variant="h4">Send a swap request</Typography>
      <Grid container={true} spacing={40}>
        <Grid item={true} xs={6}>
          <Grid item={true} xs={12}>
            <LedgerSelect
              disabledValues={[betaLedger]}
              selected={alphaLedger}
              setSelected={setAlphaLedger}
              label={"Alpha Ledger"}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField label={"Alpha Asset"} />
          </Grid>
        </Grid>
        <Grid item={true} xs={6}>
          <Grid item={true} xs={12}>
            <LedgerSelect
              disabledValues={[alphaLedger]}
              selected={betaLedger}
              setSelected={setBetaLedger}
              label={"Beta Ledger"}
            />
          </Grid>
          <Grid item={true} xs={12}>
            <TextField label={"Alpha Asset"} />
          </Grid>
        </Grid>
        <Grid item={true} xs={12}>
          <ProtocolSelect
            selected={protocol}
            setSelected={setProtocol}
            label={"Protocol"}
          />
        </Grid>
        {protocol === "rfc003" && <Rfc003ParamsSelect />}
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(withRouter(SendSwap));
