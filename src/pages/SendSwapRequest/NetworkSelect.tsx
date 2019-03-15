import { FormControl, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

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

export default NetworkSelect;
