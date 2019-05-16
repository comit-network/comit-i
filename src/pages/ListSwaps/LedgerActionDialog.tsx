import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import React, { useState } from "react";
import { useAsync } from "react-async";
import getAction, { LedgerAction } from "../../api/getAction";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import LedgerActionDialogBody from "./LedgerActionDialogBody";

function FetchingActionDialogBody() {
  return (
    <React.Fragment>
      <DialogTitle>Fetching action...</DialogTitle>
      <DialogContent>
        <CircularProgress disableShrink={true} />
      </DialogContent>
    </React.Fragment>
  );
}

interface LedgerActionDialogProps {
  path: uri.URI;
  onClose: () => void;
}

const getActionFn = async ({ path }: any) => {
  return getAction(path);
};

function LedgerActionDialog({ path, onClose }: LedgerActionDialogProps) {
  const { isLoading, data, error } = useAsync({ promiseFn: getActionFn, path });
  const [displayError, setDisplayError] = useState(false);

  if (isLoading) {
    return (
      <Dialog open={true}>
        <FetchingActionDialogBody />
      </Dialog>
    );
  } else if (error) {
    return (
      <ErrorSnackbar
        message={"Failed to fetch action. Is your COMIT node running?"}
        onClose={() => setDisplayError(false)}
        open={displayError}
      />
    );
  } else {
    /* TODO: setting open to true means that backDropClick and escapeKeyDown
       don't close the dialog  */
    return (
      <Dialog open={true}>
        <LedgerActionDialogBody
          action={data as LedgerAction}
          onClose={onClose}
        />
      </Dialog>
    );
  }
}

export default LedgerActionDialog;
