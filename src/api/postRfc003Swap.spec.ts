import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import apiEndpoint from "./apiEndpoint";
import postRfc003Swap from "./postRfc003Swap";

describe("postRfc003Swap", () => {
  it("should build the request using smallest units", done => {
    const mock = new MockAdapter(axios);

    mock
      .onPost(
        apiEndpoint()
          .path("swaps/rfc003")
          .toString()
      )
      .replyOnce(200);

    const alphaQuantity = "3";
    const alphaQuantityInSatoshi = "300000000";

    const betaQuantity = "4";
    const betaQuantityInWei = "4000000000000000000";

    const swapDetails = {
      alpha_ledger: {
        name: "bitcoin",
        network: "regtest"
      },
      alpha_asset: {
        name: "bitcoin",
        quantity: alphaQuantity
      },
      beta_ledger: {
        name: "ethereum",
        network: "regtest"
      },
      beta_asset: {
        name: "ether",
        quantity: betaQuantity
      }
    };

    const rfc003Params = {
      alpha_expiry: 20,
      beta_expiry: 10,
      beta_ledger_redeem_identity: "0x493a5a0eafdeae28f430f74ac5031b3ee37b6a6d"
    };

    const peerId = "QmPRNaiDUcJmnuJWUyoADoqvFotwaMRFKV2RyZ7ZVr1fqd";

    postRfc003Swap(swapDetails, rfc003Params, peerId)
      .then(() => {
        expect(JSON.parse(mock.history.post[0].data)).toHaveProperty(
          "alpha_asset.quantity",
          alphaQuantityInSatoshi
        );
        expect(JSON.parse(mock.history.post[0].data)).toHaveProperty(
          "beta_asset.quantity",
          betaQuantityInWei
        );
      })
      .then(done)
      .catch(done.fail);
  });
});
