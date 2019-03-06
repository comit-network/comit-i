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
  messageContainer: {
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
        message={
          <div className={classes.messageContainer}>
            <ErrorIcon className={classes.icon}/>
            <span>{message}</span>
          </div>
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
