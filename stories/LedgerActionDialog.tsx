import { storiesOf } from "@storybook/react";
import React from "react";
import { Button, Dialog } from "@material-ui/core";
import LedgerActionDialogBody from "../src/pages/ListSwaps/LedgerActionDialogBody";
import { Store, withState } from "@dump247/storybook-state";

interface DialogStoryState {
  open: boolean;
}

const openDialog = (store: Store<DialogStoryState>) => () =>
  store.set({
    open: true
  });

const closeDialog = (store: Store<DialogStoryState>) => () =>
  store.set({
    open: false
  });

storiesOf("LedgerActionDialog", module)
  .add(
    "BitcoinSendAmountToAddress",
    withState({ open: false })(({ store }) => (
      <div>
        <Button onClick={openDialog(store)}>Open dialog</Button>
        <Dialog open={store.state.open}>
          <LedgerActionDialogBody
            onCloseButtonClicked={closeDialog(store)}
            action={{
              type: "bitcoin-send-amount-to-address",
              payload: {
                to: "",
                amount: "",
                network: ""
              }
            }}
          />
        </Dialog>
      </div>
    ))
  )
  .add("BitcoinBroadcastSignedTransaction",
    withState({ open: false })(({ store }) => (
      <div>
        <Button onClick={openDialog(store)}>Open dialog</Button>
        <Dialog open={store.state.open}>
          <LedgerActionDialogBody
            onCloseButtonClicked={closeDialog(store)}
            action={{
              type: "bitcoin-broadcast-signed-transaction",
              payload: {
                hex:
                  "01000000013ea2097dbb3bf6932b97d2469b4fa78e28a2e8d05c586affe9c8cb66dba52543000000008a47304402206f40f4eb8c6cab7c6dd45a132d437e736a6a0dddfb2b78b10e6efbcaf61592f602200d329a57d7a0c969cc349f41852da4ba1a3bc2245e656bdd41780455b97bf84a014104aa49fbe6608076318ff09171e3c2b4a2effa52d53a417371140642996693ae3ac53ce300fff7fef650d0a2418b087a237aa6838eed3bdfad0ec0069df7209f4affffffff0190d60200000000001976a91401ddbca1a39b60b54fb671297a4a20a7681e017188ac00000000",
                network: "regtest"
              }
            }}
          />
        </Dialog>
      </div>
    ))
  )
  .add("EthereumDeployContract", () => <span />)
  .add("EthereumInvokeContract", () => <span />);
