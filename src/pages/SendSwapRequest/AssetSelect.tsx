import { FormControl, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

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

export default AssetSelect;
