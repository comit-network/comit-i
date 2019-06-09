import { InputAdornment } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton/IconButton";
import { StandardTextFieldProps } from "@material-ui/core/TextField";
import React from "react";
import TextField from "../components/TextField";
import MetamaskIcon from "./MetamaskIcon";
import NoWeb3Tooltip from "./NoWeb3Tooltip";
import { useWeb3 } from "./Web3Context";

interface Props extends StandardTextFieldProps {
  onAddress: (address: string) => void;
}

function EthereumAddressTextField({
  className,
  onAddress,
  InputProps,
  ...remainingProps
}: Props) {
  const { web3, defaultAccount } = useWeb3();

  return (
    <TextField
      {...remainingProps}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <NoWeb3Tooltip>
              <IconButton
                disabled={!web3}
                aria-label="Load"
                onClick={() => {
                  if (defaultAccount) {
                    onAddress(defaultAccount);
                  }
                }}
              >
                <MetamaskIcon />
              </IconButton>
            </NoWeb3Tooltip>
          </InputAdornment>
        )
      }}
    />
  );
}

export default EthereumAddressTextField;
