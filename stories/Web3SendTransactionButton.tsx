import React from "react";
import { storiesOf } from "@storybook/react";
import Web3SendTransactionButton from "../src/components/Web3SendTransactionButton";

storiesOf("Web3SendTransactionButton", module)
  .add("click it", () => (
    <Web3SendTransactionButton transaction={{ to: "0x00a329c0648769a73afac7f9381e08fb43dbea72", value: "0x6F05B59D3B20000" }}></Web3SendTransactionButton >
  ));
