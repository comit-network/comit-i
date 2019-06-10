import { SwapValue } from "../../forms/SwapForm";
import { QueryDialInfo, QueryParams } from "./parseQuery";

export interface SwapParams {
  alphaLedger: SwapValue;
  alphaAsset: SwapValue;
  betaLedger: SwapValue;
  betaAsset: SwapValue;
  protocol: string;
  peerId: string;
  addressHint: string;
}

export default function parseSwapParams(queryParams: QueryParams): SwapParams {
  const alphaLedger = parseLedger(queryParams.alpha_ledger, "alpha");
  const alphaAsset = parseAsset(queryParams.alpha_asset, "alpha");

  const betaLedger = parseLedger(queryParams.beta_ledger, "beta");
  const betaAsset = parseAsset(queryParams.beta_asset, "beta");

  const protocol = parseProtocol(queryParams.protocol);
  const { peerId, addressHint } = parsePeer(queryParams.peer);

  return {
    alphaLedger,
    alphaAsset,
    betaLedger,
    betaAsset,
    protocol,
    peerId,
    addressHint
  };
}

function parseLedger(input: string | undefined, ledger: string): SwapValue {
  if (!input) {
    throw new Error(ledger + " undefined");
  }
  const regex = /([A-Za-z0-9]+)(-([a-zA-Z0-9]+))?/g;

  const match = regex.exec(input) || [];
  if (!match.length || !match[1]) {
    throw new Error(ledger + " ledger could not be parsed. Was: " + input);
  }
  const name = match[1];
  const network = match[3] || "mainnet";
  return { name, network };
}

function symbolToAssetName(symbol: string) {
  switch (symbol) {
    case "BTC": {
      return "bitcoin";
    }
    case "ETH": {
      return "ether";
    }
    case "ERC20": {
      return "erc20";
    }
    default:
      return "";
  }
}

function tokenIdToAssetParameter(asset: string, tokenId: string) {
  switch (asset) {
    case "erc20": {
      return {
        token_contract: tokenId
      };
    }
  }
}

function parseAsset(input: string | undefined, asset: string): SwapValue {
  if (!input) {
    throw new Error(asset + " undefined");
  }
  const regex = /([.0-9]+)([a-zA-Z]+[0-9]*)(:(.+))?/g;

  const match = regex.exec(input) || [];
  if (!match.length || !match[1] || !match[2]) {
    throw new Error(asset + " asset could not be parsed. Was: " + input);
  }
  const quantity = match[1];
  const symbol = match[2];
  const tokenId = match[4];

  const name = symbolToAssetName(symbol);
  const tokenIdParameters = tokenIdToAssetParameter(name, tokenId);

  return { name, quantity, ...tokenIdParameters };
}

function parsePeer(peer: string | QueryDialInfo | string[] | undefined | null) {
  if (!peer) {
    return { peerId: "", addressHint: "" };
  }
  if (peer instanceof Array) {
    return { peerId: peer[0], addressHint: "" };
  }
  if (typeof peer === "string") {
    return { peerId: peer, addressHint: "" };
  }
  if (peer.hasOwnProperty("peer_id") && peer.hasOwnProperty("address_hint")) {
    return { peerId: peer.peer_id, addressHint: peer.address_hint };
  }
  return { peerId: "", addressHint: "" };
}

function parseProtocol(protocol: string | undefined) {
  return protocol || "";
}
