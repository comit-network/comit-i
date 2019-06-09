import ErrorIcon from "@material-ui/icons/Error";
import React from "react";
import Snackbar from "./Snackbar";

interface ErrorSnackbarProps {
  open: boolean;
  onClose?: () => void;
  message: string;
}

function ErrorSnackbar({ open, onClose, message }: ErrorSnackbarProps) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      message={message}
      icon={ErrorIcon}
      backgroundPaletteVariant="error"
      backgroundColor="dark"
      data-cy="error-snackbar"
    />
  );
}

export default ErrorSnackbar;
