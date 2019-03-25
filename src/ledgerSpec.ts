export enum ParameterKind {
  Network,
  Quantity
}

export interface Parameter {
  name: string;
  type: ParameterKind;
  options?: string[];
}

const ledgers = [
  {
    name: "bitcoin",
    parameters: [
      {
        name: "network",
        type: ParameterKind.Network,
        options: ["mainnet", "testnet", "regtest"]
      }
    ],
    assets: [
      {
        name: "bitcoin",
        parameters: [
          {
            name: "quantity",
            type: ParameterKind.Quantity
          }
        ]
      }
    ]
  },
  {
    name: "ethereum",
    parameters: [
      {
        name: "network",
        type: ParameterKind.Network,
        options: ["mainnet", "ropsten", "regtest"]
      }
    ],
    assets: [
      {
        name: "ether",
        parameters: [
          {
            name: "quantity",
            type: ParameterKind.Quantity
          }
        ]
      }
    ]
  }
];

export default ledgers;
