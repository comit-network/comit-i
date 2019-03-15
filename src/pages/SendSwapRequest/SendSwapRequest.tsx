import {
  Button,
  createStyles,
  FormControl,
  Grid,
  InputLabel,
  Paper,
  Select,
  TextField,
  Theme,
  Typography,
  WithStyles,
  withStyles
} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import SendIcon from "@material-ui/icons/Send";
import { makeStyles } from "@material-ui/styles";
import queryString from "query-string";
import React, { useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import postSwap from "../../api/post_swap";

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
        native={true}
        required={true}
        variant="outlined"
        value={selected}
        onChange={handleOnChange}
        inputProps={{
          name: inputName
        }}
      >
        <option value={""} />
        <option
          disabled={disabledValues.indexOf("bitcoin") !== -1}
          value={"bitcoin"}
        >
          Bitcoin
        </option>
        <option
          disabled={disabledValues.indexOf("ethereum") !== -1}
          value={"ethereum"}
        >
          Ethereum
        </option>
      </Select>
    </FormControl>
  );
}

const useNetworkSelectStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: "10rem"
  }
}));

interface NetworkSelectProps {
  ledger?: string;
  selected?: string;
  setSelected: (network: string) => void;
  label: string;
}

function NetworkSelect({
  ledger,
  selected,
  setSelected,
  label
}: NetworkSelectProps) {
  const classes = useNetworkSelectStyles();
  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelected(event.target.value);
  const inputName = label.replace(" ", "-").toLowerCase();

  let menuItems;
  if (ledger === "bitcoin") {
    menuItems = [
      <option value={""} key="-1" />,
      <option value={"mainnet"} key="0">
        Mainnet
      </option>,
      <option value={"regtest"} key="1">
        Regtest
      </option>,
      <option value={"testnet"} key="2">
        Testnet
      </option>
    ];
  } else {
    menuItems = [
      <option value={""} key="-1" />,
      <option value={"mainnet"} key="0">
        Mainnet
      </option>,
      <option value={"regtest"} key="1">
        Regtest
      </option>,
      <option value={"ropsten"} key="2">
        Ropsten
      </option>
    ];
  }

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={inputName}>{label}</InputLabel>
      <Select
        native={true}
        required={true}
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

const useAssetSelectStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: "10rem"
  }
}));

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
  const classes = useAssetSelectStyles();
  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelected(event.target.value);
  const inputName = label.replace(" ", "-").toLowerCase();

  let menuItems;
  if (ledger === "bitcoin") {
    menuItems = <option value={"bitcoin"}>Bitcoin</option>;
  } else {
    menuItems = <option value={"ether"}>Ether</option>;
  }

  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor={inputName}>{label}</InputLabel>
      <Select
        native={true}
        required={true}
        value={selected}
        onChange={handleOnChange}
        inputProps={{
          name: inputName
        }}
      >
        <option value={""} />
        {menuItems}
      </Select>
    </FormControl>
  );
}

const useRfc003ParamsStyles = makeStyles(theme => ({
  expiry: {
    margin: theme.spacing.unit,
    width: "10rem"
  },
  identity: {
    margin: theme.spacing.unit,
    width: "100%"
  },
  // TODO: This doesn't make border-bottom respect the margin completely
  grid: {
    overflow: "hidden"
  }
}));

interface Rfc003ParamsProps {
  alphaLedger: string;
  betaLedger: string;
  alphaExpiry?: number;
  setAlphaExpiry: (expiry?: number) => void;
  betaExpiry?: number;
  setBetaExpiry: (expiry?: number) => void;
  alphaRefundIdentity?: string;
  setAlphaRefundIdentity: (identity?: string) => void;
  betaRedeemIdentity?: string;
  setBetaRedeemIdentity: (identity?: string) => void;
}

