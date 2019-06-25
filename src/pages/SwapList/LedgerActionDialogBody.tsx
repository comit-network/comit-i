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
import { useWeb3 } from "../../components/Web3Context";
import Web3SendTransactionButton from "../../components/Web3SendTransactionButton";
import CopyToClipboardButton from "./CopyToClipboard";

interface LedgerActionDialogBodyProps {
  action: LedgerAction;
  onClose: () => void;
}

function LedgerActionDialogBody({
  action,
  onClose
}: LedgerActionDialogBodyProps) {
  switch (action.type) {
    case "ethereum-deploy-contract":
    case "ethereum-call-contract": {
      return (
        <EthereumActionDialogBody
          action={action as EthereumAction}
          onClose={onClose}
        />
      );
    }
    case "bitcoin-broadcast-signed-transaction": {
      const expiry = action.payload.min_median_block_time;
      const whenReadyMessage = !expiry
        ? "now"
        : "when the latest block's mediantime is past " + expiry;

      return (
        <React.Fragment>
          <DialogTitle>Broadcast Bitcoin transaction</DialogTitle>
          <DialogContent>
            <Typography paragraph={true}>
              Please broadcast the following signed transaction on the{" "}
              <b>{action.payload.network}</b> network {whenReadyMessage}:
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
            <CopyToClipboardButton
              content={action.payload.hex}
              name="transaction"
            />
            <Button onClick={onClose} color="secondary">
              Close
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
            <Typography paragraph={true}>
              Please send <b>{amount}</b> BTC to the following{" "}
              <b>{action.payload.network}</b> address:
            </Typography>
            {action.payload.to}
          </DialogContent>
          <DialogActions>
            <CopyToClipboardButton content={amount} name="amount" />
            <CopyToClipboardButton content={action.payload.to} name="address" />
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
  }
}

interface EthereumActionDialogBodyProps {
  onClose: () => void;
  action: EthereumAction;
}

function EthereumActionDialogBody({
  action,
  onClose
}: EthereumActionDialogBodyProps) {
  const { web3 } = useWeb3();

  switch (action.type) {
    /* This action is too generic and it doesn't differentiate between ether
       and ERC20. This is okay for performing the action on MetaMask, but may
       not be enough if the user decides to use a different wallet */
    case "ethereum-deploy-contract": {
      const mainUnitAmount = toMainUnit({
        name: "ether",
        quantity: action.payload.amount
      });
      const gasLimit = parseInt(action.payload.gas_limit, 16);
      const contract = action.payload.data;

      return (
        <React.Fragment>
          <DialogTitle>Deploy Ethereum contract</DialogTitle>
          <DialogContent>
            <Typography paragraph={true}>
              Deploy the following contract to the Ethereum{" "}
              <b>{action.payload.network}</b> network with{" "}
              <b>{mainUnitAmount}</b> ETH using a gas limit of <b>{gasLimit}</b>{" "}
              wei:
            </Typography>
            <Typography
              variant={"body1"}
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
            <Web3SendTransactionButton
              transactionConfig={{
                data: contract,
                value: action.payload.amount,
                gas: gasLimit
              }}
              onSuccess={onClose}
            />
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
    case "ethereum-call-contract": {
      const address = action.payload.contract_address;
      const data = action.payload.data;
      const gasLimit = parseInt(action.payload.gas_limit, 16);

      const expiry = action.payload.min_block_timestamp;

      return (
        <React.Fragment>
          <DialogTitle>Invoke Ethereum contract</DialogTitle>
          <DialogContent>
            <Typography paragraph={true}>
              Invoke the contract at <b>{address}</b> on the Ethereum{" "}
              <b>{action.payload.network}</b> network using a gas limit of{" "}
              <b>{gasLimit}</b> wei with this data:
            </Typography>
            <Typography
              variant={"body1"}
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
            <Web3SendTransactionButton
              minTimestamp={expiry}
              transactionConfig={{
                to: address,
                data,
                gas: gasLimit
              }}
              onSuccess={onClose}
            />
            <Button onClick={onClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </React.Fragment>
      );
    }
  }
}

export default LedgerActionDialogBody;
