import { withState } from "@dump247/storybook-state";
import { storiesOf } from "@storybook/react";
import React from "react";
import EthereumAddressTextField from "../src/components/EthereumAddressTextField";

storiesOf("EthereumAddressTextField", module)
  .add(
    "with web3 present",
    withState({ address: "" })(({ store }) => (
      <EthereumAddressTextField
        value={store.state.address}
        onChange={event => store.set({ address: event.target.value })}
        onAddress={address => {
          store.set({ address });
        }}
      />
    ))
  );