function Rfc003Params({
  alphaLedger,
  betaLedger,
  alphaExpiry,
  setAlphaExpiry,
  betaExpiry,
  setBetaExpiry,
  alphaRefundIdentity,
  setAlphaRefundIdentity,
  betaRedeemIdentity,
  setBetaRedeemIdentity
}: Rfc003ParamsProps) {
  const classes = useRfc003ParamsStyles();

  const parseExpiry = (expiry: string) => {
    return expiry !== "" ? parseInt(expiry, 10) : undefined;
  };

  return (
    <React.Fragment>
      <Grid item={true} xs={12} container={true} spacing={0}>
        <Grid item={true} md={6} xs={12}>
          <TextField
            required={true}
            className={classes.expiry}
            label="Alpha Expiry"
            value={alphaExpiry || ""}
            onChange={event => setAlphaExpiry(parseExpiry(event.target.value))}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">min</InputAdornment>
            }}
          />
        </Grid>
        {alphaLedger === "ethereum" && (
            <Grid className={classes.grid} item={true} md={6} xs={12}>
              <TextField
                required={true}
                className={classes.identity}
                label="Alpha Refund Identity"
                value={alphaRefundIdentity || ""}
                onChange={event => setAlphaRefundIdentity(event.target.value)}
              />
            </Grid>
          ) &&
          setBetaRedeemIdentity("")}
      </Grid>
      <Grid item={true} xs={12} container={true} spacing={0}>
        <Grid item={true} md={6} xs={12}>
          <TextField
            required={true}
            className={classes.expiry}
            label="Beta Expiry"
            value={betaExpiry || ""}
            onChange={event => setBetaExpiry(parseExpiry(event.target.value))}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">min</InputAdornment>
            }}
          />
        </Grid>
        {betaLedger === "ethereum" && (
            <Grid className={classes.grid} item={true} md={6} xs={12}>
              <TextField
                required={true}
                className={classes.identity}
                label="Beta Redeem Identity"
                value={betaRedeemIdentity || ""}
                onChange={event => setBetaRedeemIdentity(event.target.value)}
              />
            </Grid>
          ) &&
          setAlphaRefundIdentity("")}
      </Grid>
    </React.Fragment>
  );
}

const useLedgerFieldSetStyles = makeStyles(theme => ({
  // TODO: Hard-coded values should instead be derived from theme. Create issue in MaterialUI repo
  root: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: theme.shape.borderRadius,
    borderColor:
      theme.palette.type === "light"
        ? "rgba(0, 0, 0, 0.42)"
        : "rgba(255, 255, 255, 0.7)"
  }
}));

interface LedgerFieldSetProps {
  label: string;
  ledger: string;
  setLedger: (ledger: string) => void;
  network: string;
  setNetwork: (network: string) => void;
  asset: string;
  setAsset: (asset: string) => void;
  quantity: string;
  setQuantity: (quantity: string) => void;
  otherLedger: string;
}

function LedgerFieldSet({
  label,
  ledger,
  setLedger,
  network,
  setNetwork,
  asset,
  setAsset,
  quantity,
  setQuantity,
  otherLedger
}: LedgerFieldSetProps) {
  const classes = useLedgerFieldSetStyles();

  return (
    <fieldset className={classes.root}>
      <legend>{label}</legend>
      <Grid item={true} xs={12} container={true} spacing={0}>
        <Grid item={true} xs={12} md={6}>
          <LedgerSelect
            disabledValues={[otherLedger]}
            selected={ledger}
            setSelected={setLedger}
            label={"Ledger"}
          />
        </Grid>
        {ledger && (
          <Grid item={true} xs={12} md={6}>
            <NetworkSelect
              ledger={ledger}
              selected={network}
              setSelected={setNetwork}
              label={"Network"}
            />
          </Grid>
        )}
      </Grid>
      {ledger && (
        <Grid item={true} xs={12} container={true} spacing={0}>
          <Grid item={true} xs={12} md={6}>
            <AssetSelect
              ledger={ledger}
              selected={asset}
              setSelected={setAsset}
              label={"Asset"}
            />
          </Grid>
          <Grid item={true} xs={12} md={6}>
            <QuantityText selected={quantity} setSelected={setQuantity} />
          </Grid>
        </Grid>
      )}
    </fieldset>
  );
}

const useQuantityTextStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing.unit,
    width: "10rem"
  }
}));

interface QuantityTextProps {
  selected: string;
  setSelected: (quantity: string) => void;
}

function QuantityText({ selected, setSelected }: QuantityTextProps) {
  const classes = useQuantityTextStyles();
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSelected(event.target.value.toString());

  return (
    <TextField
      required={true}
      className={classes.root}
      type="number"
      value={selected}
      onChange={handleOnChange}
      label="Quantity"
    />
  );
}

const usePeerTextStyles = makeStyles(theme => ({
  root: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: theme.shape.borderRadius,
    borderColor:
      theme.palette.type === "light"
        ? "rgba(0, 0, 0, 0.42)"
        : "rgba(255, 255, 255, 0.7)"
  },
  textField: {
    margin: theme.spacing.unit,
    width: "10rem"
  }
}));

interface PeerTextProps {
  selected?: string;
  setSelected: (peer: string) => void;
  label: string;
  helperText: string;
}

