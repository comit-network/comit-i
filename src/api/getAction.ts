import axios from "axios";

export type LedgerAction =
  | {
      type: "bitcoin-send-amount-to-address";
      payload: { to: string; amount: string; network: string };
    }
  | {
      type: "bitcoin-broadcast-signed-transaction";
      payload: { hex: string; network: string; min_median_block_time?: number };
    }
  | {
      type: "ethereum-deploy-contract";
      payload: {
        data: string;
        amount: string;
        gas_limit: string;
        network: string;
      };
    }
  | {
      type: "ethereum-call-contract";
      payload: {
        contract_address: string;
        data: string;
        amount: string;
        gas_limit: string;
        network: string;
        min_block_timestamp?: number;
      };
    };

export default function getAction(uri: uri.URI) {
  return axios
    .get(uri.toString())
    .then(res => res.data)
    .then(body => body as LedgerAction);
}
