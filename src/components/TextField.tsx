import { TextField as MUITextField } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/styles";
import classNames from "classnames";
import * as React from "react";

const useTextFieldStyles = makeStyles(theme => ({
  textField: {
    margin: theme.spacing.unit,
    [theme.breakpoints.up("xs")]: {
      width: "100%"
    },
    [theme.breakpoints.up("md")]: {
      width: "90%",
      maxWidth: "15rem"
    }
  }
}));

export default function TextField({
  children,
  className,
  ...props
}: TextFieldProps) {
  const classes = useTextFieldStyles();

  return (
    <MUITextField
      className={classNames(classes.textField, className)}
      {...props}
    >
      {children}
    </MUITextField>
  );
}