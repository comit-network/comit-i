export enum ParameterKind {
  Network,
  Quantity,
  Address
}

export interface Parameter {
  name: string;
  label: string;
  type: ParameterKind;
  [key: string]: any;
}

export interface LedgerSpec {
  name: string;
  label: string;
  parameters: Parameter[];
  assets: AssetSpec[];
}

interface AssetSpec {
  name: string;
  label: string;
  parameters: Parameter[];
}

const ledgers: LedgerSpec[] = [
  {
    name: "bitcoin",
    label: "Bitcoin",
    parameters: [
      {
        name: "network",
        label: "Network",
        type: ParameterKind.Network,
        options: ["mainnet", "testnet", "regtest"]
      }
    ],
    assets: [
      {
        name: "bitcoin",
        label: "Bitcoin",
        parameters: [
          {
            name: "quantity",
            label: "Quantity",
            type: ParameterKind.Quantity,
            unit: "BTC",
            smallestUnit: "sat"
          }
        ]
      }
    ]
  },
  {
    name: "ethereum",
    label: "Ethereum",
    parameters: [
      {
        name: "network",
        label: "Network",
        type: ParameterKind.Network,
        options: ["mainnet", "ropsten", "regtest"]
      }
    ],
    assets: [
      {
        name: "ether",
        label: "Ether",
        parameters: [
          {
            name: "quantity",
            label: "Quantity",
            type: ParameterKind.Quantity,
            unit: "ETH",
            smallestUnit: "wei"
          }
        ]
      },
      {
        name: "erc20",
        label: "ERC20",
        parameters: [
          {
            name: "quantity",
            label: "Quantity",
            type: ParameterKind.Quantity
          },
          {
            name: "token_contract",
            label: "Token Contract Address",
            type: ParameterKind.Address
          }
        ]
      }
    ]
  }
];

export default ledgers;
