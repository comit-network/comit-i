import { FormControl, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import pascalCase from "pascal-case";
import React from "react";

const useNetworkSelectStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: "10rem"
  }
}));

interface NetworkSelectProps {
  ledger: string;
  selected?: string;
  setSelected: (network: string) => void;
  label: string;
}

interface Networks {
  [ledger: string]: string[];
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

  const ledgerNetworks = {
    bitcoin: ["", "mainnet", "regtest", "testnet"],
    ethereum: ["", "mainnet", "regtest", "ropsten"]
  } as Networks;
  const networks = ledgerNetworks[ledger] || [];
  const menuItems = networks.map(value => (
    <option value={value} key={value}>
      {pascalCase(value)}
    </option>
  ));

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

export default NetworkSelect;
