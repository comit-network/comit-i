import parseQuery from "./parseQuery";

describe("parseQuery", () => {
  it("should parse the link given by the protocol handler", () => {
    const query =
      "?web%2Bcomit%3A%2F%2Fswap%3Falpha_ledger%3Dbitcoin%26beta_ledger%3Dethereum%26alpha_asset%3D1.5BTC%26beta_asset%3D420ERC20%3A0xB97048628DB6B661D4C2aA833e95Dbe1A905B280%26protocol%3Drfc003%26peer%3DQma9T5YraSnpRDZqRR4krcSJabThc8nwZuJV3LercPHufi";

    const result = parseQuery(query);

    expect(result).toMatchObject({
      alpha_ledger: "bitcoin",
      beta_ledger: "ethereum",
      alpha_asset: "1.5BTC",
      beta_asset: "420ERC20:0xB97048628DB6B661D4C2aA833e95Dbe1A905B280",
      protocol: "rfc003",
      peer: "Qma9T5YraSnpRDZqRR4krcSJabThc8nwZuJV3LercPHufi"
    });
  });

  it("should link with duplicated keys", () => {
    const query =
      "?web%2Bcomit%3A%2F%2Fswap%3Falpha_ledger%3Dbitcoin%26alpha_ledger%3Dbitcoin%26beta_ledger%3Dethereum%26alpha_asset%3D1.5BTC%26beta_asset%3D420ERC20%3A0xB97048628DB6B661D4C2aA833e95Dbe1A905B280%26protocol%3Drfc003%26peer%3DQma9T5YraSnpRDZqRR4krcSJabThc8nwZuJV3LercPHufi";

    const result = parseQuery(query);

    expect(result).toMatchObject({
      alpha_ledger: "bitcoin",
      beta_ledger: "ethereum",
      alpha_asset: "1.5BTC",
      beta_asset: "420ERC20:0xB97048628DB6B661D4C2aA833e95Dbe1A905B280",
      protocol: "rfc003",
      peer: "Qma9T5YraSnpRDZqRR4krcSJabThc8nwZuJV3LercPHufi"
    });
  });
});
