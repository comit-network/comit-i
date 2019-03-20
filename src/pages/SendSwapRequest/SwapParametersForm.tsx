import { Grid } from "@material-ui/core";
import React, { Dispatch } from "react";
import Select, { Parameter } from "./Select";

function findLedgerSpec(ledgers: LedgerSpec[], ledger: string) {
  return ledgers.find(ledgerSpec => ledgerSpec.name === ledger);
}

function findAssetSpec(ledgers: LedgerSpec[], ledger: string, asset: string) {
  const ledgerSpec = findLedgerSpec(ledgers, ledger);

  if (ledgerSpec) {
    return ledgerSpec.assets.find(assetSpec => assetSpec.name === asset);
  }
}

interface LedgerSpec {
  name: string;
  parameters: Parameter[];
  assets: AssetSpec[];
}

interface AssetSpec {
  name: string;
  parameters: Parameter[];
}

export interface Swap {
  alpha_ledger: {
    name: string;
    [parameter: string]: string | undefined;
  };
  alpha_asset: {
    name: string;
    [parameter: string]: string | undefined;
  };
  beta_ledger: {
    name: string;
    [parameter: string]: string | undefined;
  };
  beta_asset: {
    name: string;
    [parameter: string]: string | undefined;
  };
}

export type Action =
  | {
      type: "change-parameter";
      of: keyof Swap;
      payload: { name: string; newValue: string };
    }
  | {
      type: "change-selection";
      of: keyof Swap;
      payload: { newSelection: string };
    };

export function reducer(swap: Swap, action: Action): Swap {
  switch (action.type) {
    case "change-parameter": {
      return {
        ...swap,
        [action.of]: {
          ...swap[action.of],
          [action.payload.name]: action.payload.newValue
        }
      };
    }
    case "change-selection": {
      const newSwap = {
        ...swap,
        [action.of]: {
          name: action.payload.newSelection
        }
      };

      const defaultAsset = { name: "" };
      switch (action.of) {
        case "alpha_ledger": {
          return {
            ...newSwap,
            alpha_asset: defaultAsset
          };
        }
        case "beta_ledger": {
          return {
            ...newSwap,
            beta_asset: defaultAsset
          };
        }
        default:
          return newSwap;
      }
    }
  }
}

interface Props {
  swap: Swap;
  ledgers: LedgerSpec[];
  dispatch: Dispatch<Action>;
}

function SwapForm({ swap, ledgers, dispatch }: Props) {
  const alphaLedger = swap.alpha_ledger;
  const betaLedger = swap.beta_ledger;
  const alphaAsset = swap.alpha_asset;
  const betaAsset = swap.beta_asset;

  const ledgerOptions = ledgers.map(ledger => ledger.name);

  const alphaLedgerSpec = findLedgerSpec(ledgers, alphaLedger.name);
  const alphaAssetSpec = findAssetSpec(
    ledgers,
    alphaLedger.name,
    alphaAsset.name
  );
  const betaLedgerSpec = findLedgerSpec(ledgers, betaLedger.name);
  const betaAssetSpec = findAssetSpec(ledgers, betaLedger.name, betaAsset.name);

  const alphaAssets = alphaLedgerSpec
    ? alphaLedgerSpec.assets.map(asset => asset.name)
    : [];

  const betaAssets = betaLedgerSpec
    ? betaLedgerSpec.assets.map(asset => asset.name)
    : [];

  const alphaLedgerParameters = alphaLedgerSpec
    ? alphaLedgerSpec.parameters
    : [];
  const alphaAssetParameters = alphaAssetSpec ? alphaAssetSpec.parameters : [];
  const betaLedgerParameters = betaLedgerSpec ? betaLedgerSpec.parameters : [];
  const betaAssetParameters = betaAssetSpec ? betaAssetSpec.parameters : [];

  return (
    <React.Fragment>
      <Grid item={true} xs={12}>
        <fieldset>
          <legend>Alpha</legend>
          <Select
            selection={alphaLedger}
            options={ledgerOptions}
            disabledOptions={[betaLedger.name]}
            onSelectionChange={selection =>
              dispatch({
                type: "change-selection",
                of: "alpha_ledger",
                payload: { newSelection: selection }
              })
            }
            onParameterChange={(name, value) =>
              dispatch({
                of: "alpha_ledger",
                type: "change-parameter",
                payload: { name, newValue: value }
              })
            }
            parameters={alphaLedgerParameters}
            label={"Ledger"}
          />
          {alphaLedger.name && (
            <Select
              selection={alphaAsset}
              options={alphaAssets}
              onSelectionChange={selection =>
                dispatch({
                  type: "change-selection",
                  of: "alpha_asset",
                  payload: { newSelection: selection }
                })
              }
              onParameterChange={(name, value) =>
                dispatch({
                  type: "change-parameter",
                  of: "alpha_asset",
                  payload: { name, newValue: value }
                })
              }
              disabledOptions={[]}
              parameters={alphaAssetParameters}
              label={"Asset"}
            />
          )}
        </fieldset>
      </Grid>
      <Grid item={true} xs={12}>
        <fieldset>
          <legend>Beta</legend>
          <Select
            selection={betaLedger}
            options={ledgerOptions}
            disabledOptions={[alphaLedger.name]}
            onSelectionChange={selection =>
              dispatch({
                of: "beta_ledger",
                type: "change-selection",
                payload: { newSelection: selection }
              })
            }
            onParameterChange={(name, value) =>
              dispatch({
                type: "change-parameter",
                of: "beta_ledger",
                payload: { name, newValue: value }
              })
            }
            parameters={betaLedgerParameters}
            label={"Ledger"}
          />
          {betaLedger.name && (
            <Select
              selection={betaAsset}
              options={betaAssets}
              onSelectionChange={selection =>
                dispatch({
                  of: "beta_asset",
                  type: "change-selection",
                  payload: { newSelection: selection }
                })
              }
              onParameterChange={(name, value) =>
                dispatch({
                  type: "change-parameter",
                  of: "beta_asset",
                  payload: { name, newValue: value }
                })
              }
              disabledOptions={[]}
              parameters={betaAssetParameters}
              label={"Asset"}
            />
          )}
        </fieldset>
      </Grid>
    </React.Fragment>
  );
}

export default SwapForm;
