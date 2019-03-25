import axios from "axios";

export type LedgerAction =
  | {
      type: "bitcoin-send-amount-to-address";
      payload: { to: string; amount: string; network: string };
    }
  | {
      type: "bitcoin-broadcast-signed-transaction";
      payload: { hex: string; network: string };
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
      type: "ethereum-invoke-contract";
      payload: {
        contract_address: string;
        data: string;
        amount: string;
        gas_limit: string;
        network: string;
      };
    };

export default async function getAction(url: string) {
  return axios
    .get<LedgerAction>("http://localhost:8010" + url)
    .then(res => res.data.payload);
}
