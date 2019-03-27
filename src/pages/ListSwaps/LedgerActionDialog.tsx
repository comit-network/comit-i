import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import React from "react";
import { useAsync } from "react-async";
import getAction, { LedgerAction } from "../../api/get_action";
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

  if (isLoading) {
    return (
      <Dialog open={true}>
        <FetchingActionDialogBody />
      </Dialog>
    );
  } else if (error) {
    return <Dialog open={true}>{error.toString()}</Dialog>;
  } else {
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
