import { withState } from "@dump247/storybook-state";
import { storiesOf } from "@storybook/react";
import React from "react";
import EthereumAddressTextField from "../src/components/EthereumAddressTextField";
import { Web3Provider } from "../src/components/Web3Context";

storiesOf("EthereumAddressTextField", module)
  .add(
    "default",
    withState({ address: "" })(({ store }) => (
      <Web3Provider>
        <EthereumAddressTextField
          value={store.state.address}
          onChange={event => store.set({ address: event.target.value })}
          onAddress={address => {
            store.set({ address });
          }}
        />
      </Web3Provider>
    ))
  );