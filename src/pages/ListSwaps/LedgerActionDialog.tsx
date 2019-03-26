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
  url: string;
  onClose: () => void;
}

function LedgerActionDialog({ url, onClose }: LedgerActionDialogProps) {
  const { data, isLoading } = useAsync(getAction(url));
  const body = isLoading ? (
    <FetchingActionDialogBody />
  ) : (
    <LedgerActionDialogBody action={data} onClose={onClose} />
  );
  return <Dialog open={true}>{body}</Dialog>;
}

export default LedgerActionDialog;
