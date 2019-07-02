import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from "@material-ui/core";
import React from "react";
import { EthereumAction, LedgerAction } from "../../api/getAction";
import { toMainUnit } from "../../api/unit";
import InfoMessage from "../../components/InfoMessage";
import { useWeb3 } from "../../components/Web3Context";
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

  switch (action.type) {
    case "ethereum-deploy-contract":
    case "ethereum-call-contract": {
      return (
        <EthereumActionDialogBody
          action={action as EthereumAction}
          onSuccess={onSuccess}
          onClose={onClose}
          actionDoneBefore={actionDoneBefore}
        />
      );
    }
    case "bitcoin-broadcast-signed-transaction": {
      const transaction = action.payload.hex;
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
              {transaction}
            </Typography>
          </DialogContent>
          <DialogActions>
            <CopyToClipboardButton content={transaction} name="transaction" />
          </DialogActions>
          <DialogActions>
            <Button onClick={onClose} variant="contained" color="secondary">
              Cancel
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
      const address = action.payload.to;

      return (
        <React.Fragment>
          <DialogTitle>Send Bitcoin</DialogTitle>
          <DialogContent>
            {actionDoneBefore && <ActionDoneMessage />}
            <Typography paragraph={true}>
              Please send <b>{amount}</b> BTC to the following{" "}
              <b>{action.payload.network}</b> address:
            </Typography>
            {address}
          </DialogContent>
          <DialogActions>
            <CopyToClipboardButton content={amount} name="amount" />
            <CopyToClipboardButton content={address} name="address" />
          </DialogActions>
          <DialogActions>
            <Button onClick={onClose} variant="contained" color="secondary">
              Cancel
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
  }
}

interface EthereumActionDialogBodyProps {
  action: EthereumAction;
  onSuccess: (transactionId?: string) => void;
  onClose: () => void;
  actionDoneBefore?: boolean;
}

function EthereumActionDialogBody({
  action,
  onSuccess,
  onClose,
  actionDoneBefore = false
}: EthereumActionDialogBodyProps) {
  const { web3 } = useWeb3();
  const gasLimit = parseInt(action.payload.gas_limit, 16);

  function onSuccessMetaMask(transactionId: string) {
    onSuccess(transactionId);
  }

  function onManualConfirmation() {
    onSuccess();
  }

  switch (action.type) {
    /* This action is too generic and it doesn't differentiate between ether
       and ERC20. This is okay for performing the action on MetaMask, but may
       not be enough if the user decides to use a different wallet */
    case "ethereum-deploy-contract": {
      const mainUnitAmount = toMainUnit({
        name: "ether",
        quantity: action.payload.amount
      });
      const contract = action.payload.data;

      return (
        <React.Fragment>
          <DialogTitle>Deploy Ethereum contract</DialogTitle>
          <DialogContent>
            {actionDoneBefore && <ActionDoneMessage />}
            <Typography paragraph={true}>
              Deploy the following contract to the Ethereum{" "}
              <b>{action.payload.network}</b> network with{" "}
              <b>{mainUnitAmount}</b> ETH using a gas limit of <b>{gasLimit}</b>{" "}
              wei:
            </Typography>
            <Typography
              variant="body1"
              style={{
                wordWrap: "break-word"
              }}
            >
              {contract}
            </Typography>
          </DialogContent>
          {!web3 && (
            <DialogActions>
              <CopyToClipboardButton content={mainUnitAmount} name="amount" />
              <CopyToClipboardButton content={contract} name="contract code" />
              <CopyToClipboardButton
                content={gasLimit.toString()}
                name="gas limit"
              />
            </DialogActions>
          )}
          <DialogActions>
            <Button onClick={onClose} variant="contained" color="secondary">
              Cancel
            </Button>
            {!web3 && (
              <Button
                onClick={onManualConfirmation}
                variant="contained"
                color="primary"
              >
                Confirm
              </Button>
            )}
            <Web3SendTransactionButton
              transactionConfig={{
                data: contract,
                value: action.payload.amount,
                gas: gasLimit
              }}
              onSuccess={onSuccessMetaMask}
            />
          </DialogActions>
        </React.Fragment>
      );
    }
    case "ethereum-call-contract": {
      const address = action.payload.contract_address;
      const data = action.payload.data;

      const expiry = action.payload.min_block_timestamp;

      return (
        <React.Fragment>
          <DialogTitle>Invoke Ethereum contract</DialogTitle>
          <DialogContent>
            {actionDoneBefore && <ActionDoneMessage />}
            <Typography paragraph={true}>
              Invoke the contract at <b>{address}</b> on the Ethereum{" "}
              <b>{action.payload.network}</b> network using a gas limit of{" "}
              <b>{gasLimit}</b> wei with this data:
            </Typography>
            <Typography
              variant="body1"
              style={{
                wordWrap: "break-word"
              }}
            >
              {data}
            </Typography>
          </DialogContent>
          {!web3 && (
            <DialogActions>
              <CopyToClipboardButton content={address} name="address" />
              <CopyToClipboardButton content={data} name="data" />
              <CopyToClipboardButton
                content={gasLimit.toString()}
                name="gas limit"
              />
            </DialogActions>
          )}
          <DialogActions>
            <Button onClick={onClose} variant="contained" color="secondary">
              Cancel
            </Button>
            {!web3 && (
              <Button
                onClick={onManualConfirmation}
                variant="contained"
                color="primary"
              >
                Confirm
              </Button>
            )}
            <Web3SendTransactionButton
              minTimestamp={expiry}
              transactionConfig={{
                to: address,
                data,
                gas: gasLimit
              }}
              onSuccess={onSuccessMetaMask}
            />
          </DialogActions>
        </React.Fragment>
      );
    }
  }
}

export default LedgerActionDialogBody;
