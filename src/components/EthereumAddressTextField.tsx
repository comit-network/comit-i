import { InputAdornment, TextField } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton/IconButton";
import { StandardTextFieldProps } from "@material-ui/core/TextField";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import React from "react";
import Web3Loader from "./Web3Loader";

interface Props extends StandardTextFieldProps {
  onAddress: (address: string) => void;
}

const styles= {
  minWidth: "27rem"
};

function EthereumAddressTextField({
  className,
  onAddress,
  InputProps,
  ...remainingProps
}: Props) {
  return (
    <TextField
      {...remainingProps}
      style={styles}
      label="Ethereum Address"
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <Web3Loader
              ifPresent={web3 => (
                <IconButton
                  aria-label="Load"
                  onClick={async () => {
                    const accounts = await web3.eth.getAccounts();
                    onAddress(accounts[0]);
                  }}
                >
                  <AutorenewIcon />
                </IconButton>
              )}
            />
          </InputAdornment>
        )
      }}
    />
  );
}

export default EthereumAddressTextField;
