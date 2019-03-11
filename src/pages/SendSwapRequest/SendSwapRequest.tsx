import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";

const useLedgerSelectStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: "10rem"
  }
}));

interface LedgerSelectProps {
  selected: string | undefined;
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
  selected: string | undefined;
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

const SendSwap = () => {
  const [alphaLedger, setAlphaLedger] = useState("");
  const [betaLedger, setBetaLedger] = useState("");
  const [protocol, setProtocol] = useState("");

  return (
    <div>
      <LedgerSelect
        disabledValues={[betaLedger]}
        selected={alphaLedger}
        setSelected={setAlphaLedger}
        label={"Alpha Ledger"}
      />
      <LedgerSelect
        disabledValues={[alphaLedger]}
        selected={betaLedger}
        setSelected={setBetaLedger}
        label={"Beta Ledger"}
      />
      <ProtocolSelect
        selected={protocol}
        setSelected={setProtocol}
        label={"Protocol"}
      />
    </div>
  );
};

export default SendSwap;
