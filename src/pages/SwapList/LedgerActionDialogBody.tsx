import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import React from "react";
import { LedgerAction } from "../../api/getAction";
import { toMainUnit } from "../../api/unit";
import InfoMessage from "../../components/InfoMessage";
import Web3SendTransactionButton from "../../components/Web3SendTransactionButton";
import CopyToClipboardButton from "./CopyToClipboard";

interface LedgerActionDialogBodyProps {
  action: LedgerAction;
  onSuccess: (transactionId?: string) => void;
  onClose: () => void;
  actionDoneBefore?: boolean;
}

function ActionDoneMessage() {
  return (
    <InfoMessage
      text="You have already performed this action. Do not try again unless you are sure it failed last time."
      color="error"
    />
  );
}

function LedgerActionDialogBody({
  action,
  onSuccess,
  onClose,
  actionDoneBefore = false
}: LedgerActionDialogBodyProps) {
  function onSuccessBitcoin() {
    onSuccess();
  }

  function onSuccessEthereum(transactionId: string) {
    onSuccess(transactionId);
  }

  switch (action.type) {
    case "bitcoin-broadcast-signed-transaction": {
      const expiry = action.payload.min_median_block_time;
      const whenReadyMessage = !expiry
        ? "now"
        : "when the latest block's mediantime is past " + expiry;

      return (
        <React.Fragment>
          <DialogTitle>Broadcast Bitcoin transaction</DialogTitle>
          {actionDoneBefore && <ActionDoneMessage />}
          <DialogContent>
            <Typography paragraph={true}>
              Please broadcast the following signed transaction on the{" "}
              <b>{action.payload.network}</b> network {whenReadyMessage}:
            </Typography>
            <Typography
              variant="body1"
              style={{
                wordWrap: "break-word"
              }}
            >
              {action.payload.hex}
            </Typography>
          </DialogContent>
          <DialogActions>
            <CopyToClipboardButton
              content={action.payload.hex}
              name="transaction"
            />
          </DialogActions>
          <DialogActions>
            <Button onClick={onClose} variant="contained" color="secondary">
              Close
            </Button>
            <Button
              onClick={onSuccessBitcoin}
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
    case "bitcoin-send-amount-to-address": {
      const amount = toMainUnit({
        name: "bitcoin",
        quantity: action.payload.amount
      });

      return (
        <React.Fragment>
          <DialogTitle>Send Bitcoin</DialogTitle>
          <DialogContent>
            {actionDoneBefore && <ActionDoneMessage />}
            <Typography paragraph={true}>
              Please send <b>{amount}</b> BTC to the following{" "}
              <b>{action.payload.network}</b> address:
            </Typography>
            {action.payload.to}
          </DialogContent>
          <DialogActions>
            <CopyToClipboardButton content={amount} name="amount" />
            <CopyToClipboardButton content={action.payload.to} name="address" />
          </DialogActions>
          <DialogActions>
            <Button onClick={onClose} variant="contained" color="secondary">
              Close
            </Button>
            <Button
              onClick={onSuccessBitcoin}
              variant="contained"
              color="primary"
            >
              Confirm
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
    /* This action is too generic and it doesn't differentiate between ether
         and ERC20. This is enough for performing the action, but not for
         informing the user about what the action does */
    case "ethereum-deploy-contract": {
      const amount = toMainUnit({
        name: "ether",
        quantity: action.payload.amount
      });

      return (
        <React.Fragment>
          <DialogTitle>Deploy Ethereum contract</DialogTitle>
          <DialogContent>
            {actionDoneBefore && <ActionDoneMessage />}
            <Typography paragraph={true}>
              Deploy the following contract to the Ethereum{" "}
              <b>{action.payload.network}</b> network with <b>{amount}</b> ETH:
            </Typography>
            <Typography
              variant="body1"
              style={{
                wordWrap: "break-word"
              }}
            >
              {action.payload.data}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant="contained" color="secondary">
              Close
            </Button>
            <Web3SendTransactionButton
              transactionConfig={{
                data: action.payload.data,
                value: action.payload.amount,
                gas: +action.payload.gas_limit
              }}
              onSuccess={onSuccessEthereum}
            />
          </DialogActions>
        </React.Fragment>
      );
    }
    case "ethereum-call-contract": {
      const expiry = action.payload.min_block_timestamp;

      return (
        <React.Fragment>
          <DialogTitle>Invoke Ethereum contract</DialogTitle>
          <DialogContent>
            {actionDoneBefore && <ActionDoneMessage />}
            <Typography paragraph={true}>
              Invoke the contract at <b>{action.payload.contract_address}</b> on
              the Ethereum <b>{action.payload.network}</b> network with this
              data:
            </Typography>
            <Typography
              variant="body1"
              style={{
                wordWrap: "break-word"
              }}
            >
              {action.payload.data}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} variant="contained" color="secondary">
              Close
            </Button>
            <Web3SendTransactionButton
              minTimestamp={expiry}
              transactionConfig={{
                to: action.payload.contract_address,
                data: action.payload.data,
                gas: action.payload.gas_limit
              }}
              onSuccess={onSuccessEthereum}
            />
          </DialogActions>
        </React.Fragment>
      );
    }
  }
}

export default LedgerActionDialogBody;
