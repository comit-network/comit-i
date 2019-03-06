import { IconButton, Snackbar, SnackbarContent } from "@material-ui/core";
import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import { makeStyles } from "@material-ui/styles";

interface ErrorSnackbarProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const useStyles = makeStyles(theme => ({
  message: {
    display: "flex",
    alignItems: "center"
  },
  icon: {
    marginRight: theme.spacing.unit
  }
}));

function ErrorSnackbar({ open, onClose, message }: ErrorSnackbarProps) {
  const classes = useStyles();

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={open}
      onClose={onClose}
    >
      <SnackbarContent
        classes={{
          message: classes.message
        }}
        message={
          <React.Fragment>
            <ErrorIcon className={classes.icon} />
            <span>{message}</span>
          </React.Fragment>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </Snackbar>
  );
}

export default ErrorSnackbar;
