import { toBitcoin } from "satoshi-bitcoin-ts";
import { fromWei } from "web3-utils";
import { Asset } from "./swapTypes";

export function toMainUnit(asset: Asset) {
  switch (asset.name) {
    case "ether":
      return fromWei(asset.quantity, "ether");
    case "bitcoin":
      return toBitcoin(asset.quantity, true).toString();
    case "erc20":
    default:
      return asset.quantity;
  }
}

export function mainUnitSymbol(asset: Asset) {
  switch (asset.name) {
    case "ether":
      return "ETH";
    case "bitcoin":
      return "BTC";
    case "erc20":
      return "ERC20";
    default:
      return asset.name;
  }
}
