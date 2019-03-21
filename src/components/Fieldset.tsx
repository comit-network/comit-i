import { makeStyles } from "@material-ui/styles";
import React, { ReactNode } from "react";

const useStyles = makeStyles(theme => ({
  root: theme.mixins.border(theme)
}));

interface FieldsetProps {
  legend: string;
  children: ReactNode;
}

const Fieldset = ({ legend, children }: FieldsetProps) => {
  const classes = useStyles();

  return (
    <fieldset className={classes.root}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
};

export default Fieldset;
