import { storiesOf } from "@storybook/react";
import React from "react";
import Web3Loader from "../src/components/Web3Loader";

storiesOf("Web3Loader", module)
  .add("web3 is present", () => (
    <Web3Loader ifPresent={() =>
      <span> web3 is available </span>
    }/>
  )).add("web3 is not present", () => (
    <Web3Loader ifNotPresent={() =>

      <span> web3 is not available </span>
    }/>
  ))
;
