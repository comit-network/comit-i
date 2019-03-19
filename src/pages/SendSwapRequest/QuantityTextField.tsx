import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

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

export default QuantityText;