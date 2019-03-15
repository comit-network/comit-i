import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React from "react";

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

function PeerTextField({
  selected,
  setSelected,
  label,
  helperText
}: PeerTextProps) {
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

export default PeerTextField;
