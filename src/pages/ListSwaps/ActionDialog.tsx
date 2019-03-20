import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import axios from "axios";
import React from "react";

interface ActionDialogProps {
  actionName: string;
  setActionName: (actionName: string) => void;
  actionUrl: string;
  setActionUrl: (actionUrl: string) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

function ActionDialog({
  actionName,
  setActionName,
  actionUrl,
  setActionUrl,
  isOpen,
  setOpen
}: ActionDialogProps) {
  const handleCloseDialog = () => {
    setActionName("");
    setActionUrl("");
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleCloseDialog}>
      <DialogTitle>{actionName}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can do the {actionName} action.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            axios.post("http://localhost:8010" + actionUrl);
            handleCloseDialog();
          }}
          color="primary"
        >
          {actionName}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ActionDialog;
