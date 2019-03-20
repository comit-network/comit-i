import { FormControl, Grid, InputLabel, Select } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import pascalCase from "pascal-case";
import React, { Dispatch } from "react";

const useLedgerSelectStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: "10rem"
  }
}));

export interface Ledger {
  name: string;
  parameters: Parameter[];
  [parameter: string]: any;
}

export enum ParameterKind {
  Network
}

export interface Parameter {
  name: string;
  type: ParameterKind;
  options: string[];
}

interface LedgerSelectProps {
  ledger: Ledger;
  dispatch: Dispatch<LedgerAction>;
  disabledValues: string[];
}

export type LedgerAction =
  | { type: "change-parameter"; payload: { name: string; newValue: string } }
  | { type: "change-ledger"; payload: { newLedger: string } };

function ledgerOptions(): string[] {
  return ["bitcoin", "ethereum"];
}

function LedgerSelect({ ledger, dispatch, disabledValues }: LedgerSelectProps) {
  const classes = useLedgerSelectStyles();
  const inputName = "ledger-input";

  const ledgers = ledgerOptions().map(ledger => (
    <option disabled={disabledValues.indexOf(ledger) !== -1} value={ledger}>
      {pascalCase(ledger)}
    </option>
  ));

  const parameters = ledger.parameters.map(param => {
    switch (param.type) {
      case ParameterKind.Network: {
        const inputName = "network-input";
        return (
          <Grid item={true} xs={12} md={6}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor={inputName}> Network </InputLabel>
              <Select
                native={true}
                required={true}
                value={ledger[param.name] || ""}
                onChange={event =>
                  dispatch({
                    type: "change-parameter",
                    payload: { name: param.name, newValue: event.target.value }
                  })
                }
                inputProps={{
                  name: inputName
                }}
              >
                {param.options.map(value => (
                  <option value={value} key={value}>
                    {pascalCase(value)}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        );
      }
    }
  });

  return (
    <Grid item={true} xs={12} container={true} spacing={0}>
      <Grid item={true} xs={12} md={6}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor={inputName}>Ledger</InputLabel>
          <Select
            native={true}
            required={true}
            variant="outlined"
            value={ledger.name}
            onChange={event =>
              dispatch({
                type: "change-ledger",
                payload: { newLedger: event.target.value }
              })
            }
            inputProps={{
              name: inputName
            }}
          >
            <option value={""} />
            {ledgers}
          </Select>
        </FormControl>
      </Grid>
      {ledger && parameters}
    </Grid>
  );
}

export default LedgerSelect;
