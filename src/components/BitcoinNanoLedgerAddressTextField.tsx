import { IconButton, InputAdornment } from "@material-ui/core";
import { StandardTextFieldProps } from "@material-ui/core/TextField";
import Btc from "hw-app-btc";
import TransportU2F from "hw-transport-u2f";
import React from "react";
import { useAsync } from "react-async";
import ErrorSnackbar from "./ErrorSnackbar";
import MetamaskIcon from "./MetamaskIcon";
import TextField from "./TextField";

const getNanoLedgerBitcoinAddress = async () => {
  const transport = await TransportU2F.create();
  const btcApp = new Btc(transport);
  const { bitcoinAddress } = await btcApp.getWalletPublicKey("44'/0'/0'/0");
  return bitcoinAddress;
};

interface Props extends StandardTextFieldProps {
  onAddress: (address: string) => void;
}

function BitcoinNanoLedgerAddressTextField({
  onAddress,
  InputProps,
  ...remainingProps
}: Props) {
  const { run: getBitcoinAddress, isRejected, isLoading } = useAsync({
    deferFn: getNanoLedgerBitcoinAddress,
    onResolve: onAddress
  });

  return TransportU2F.isSupported() && window.location.protocol === "https:" ? (
    <React.Fragment>
      <TextField
        {...remainingProps}
        InputProps={{
          ...InputProps,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={isLoading}
                aria-label="Load"
                onClick={getBitcoinAddress}
              >
                <MetamaskIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <ErrorSnackbar
        open={isRejected}
        message={
          "Could not retrieve the Bitcoin address. Please ensure that your Ledger Nano S is unlocked and that the Bitcoin app is open"
        }
      />
    </React.Fragment>
  ) : (
    <TextField {...remainingProps} />
  );
}

export default BitcoinNanoLedgerAddressTextField;