function PeerText({ selected, setSelected, label, helperText }: PeerTextProps) {
  const classes = usePeerTextStyles();
  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setSelected(event.target.value);

  return (
    <fieldset className={classes.root}>
      <legend>To</legend>
      <TextField
        required={true}
        className={classes.textField}
        value={selected}
        onChange={handleOnChange}
        label={label}
        helperText={helperText}
      />
    </fieldset>
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
    },
    title: {
      marginBottom: theme.spacing.unit * 3
    },
    fieldset: {
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: theme.shape.borderRadius,
      borderColor:
        theme.palette.type === "light"
          ? "rgba(0, 0, 0, 0.42)"
          : "rgba(255, 255, 255, 0.7)"
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: "10rem"
    }
  });

interface SendSwapProps
  extends RouteComponentProps,
    WithStyles<typeof styles> {}

/* type refundIdentity = string;
 * type redeemIdentity = string; */

const SendSwap = ({ location, history, classes }: SendSwapProps) => {
  const [alphaLedger, setAlphaLedger] = useState("");
  const [betaLedger, setBetaLedger] = useState("ethereum");
  const [alphaAsset, setAlphaAsset] = useState("bitcoin");
  const [betaAsset, setBetaAsset] = useState("ether");
  const [alphaNetwork, setAlphaNetwork] = useState("regtest");
  const [betaNetwork, setBetaNetwork] = useState("regtest");
  const [alphaQuantity, setAlphaQuantity] = useState("1");
  const [betaQuantity, setBetaQuantity] = useState("100");
  const [alphaExpiry, setAlphaExpiry] = useState<number | undefined>(20);
  const [betaExpiry, setBetaExpiry] = useState<number | undefined>(10);
  const [alphaRefundIdentity, setAlphaRefundIdentity] = useState<
    string | undefined
  >(undefined);
  const [betaRedeemIdentity, setBetaRedeemIdentity] = useState<
    string | undefined
  >(undefined);
  const [peer, setPeer] = useState("0.0.0.0:8011");

  const handleFormSubmit = (e: any) => {
    e.preventDefault();

    if (protocol instanceof Array) {
      protocol = protocol[0];
    }

    postSwap(protocol, {
      alpha_ledger: { name: alphaLedger, network: alphaNetwork },
      beta_ledger: { name: betaLedger, network: betaNetwork },
      alpha_asset: { name: alphaAsset, quantity: alphaQuantity },
      beta_asset: { name: betaAsset, quantity: betaQuantity },
      alpha_ledger_refund_identity: alphaRefundIdentity,
      beta_ledger_redeem_identity: betaRedeemIdentity,
      alpha_expiry: alphaExpiry,
      beta_expiry: betaExpiry,
      peer
    })
      .then(() => history.push("/"))
      .catch();
  };

  const setProtocol = (protocolName: string) => {
    history.push({ search: `?protocol=${protocolName}` });
  };
  let protocol = queryString.parse(location.search).protocol || "";
  if (protocol instanceof Array) {
    protocol = protocol[0];
  }

  return (
    <Paper elevation={1} className={classes.root}>
      <Typography className={classes.title} variant="h4">
        Send a swap request
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container={true} spacing={40}>
          <Grid item={true} xs={12}>
            <LedgerFieldSet
              label={"Alpha"}
              ledger={alphaLedger}
              setLedger={setAlphaLedger}
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
              setLedger={setBetaLedger}
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
                  onChange={event => setProtocol(event.target.value)}
                  inputProps={{
                    name: "protocol"
                  }}
                >
                  <option value={""} />
                  <option value={"rfc003"}>RFC003</option>
                </Select>
              </FormControl>
              {protocol === "rfc003" && (
                <Rfc003Params
                  alphaLedger={alphaLedger}
                  betaLedger={betaLedger}
                  alphaExpiry={alphaExpiry}
                  setAlphaExpiry={setAlphaExpiry}
                  betaExpiry={betaExpiry}
                  setBetaExpiry={setBetaExpiry}
                  alphaRefundIdentity={alphaRefundIdentity}
                  setAlphaRefundIdentity={setAlphaRefundIdentity}
                  betaRedeemIdentity={betaRedeemIdentity}
                  setBetaRedeemIdentity={setBetaRedeemIdentity}
                />
              )}
            </fieldset>
          </Grid>
          <Grid item={true} xs={12}>
            <PeerText
              selected={peer}
              setSelected={setPeer}
              label={"Peer"}
              helperText={"IPv4 Socket Address"}
            />
          </Grid>
        </Grid>
        <SendButton />
      </form>
    </Paper>
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

/* interface SendButtonProps {
 *   onClick: (actions: object) => void;
 * }
 *  */
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

export default withStyles(styles)(withRouter(SendSwap));
