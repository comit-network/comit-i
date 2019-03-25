import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import React from "react";
import { LedgerAction } from "../../api/get_action";
import CopyToClipboard from "./CopyToClipboard";

interface LedgerActionDialogBodyProps {
  onClose: (event: React.MouseEvent) => void;
  action: LedgerAction;
}

function LedgerActionDialogBody({
  onClose,
  action
}: LedgerActionDialogBodyProps) {
  switch (action.type) {
    case "bitcoin-broadcast-signed-transaction": {
      return (
        <React.Fragment>
          <DialogTitle>Broadcast Bitcoin transaction</DialogTitle>
          <DialogContent>
            <Typography paragraph={true}>
              Please broadcast the following signed transaction on the{" "}
              <b>{action.payload.network}</b> network:
            </Typography>
            <Typography
              variant={"body1"}
              style={{
                wordWrap: "break-word"
              }}
            >
              {action.payload.hex}
            </Typography>
          </DialogContent>
          <DialogActions>
            <CopyToClipboard element={action.payload.hex} name="transaction" />
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
    case "bitcoin-send-amount-to-address": {
      return (
        <React.Fragment>
          <DialogTitle>Send Bitcoin</DialogTitle>
          <DialogContent>
            <Typography paragraph={true}>
              Please send <b>{action.payload.amount}</b> satoshi to the
              following <b>{action.payload.network}</b> address:
            </Typography>
            <Typography
              variant={"body1"}
              style={{
                wordWrap: "break-word"
              }}
            >
              {action.payload.to}
            </Typography>
          </DialogContent>
          <DialogActions>
            <CopyToClipboard element={action.payload.amount} name="amount" />
            <CopyToClipboard element={action.payload.to} name="address" />
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
    case "ethereum-deploy-contract": {
      return (
        <React.Fragment>
          <DialogTitle>Deploy Ethereum contract</DialogTitle>
          <DialogContent>Here goes the content!</DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
    case "ethereum-invoke-contract": {
      return (
        <React.Fragment>
          <DialogTitle>Invoke Ethereum contract</DialogTitle>
          <DialogContent>Here goes the content!</DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
  }
}

export default LedgerActionDialogBody;
