import { Button, CircularProgress, Tooltip } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ErrorIcon from "@material-ui/icons/Error";
import TimerIcon from "@material-ui/icons/Timer";
import React, { useState } from "react";
import { TransactionConfig } from "web3-core/types";
import MetamaskIcon from "./MetamaskIcon";
import NoWeb3Tooltip from "./NoWeb3Tooltip";
import TooEarlyTooltip from "./TooEarlyTooltip";
import { useWeb3 } from "./Web3Context";

interface Props {
  transactionConfig: TransactionConfig;
  minTimestamp?: number;
  onSuccess: (transactionId: string) => void;
}

enum TransactionState {
  Initial,
  Signing,
  Sent,
  Error,
  TooEarly
}

function Web3SendTransactionButton({
  transactionConfig,
  minTimestamp,
  onSuccess
}: Props) {
  const { web3, defaultAccount } = useWeb3();
  const [state, setState] = useState(TransactionState.Initial);
  const [networkTime, setNetworkTime] = useState(0);

  const onClickHandler = web3
    ? async () => {
        const block = await web3.eth.getBlock("latest");
        setNetworkTime(+block.timestamp);
        const actionReady = !minTimestamp || block.timestamp >= minTimestamp;

        if (actionReady) {
          setState(TransactionState.Signing);
          try {
            const receipt = await web3.eth.sendTransaction({
              ...transactionConfig,
              from: defaultAccount
            });
            setState(TransactionState.Sent);
            onSuccess(receipt.transactionHash);
          } catch (e) {
            setState(TransactionState.Error);
          }
        } else {
          setState(TransactionState.TooEarly);
        }
      }
    : () => undefined;

  return (
    <NoWeb3Tooltip>
      {state === TransactionState.Initial && (
        <Button
          variant="contained"
          disabled={!web3}
          color="primary"
          onClick={onClickHandler}
        >
          Send transaction &nbsp;
          <MetamaskIcon fontSize="small" />
        </Button>
      )}
      {state === TransactionState.Signing && (
        <Button variant="contained" disabled={true} color="primary">
          <CircularProgress size={20} />
          &nbsp; Signing in progress...
        </Button>
      )}
      {state === TransactionState.Sent && (
        <Tooltip title="Transaction was already sent!">
          <span>
            <Button variant="contained" disabled={true} color="primary">
              <DoneIcon color="primary" fontSize="small" />
              &nbsp; Transaction sent!
            </Button>
          </span>
        </Tooltip>
      )}
      {state === TransactionState.Error && (
        <Button variant="contained" color="primary" onClick={onClickHandler}>
          <ErrorIcon color="error" fontSize="small" />
          &nbsp; Failed. Try again?
        </Button>
      )}
      {state === TransactionState.TooEarly && (
        <TooEarlyTooltip whenValid={minTimestamp || 0} networkNow={networkTime}>
          <Button variant="contained" color="primary" onClick={onClickHandler}>
            <TimerIcon color="error" fontSize="small" />
            &nbsp; Too early. Please try again later
          </Button>
        </TooEarlyTooltip>
      )}
    </NoWeb3Tooltip>
  );
}

export default Web3SendTransactionButton;
