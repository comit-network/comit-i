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
          disabled={disabledValues.indexOf("bitcoin") !== -1}
          value={"bitcoin"}
        >
          Bitcoin
        </MenuItem>
        <MenuItem
          disabled={disabledValues.indexOf("ethereum") !== -1}
          value={"ethereum"}
        >
          Ethereum
        </MenuItem>
      </Select>
    </FormControl>
  );
}

interface AssetSelectProps {
  ledger?: string;
  selected?: string;
  setSelected: (asset: string) => void;
  label: string;
}

function AssetSelect({
  ledger,
  selected,
  setSelected,
  label
}: AssetSelectProps) {
  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelected(event.target.value);
  const inputName = label.replace(" ", "-").toLowerCase();

  let menuItems;
  if (ledger === "bitcoin") {
    menuItems = <MenuItem value={"bitcoin"}>Bitcoin</MenuItem>;
  } else {
    menuItems = <MenuItem value={"ether"}>Ether</MenuItem>;
  }

  return (
    <FormControl>
      <InputLabel htmlFor={inputName}>{label}</InputLabel>
      <Select
        value={selected}
        onChange={handleOnChange}
        inputProps={{
          name: inputName
        }}
      >
        {menuItems}
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
      <Grid item={true} xs={12}>
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
      <Grid item={true} xs={12}>
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

interface LedgerFieldSetProps {
  name: string;
  ledger: string;
  setLedger: (ledger: string) => void;
  asset: string;
  setAsset: (asset: string) => void;
  otherLedger: string;
}

function LedgerFieldSet({
  ledger,
  setLedger,
  asset,
  setAsset,
  otherLedger
}: LedgerFieldSetProps) {
  return (
    <fieldset>
      <legend>Alpha</legend>
      <Grid item={true} xs={1}>
        <LedgerSelect
          disabledValues={[otherLedger]}
          selected={ledger}
          setSelected={setLedger}
          label={"Ledger"}
        />
      </Grid>
      {ledger && (
        <Grid item={true} xs={1}>
          <AssetSelect
            ledger={ledger}
            selected={asset}
            setSelected={setAsset}
            label={"Asset"}
          />
        </Grid>
      )}
    </fieldset>
  );
}

const SendSwap = ({ location, history, classes }: SendSwapProps) => {
  const [alphaLedger, setAlphaLedger] = useState("");
  const [betaLedger, setBetaLedger] = useState("");
  const [alphaAsset, setAlphaAsset] = useState("");
  const [betaAsset, setBetaAsset] = useState("");

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
        <Grid item={true} xs={12}>
          <LedgerFieldSet
            name={"Alpha"}
            ledger={alphaLedger}
            setLedger={setAlphaLedger}
            asset={alphaAsset}
            setAsset={setAlphaAsset}
            otherLedger={betaLedger}
          />
        </Grid>
        <Grid item={true} xs={12}>
          <LedgerFieldSet
            name={"Beta"}
            ledger={betaLedger}
            setLedger={setBetaLedger}
            asset={betaAsset}
            setAsset={setBetaAsset}
            otherLedger={alphaLedger}
          />
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
