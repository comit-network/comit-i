import { storiesOf } from "@storybook/react";
import React from "react";
import { Web3Provider } from "../src/components/Web3Context";
import Web3SendTransactionButton from "../src/components/Web3SendTransactionButton";

storiesOf("Web3SendTransactionButton", module).add(
  "send amount to address",
  () => (
    <Web3Provider>
      <Web3SendTransactionButton
        transactionConfig={{
          to: "0x00a329c0648769a73afac7f9381e08fb43dbea72",
          value: "10000000000000"
        }}
        minTimestamp={1557915959}
        onSuccess={() => {
          return;
        }}
      />
    </Web3Provider>
  )
);
