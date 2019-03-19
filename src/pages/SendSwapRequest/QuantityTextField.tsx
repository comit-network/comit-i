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
  quantity: string;
  onChange: (quantity: string) => void;
}

function QuantityText({ quantity, onChange }: QuantityTextProps) {
  const classes = useQuantityTextStyles();

  return (
    <TextField
      required={true}
      className={classes.root}
      type="number"
      value={quantity}
      onChange={event => onChange(event.target.value)}
      label="Quantity"
    />
  );
}

export default QuantityText;
