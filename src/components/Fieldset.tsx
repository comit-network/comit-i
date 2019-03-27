import { makeStyles } from "@material-ui/styles";
import React, { ReactNode } from "react";

const useStyles = makeStyles(theme => ({
  root: theme.mixins.border(theme)
}));

interface FieldsetProps {
  legend: string;
  disabled?: boolean;
  children: ReactNode;
  dataCy?: string;
}

const Fieldset = ({
  legend,
  children,
  dataCy,
  disabled = false
}: FieldsetProps) => {
  const classes = useStyles();

  return (
    <fieldset className={classes.root} data-cy={dataCy} disabled={disabled}>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
};

export default Fieldset;
