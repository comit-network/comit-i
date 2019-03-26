import { QueryParams } from "./parseQuery";

export interface Ledger {
  name: string;
  network: string;
}

export interface Asset {
  symbol: string;
  amount: string;
  tokenId?: string;
}

export interface SwapParams {
  alphaLedger: Ledger;
  alphaAsset: Asset;
  betaLedger: Ledger;
  betaAsset: Asset;
  protocol: string;
  peer: string;
  id: string;
}

export default function parseSwapParams(queryParams: QueryParams): SwapParams {
  const alphaLedger = parseLedger(queryParams.alpha_ledger, "alpha");
  const alphaAsset = parseAsset(queryParams.alpha_asset, "alpha");

  const betaLedger = parseLedger(queryParams.beta_ledger, "beta");
  const betaAsset = parseAsset(queryParams.beta_asset, "beta");

  const protocol = parseProtocol(queryParams.protocol);
  const peer = parsePeer(queryParams.peer);
  const id = "42";

  return {
    alphaLedger,
    alphaAsset,
    betaLedger,
    betaAsset,
    protocol,
    peer,
    id
  };
}

function parseLedger(input: string | undefined, ledger: string): Ledger {
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

function parseAsset(input: string | undefined, asset: string): Asset {
  if (!input) {
    throw new Error(asset + " undefined");
  }
  const regex = /([.0-9]+)([a-zA-Z]+[0-9]*)(:(.+))?/g;

  const match = regex.exec(input) || [];
  if (!match.length || !match[1] || !match[2]) {
    throw new Error(asset + " asset could not be parsed. Was: " + input);
  }
  const amount = match[1];
  const symbol = match[2];
  const tokenId = match[4] || undefined;

  return { amount, symbol, tokenId };
}

function parsePeer(peer: string | string[] | undefined | null) {
  if (peer instanceof Array) {
    return peer[0];
  }
  return peer || "";
}

function parseProtocol(protocol: string | undefined) {
  return protocol || "";
}
