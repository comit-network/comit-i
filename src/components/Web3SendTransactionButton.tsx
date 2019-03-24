import { Button } from "@material-ui/core";
import React from "react";
import { Transaction } from "web3-core/types";
import { Web3Loader, Web3Provider } from "./Web3Context";

interface Props {
  transaction: Transaction;
}

function Web3SendTransactionButton({ transaction }: Props) {
  return (
    <Web3Provider>
      <Web3Loader
        ifPresent={web3 => {
          // TODO: get address of default account using web3
          const tx = {
            ...transaction,
            from: "0xe914345Edf276Bfad15dee8a9655AFa512228ded"
          };
          return (
            <Button onClick={() => web3.eth.sendTransaction(tx)}>Button</Button>
          );
        }}
        ifNotPresent={() => <pre>no web3</pre>}
      />
    </Web3Provider>
  );
}

export default Web3SendTransactionButton;
