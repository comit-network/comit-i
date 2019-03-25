import { CircularProgress, Dialog } from "@material-ui/core";
import { useAsync } from "react-async";
import getAction from "../../api/get_action";
import LedgerActionDialogBody from "./LedgerActionDialogBody";

interface LedgerActionDialogProps {
  url: string;
  onClose: () => void;
}

function LedgerActionDialog({ url, onClose }: LedgerActionDialogProps) {
  const { data, isLoading } = useAsync(getAction(url));
  if (isLoading) {
    return <CircularProgress disableShrink={true} />;
  }
  if (data) {
    return (
      <Dialog open={true}>
        <LedgerActionDialogBody action={data} onClose={onClose} />
      </Dialog>
    );
  }
  return null;
}

export default LedgerActionDialog;
