import { InputAdornment, Tooltip } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton/IconButton";
import { StandardTextFieldProps } from "@material-ui/core/TextField";
import React, { useState } from "react";
import TextField from "../components/TextField";
import MetamaskIcon from "./MetamaskIcon";
import { Web3Loader } from "./Web3Context";

interface Props extends StandardTextFieldProps {
  onAddress: (address: string) => void;
}

function EthereumAddressTextField({
  className,
  onAddress,
  InputProps,
  ...remainingProps
}: Props) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <TextField
      {...remainingProps}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <Web3Loader
              ifPresent={web3 => (
                <Tooltip
                  title="Please unlock metamask first."
                  open={showTooltip}
                >
                  <IconButton
                    aria-label="Load"
                    onClick={async () => {
                      const accounts = await web3.eth.getAccounts();
                      const firstAccount = accounts[0];

                      if (!firstAccount) {
                        setShowTooltip(true);
                        setTimeout(() => {
                          setShowTooltip(false);
                        }, 1500);
                      } else {
                        onAddress(firstAccount);
                      }
                    }}
                  >
                    <MetamaskIcon />
                  </IconButton>
                </Tooltip>
              )}
            />
          </InputAdornment>
        )
      }}
    />
  );
}

export default EthereumAddressTextField;
