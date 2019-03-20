import { FormControl, Grid, InputLabel, Select } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import pascalCase from "pascal-case";
import React from "react";

const useAssetSelectStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: "10rem"
  }
}));

export interface Parameter {
  name: string;
  type: ParameterKind;
}

export interface Asset {
  name: string;
  parameters: Parameter[];
  [parameter: string]: any;
}

interface AssetSelectProps {
  ledger?: string;
  asset: Asset;
  dispatch: (assetAction: AssetAction) => void;
}

export type AssetAction =
  | { type: "change-parameter"; payload: { name: string; newValue: string } }
  | { type: "change-asset"; payload: { newAsset: string } };

function assetOptions(ledger?: string): string[] {
  switch (ledger) {
    case "bitcoin": {
      return ["bitcoin"];
    }
    case "ethereum": {
      return ["ether"];
    }
    default: {
      return [];
    }
  }
}

export enum ParameterKind {
  Quantity
}

function AssetSelect({ ledger, asset, dispatch }: AssetSelectProps) {
  const classes = useAssetSelectStyles();
  const inputName = "asset-input";

  const menuItems = assetOptions(ledger).map(item => (
    <option key={item} value={item}>
      {pascalCase(item)}
    </option>
  ));

  const parameters = asset.parameters.map(param => {
    switch (param.type) {
      case ParameterKind.Quantity: {
        return (
          <Grid key={param.name} item={true} xs={12} md={6}>
            <TextField
              required={true}
              className={classes.formControl}
              type="number"
              value={asset[param.name] || ""}
              onChange={event => {
                dispatch({
                  type: "change-parameter",
                  payload: { name: param.name, newValue: event.target.value }
                });
              }}
              label="Quantity"
            />
          </Grid>
        );
      }
    }
  });

  return (
    <Grid item={true} xs={12} container={true} spacing={0}>
      <Grid item={true} xs={12} md={6}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={inputName}>Asset</InputLabel>
          <Select
            native={true}
            required={true}
            value={asset.name}
            onChange={event =>
              dispatch({
                type: "change-asset",
                payload: { newAsset: event.target.value }
              })
            }
            inputProps={{
              name: inputName
            }}
          >
            <option value={""} />
            {menuItems}
          </Select>
        </FormControl>
      </Grid>
      {parameters}
    </Grid>
  );
}

export default AssetSelect;
