import { withState } from "@dump247/storybook-state";
import { ThemeProvider } from "@material-ui/styles";
import { storiesOf } from "@storybook/react";
import React from "react";
import BitcoinNanoLedgerAddressTextField from "../src/components/BitcoinNanoLedgerAddressTextField";
import appTheme from "../src/theme";

storiesOf("BitcoinNanoLedgerAddressTextField", module).add(
  "default",
  withState({ address: "" })(({ store }) => (
    <ThemeProvider theme={appTheme}>
      <BitcoinNanoLedgerAddressTextField
        value={store.state.address}
        onChange={event => store.set({ address: event.target.value })}
        onAddress={address => {
          store.set({ address });
        }}
      />
    </ThemeProvider>
  ))
);
