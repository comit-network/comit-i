import DoneIcon from "@material-ui/icons/Done";
import React from "react";
import Snackbar from "./Snackbar";

interface SuccessSnackbarProps {
  open: boolean;
  onClose?: () => void;
  message: string;
}

function SuccessSnackbar({ open, onClose, message }: SuccessSnackbarProps) {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      message={message}
      icon={DoneIcon}
      backgroundPaletteVariant="primary"
      backgroundColor="dark"
    />
  );
}

export default SuccessSnackbar;
