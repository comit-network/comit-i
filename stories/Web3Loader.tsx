import { storiesOf } from "@storybook/react";
import React from "react";
import Web3Loader from "../src/components/Web3Loader";

storiesOf("Web3Loader", module)
  .add("default", () => (
    <Web3Loader ifPresent={() =>

      <span> web3 is available </span>
    }/>
  ))
;
