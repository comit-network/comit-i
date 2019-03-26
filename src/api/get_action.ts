import axios from "axios";
import getHostAndPort from "./getHostAndPort";

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

export default function getAction(path: string) {
  return axios
    .get("http://" + getHostAndPort() + path)
    .then(res => res.data)
    .then(body => body as LedgerAction);
}
