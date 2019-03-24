import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography
} from "@material-ui/core";
import FileCopy from "@material-ui/icons/FileCopy";
import copyToClipboard from "copy-to-clipboard";
import React from "react";

interface LedgerActionDialogBodyProps {
  onCloseButtonClicked: (event: React.MouseEvent) => void;
  action: LedgerAction;
}

type LedgerAction =
  | {
      type: "bitcoin-send-amount-to-address";
      payload: { to: string; amount: string; network: string };
    }
  | {
      type: "bitcoin-broadcast-signed-transaction";
      payload: { hex: string; network: string };
    }
  | {
      type: "ethereum-deploy-contract";
      payload: {
        data: string;
        amount: string;
        gas_limit: string;
        network: string;
      };
    }
  | {
      type: "ethereum-invoke-contract";
      payload: {
        contract_address: string;
        data: string;
        amount: string;
        gas_limit: string;
        network: string;
      };
    };

function LedgerActionDialogBody({
  onCloseButtonClicked,
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
              <b>{action.payload.network}</b> network.
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
            <Tooltip
              disableHoverListener={true}
              title={"Copied!"}
              placement={"top"}
            >
              <Button
                onClick={() => copyToClipboard(action.payload.hex)}
                color="primary"
              >
                <FileCopy fontSize={"small"} />
                &nbsp;Copy to clipboard
              </Button>
            </Tooltip>
            <Button onClick={onCloseButtonClicked} color="secondary">
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
          <DialogContent>Here goes the content!</DialogContent>
          <DialogActions>
            <Button onClick={onCloseButtonClicked} color="secondary">
              Cancel
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
            <Button onClick={onCloseButtonClicked} color="secondary">
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
            <Button onClick={onCloseButtonClicked} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
  }
}

export default LedgerActionDialogBody;
