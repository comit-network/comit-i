import { Store, withState } from "@dump247/storybook-state";
import { Button, Dialog } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import React from "react";
import LedgerActionDialogBody from "../src/pages/SwapList/LedgerActionDialogBody";

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
            onClose={closeDialog(store)}
            action={{
              type: "bitcoin-send-amount-to-address",
              payload: {
                to: "bcrt1q4vmcukhvmd2lajgk9az24s3fndm4swrkl633lq",
                amount: "100000000",
                network: "regtest"
              }
            }}
            onSuccess={() => undefined}
          />
        </Dialog>
      </div>
    ))
  )
  .add(
    "BitcoinBroadcastSignedTransaction",
    withState({ open: false })(({ store }) => (
      <div>
        <Button onClick={openDialog(store)}>Open dialog</Button>
        <Dialog open={store.state.open}>
          <LedgerActionDialogBody
            onClose={closeDialog(store)}
            action={{
              type: "bitcoin-broadcast-signed-transaction",
              payload: {
                hex:
                  "01000000013ea2097dbb3bf6932b97d2469b4fa78e28a2e8d05c586affe9c8cb66dba52543000000008a47304402206f40f4eb8c6cab7c6dd45a132d437e736a6a0dddfb2b78b10e6efbcaf61592f602200d329a57d7a0c969cc349f41852da4ba1a3bc2245e656bdd41780455b97bf84a014104aa49fbe6608076318ff09171e3c2b4a2effa52d53a417371140642996693ae3ac53ce300fff7fef650d0a2418b087a237aa6838eed3bdfad0ec0069df7209f4affffffff0190d60200000000001976a91401ddbca1a39b60b54fb671297a4a20a7681e017188ac00000000",
                network: "regtest",
                min_median_block_time: 1557508315
              }
            }}
            onSuccess={() => undefined}
          />
        </Dialog>
      </div>
    ))
  )
  .add(
    "EthereumDeployContract",
    withState({ open: false })(({ store }) => (
      <div>
        <Button onClick={openDialog(store)}>Open dialog</Button>
        <Dialog open={store.state.open}>
          <LedgerActionDialogBody
            onClose={closeDialog(store)}
            action={{
              type: "ethereum-deploy-contract",
              payload: {
                amount: "111111111111111111111",
                data:
                  "0x6100dc61000f6000396100dc6000f336156051576020361415605c57602060006000376020602160206000600060026048f17f57dd4f2557f4b1d593554932a25ce4180c033a8e370632f351ff33f5a5f1973e602151141660625760006000f35b42635cd5aa6a10609f575b60006000f35b7fb8cac300e37f03ad332e581dea21b2f0b84eaaadc184a295fef71e81f44a741360206000a173493a5a0eafdeae28f430f74ac5031b3ee37b6a6dff5b7f5d26862916391bf49478b2f5103b0720a842b45ef145a268f2cd1fb2aed5517860006000a173493a5a0eafdeae28f430f74ac5031b3ee37b6a6dff",
                gas_limit: "0x1dc90",
                network: "regtest"
              }
            }}
            onSuccess={() => undefined}
          />
        </Dialog>
      </div>
    ))
  )
  .add(
    "EthereumCallContract",
    withState({ open: false })(({ store }) => (
      <div>
        <Button onClick={openDialog(store)}>Open dialog</Button>
        <Dialog open={store.state.open}>
          <LedgerActionDialogBody
            onClose={closeDialog(store)}
            action={{
              type: "ethereum-call-contract",
              payload: {
                contract_address: "0x1189128ff5573f6282dbbf1557ed839dab277aeb",
                data: "0x",
                gas_limit: "0x186a0",
                min_block_timestamp: 1557504724,
                network: "regtest"
              }
            }}
            onSuccess={() => undefined}
          />
        </Dialog>
      </div>
    ))
  );
