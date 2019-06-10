import axios from "axios";
import update from "immutability-helper";
import { Rfc003Params } from "../forms/Rfc003ParamsForm";
import { Swap, SwapValue } from "../forms/SwapForm";
import { relativeMinutesToTimestamp } from "../time";
import apiEndpoint from "./apiEndpoint";
import { toSmallestUnit } from "./unit";

function adjustAssetUnit(value: SwapValue) {
  const asset = {
    name: value.name,
    quantity: value.quantity as string,
    token_contract: value.token_contract
  };

  const adjustedQuantity = toSmallestUnit(asset);

  return update(asset, {
    quantity: { $set: adjustedQuantity }
  });
}

export default function postRfc003Swap(
  swap: Swap,
  params: Rfc003Params,
  peerId: string,
  addressHint: string
) {
  const uri = apiEndpoint()
    .path("swaps/rfc003")
    .toString();

  const adjustedSwap = update(swap, {
    alpha_asset: {
      $apply: adjustAssetUnit
    },
    beta_asset: {
      $apply: adjustAssetUnit
    }
  });

  const adjustedParams = update(params, {
    alpha_expiry: { $apply: relativeMinutesToTimestamp },
    beta_expiry: { $apply: relativeMinutesToTimestamp }
  });

  let peer;
  if (addressHint) {
    peer = { peer_id: peerId, address_hint: addressHint };
  }

  return axios.post(
    uri,
    {
      ...adjustedSwap,
      ...adjustedParams,
      peer: peer ? peer : peerId
    },
    {
      timeout: 2000
    }
  );
}
