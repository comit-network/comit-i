import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import React from "react";
import { useAsync } from "react-async";
import getAction from "../../api/get_action";
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
  path: string;
  onClose: () => void;
}

const getActionFn = async ({ path }: any) => {
  return getAction(path);
};

function LedgerActionDialog({ path, onClose }: LedgerActionDialogProps) {
  const { isLoading, data } = useAsync({ promiseFn: getActionFn, path });

  const body = isLoading ? (
    <FetchingActionDialogBody />
  ) : (
    data && <LedgerActionDialogBody action={data} onClose={onClose} />
  );
  return <Dialog open={true}>{body}</Dialog>;
}

export default LedgerActionDialog;
